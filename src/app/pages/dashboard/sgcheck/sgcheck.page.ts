import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, AlertController, NavController, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { NgForm } from '@angular/forms';
import { AjaxService } from 'src/app/services/ajax.service';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from 'src/app/services/storage.service';
import { mapTo } from 'rxjs/operators';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
	selector: 'app-sgcheck',
	templateUrl: './sgcheck.page.html',
	styleUrls: ['./sgcheck.page.scss'],
})

export class SgcheckPage implements OnInit {
	infiniteScroll: IonInfiniteScroll;
	isConnected = true;
	private online: Observable<boolean> = null;

	cargando : boolean = false;
	contenido: boolean = true;

	barcodeScannerOptions: BarcodeScannerOptions;

	verBusqueda = false;
	listaVehiculos: any;
	vehiculo: any;

	repetidos = false;
	listaRepetidos: any;

	procesados: any;
	mostrarProcesados = false;

	VINSCHECK: any = [];

	@ViewChild('buscador', null) buscador : any;

	constructor(
		private menu: MenuController,
		private AjaxService: AjaxService,
		private alertService: AlertService,
		private alertController: AlertController,
		private navCtrl: NavController,
		private storageService: StorageService,
		private network: Network,
		private platform: Platform,
		private http: HttpClient,
		private barcodeScanner: BarcodeScanner,
	){
		this.barcodeScannerOptions = {
			showTorchButton: true,
			showFlipCameraButton: true
		}

		if(!(this.platform.is('mobileweb') || this.platform.is('desktop'))){
			// On Device 
			this.platform.backButton.subscribe(() => {
				if(this.verBusqueda){
					this.volver();
				}
			});

			this.network.onDisconnect().subscribe(() => {
				this.isConnected = false;
			});

			this.network.onConnect().subscribe(() => {
				setTimeout(() => {
					this.isConnected = true;
				}, 2000);
			});

			try{
				this.getNetworkTestRequest().subscribe(
					success => {
						this.isConnected = true;
						return;
					}, error => {
						this.isConnected = false;
						return;
					}
					);
			}catch(err){
				this.isConnected = false;
				return;
			}
		}else{
			// On Browser 
			this.online = merge(
				of(navigator.onLine), 
				fromEvent(window, 'online').pipe(mapTo(true)),
				fromEvent(window, 'offline').pipe(mapTo(false))
				);

			this.online.subscribe((isOnline) => {
				if(isOnline){
					this.isConnected = true;
				}else{
					this.isConnected = false;
				}
			});
		}
		this.menu.enable(true);
	}

	ngOnInit(){
	}

	async ionViewWillEnter(){
		this.menu.close();
		await this.storageService.get('VINSCHECK').then(
			(data:any) => {
				if(data != null) {
					data = JSON.parse(data);
					this.VINSCHECK = data;
				}
			}
		);

		document.getElementById('listaVins').innerHTML = '';
		var self = this;
		setTimeout(function(){
			self.actualizarInformacion();
		}, 2000);
	}

	doRefresh(event){
		var self = this;
		setTimeout(() => {
			event.target.complete();
			self.actualizarInformacion();
		}, 2000);
	}

	async actualizarInformacion(){
		this.repetidos = false;
		if(this.isConnected){
			await this.guardarMovimientos().then(() => {
				setTimeout(() => {
					this.cargarInformacion();
				}, 500);
			});
		}else{
			await this.storageService.get('VINSCHECK').then(
				(data:any) => {
					data = JSON.parse(data);
					this.VINSCHECK = data;
					if(data != null){
						this.listaVehiculos = data;

						document.getElementById('listaVins').innerHTML = '';
						if(this.listaVehiculos.length > 0){
							this.length = 0;
							this.appendItems(20);
						}
					}
				}
			);
			this.loader(false);
		}
	}

	// 24/02/2020 JCSM - Guarda Movimientos hechos sin conexión
	async guardarMovimientos(){
		await this.storageService.get('ListasChequeadas').then(
			(data:any) => {
				data = JSON.parse(data);
				if(data != null){
					this.AjaxService.ajax('Dashboard/cSGCHECK/GuardarMovimientos', {
						movim: JSON.stringify(data)
					}).subscribe(
					(dt:any) => {
						if(dt.body == 1){
							this.storageService.remove('ListasChequeadas');
						}else if(dt.body == 0){
							this.alertService.presentToast('Ocurrio un error al procesar la información');
						}else{
							if(dt.body.length > 0){
								this.mostrarProcesados = true;
								this.procesados = dt.body;
								this.storageService.remove('ListasChequeadas');
							}
						}
					},
					error => {
						this.alertService.presentToast('Ha ocurrido un ploblema');
						console.log(error);
					},
					() => {
					}
					);
				}
			}
		);
	}

	async cargarInformacion(){
		this.loader(true);
		await this.AjaxService.ajax('Dashboard/cSGCHECK/CargarInformacion', {
			param: '0'
		}).subscribe(
		(data:any) => {
			this.listaVehiculos = data.body.VINSCHECK;
			this.VINSCHECK = this.listaVehiculos;
			this.storageService.set('VINSCHECK', JSON.stringify(this.listaVehiculos));

			document.getElementById('listaVins').innerHTML = '';
			if(this.listaVehiculos.length > 0){
				this.length = 0;
				this.appendItems(20);
			}
		},
		error => {
			this.alertService.presentToast('Ha ocurrido un ploblema');
			console.log(error);
			this.loader(false);
		},
		() => {
			this.loader(false);
		}
		);
	}

	volver(){
		this.verBusqueda = false;
		var data : any = this.VINSCHECK;

		if(data != null){
			this.listaVehiculos = data;

			document.getElementById('listaVins').innerHTML = '';
			if(this.listaVehiculos.length > 0){
				this.length = 0;
				this.appendItems(20);
			}
		}
	}

	mostrarBusqueda(){
		this.verBusqueda = true;
		setTimeout(() => {
			this.buscador.setFocus();
		}, 500);
	}

	async buscarVin(form: NgForm){
		if(form.value.vin != ''){
			this.length = 0;
			var data : any = this.VINSCHECK;
			
			if(data != null){
				this.listaVehiculos = data;

				document.getElementById('listaVins').innerHTML = '';
				if(this.listaVehiculos.length > 0){
					var lista = this.listaVehiculos;
					var list = [];
					for(var i = 0; i < lista.length; i++){
						var vin = lista[i].VIN;
						var buscar = form.value.vin;

						if(vin.toLowerCase().indexOf(buscar.toLowerCase()) != -1){
							list.push(lista[i]);
						}
					}

					if(list.length == 0){
						this.alertService.presentToast('No se encontraron coincidencias', 'middle');
					}else{
						this.listaVehiculos = list;

						this.appendItems(20);
					}
				}
			}
		}
	}

	async leerVin(){
		const alert = await this.alertController.create({
			header: 'VIN',
			message: 'Por favor digite los 6 últimos digitos del VIN',
			inputs: [{
				name: 'VIN',
				type: 'text',
				placeholder: 'VIN'
			}],
			buttons:[
			{
				text: 'Cancelar',
				role: 'cancel',
				cssClass: 'secondary',
				handler: () => {
				}
			},
			{
				text: 'Ok',
				handler: (value) => {
					var data : any = this.VINSCHECK;
					value.VIN = value.VIN.substr(value.VIN.length - 6);
					if(value.VIN.length === 6){
						if(this.isConnected){
							this.busquedaVin(value.VIN, 'NULL');
						}else{
							this.search('Barras', value.VIN, data).then((valor:any) => {
								if(valor != undefined && valor.length > 0){
									if(valor.length == 1){
										this.diligenciarCheckList(valor[0]);
									}else{
										this.listaRepetidos = valor;
										this.repetidos = true;
									}
								}else{
									this.alertService.presentToast('No se encontraron coincidencias', 'middle');
								}
							});
						}
					}else{
						this.alertService.presentToast('No se encontraron coincidencias', 'middle');
					}
				}
			}
			]
		});
		await alert.present().then(() => {
			var el = document.getElementsByClassName('alert-input')[0];
			setTimeout(() => {
				document.getElementById(el.getAttribute('id')).focus();
			}, 400);
			return;
		});
	}

	busquedaVin(vin, nLote){
		this.AjaxService.ajax('Dashboard/cSGCHECK/busquedaVIN', {
			Barras : vin,
			Numerolote : nLote
		}).subscribe(
		(resp:any) => {
			if(resp.body == 1){
				this.alertService.presentToast('No se encontraron coincidencias', 'middle');
			}else{
				if(resp.body.length == 1){
					this.diligenciarCheckList(resp.body[0]);
				}else{
					this.listaRepetidos = resp.body;
					this.repetidos = true;
				}
			}
		},
		error => {
			this.alertService.presentToast('Ha ocurrido un ploblema');
			console.log(error);
		},
		() => {
		}
		);
	}

	// Acá va la ruta en dode se diligenciará la lista de chequeo (buena suerte amigos)
	diligenciarCheckList(vehiculo){
		this.storageService.set('vinSeleccionado', JSON.stringify(vehiculo)).then(() => {
			this.navCtrl.navigateRoot('/sgcheck/listacheck');
		});
	}

	ocultarProcesados(){
		this.mostrarProcesados = false;
		this.procesados = [];
	}

	scan(){
		this.barcodeScanner.scan().then(barcodeData => {
			var code = barcodeData.text;
			if(code != ""){
				var nmLote = code.trim();
				var campo = 'VIN';
				if(nmLote.length != 17){
					nmLote = 'NULL';
					campo = 'Barras';
				}

				code = code.trim().substr(-6);
				var self = this;
				if(self.isConnected){
					self.busquedaVin(code, nmLote);
				}else{
					this.search(campo, (campo == 'VIN') ? nmLote : code, this.listaVehiculos).then((valor:any) => {
						if(valor != undefined && valor.length > 0){
							if(valor.length == 1){
								this.diligenciarCheckList(valor[0]);
							}else{
								this.listaRepetidos = valor;
								this.repetidos = true;
							}
						}else{
							self.alertService.presentToast('No se encontraron coincidencias', 'middle');
						}
					});
				}
			}
		}).catch( err => {
			alert(err);
		});
	}

	async search(key, nameKey, myArray){
		var arr = [];
		for (var i = 0; i < myArray.length; i++) {
			if(myArray[i][key] == nameKey.toUpperCase()) {
				arr.push(myArray[i]);
			}
		}
		return arr;
	}

	getNetworkTestRequest(){
		return this.http.get('https://jsonplaceholder.typicode.com/todos/1'); 
	}

	loader(estado : boolean){
		this.cargando = estado === true ? false : true;
		this.contenido = estado === true ? true : false;
	}

	length = 0;

	loadData(event){
		var self = this;
		self.infiniteScroll = event;
		setTimeout(() => {
			event.target.complete();
			self.appendItems(20);
		}, 1000);
	}

	appendItems(number){
		var originalLengh = this.length;
		var list = document.getElementById('listaVins');
		var self = this;
		for (var i = 0; i < number; i++){
			if(this.listaVehiculos[i + originalLengh] != undefined){
				const el = document.createElement('ion-item');
				el.innerHTML = '<ion-label>'+
					`<h6><b>${self.listaVehiculos[i + originalLengh].VIN}</b> <span class="listFecha" style="float: right;font-size: 12px;">${self.listaVehiculos[i + originalLengh].Fecha}</span></h6>`+
					`<ion-card-subtitle> ${self.listaVehiculos[i + originalLengh].Linea} </ion-card-subtitle>`+
					`<ion-card-subtitle> ${self.listaVehiculos[i + originalLengh].Color} </ion-card-subtitle>`+
				'</ion-label>';
				this.apend(list, el, i, originalLengh);
				this.length++;
			}
			if(this.length <= this.listaVehiculos.length && this.length == this.listaVehiculos.length){
				if(self.infiniteScroll != undefined){
					self.infiniteScroll.disabled = true;
				}
				break;
			}
		}
	}

	async apend(list, el, i, originalLengh){
		list.appendChild(el);
		var self = this;
		el.onclick = function(event){
			self.diligenciarCheckList(self.listaVehiculos[i + originalLengh]);
		};
		return;
	}
}