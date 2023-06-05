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
import { IonInfiniteScroll } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import * as moment from 'moment';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {

	@ViewChild('buscador', null) buscador: any;
	FormularioFiltro = { ordenadopor: '', estadopqrid: '', terceroid: '', sucursalid: '', fechainicial: '', fechafinal: '' };
	dataFiltros: any;
	meses: any = "Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre";
	clientes: any;
	sucursales: any;
	estadopqr: any;
	filtro: any = false;
	modal: any;
	infiniteScroll: IonInfiniteScroll;
	isConnected = true;
	private online: Observable<boolean> = null;
	myContacts: any;
	logoempresa: any;
	cargando: boolean = false;
	contenido: boolean = true;
	desplazamientoMasivo = false;
	patioSeleccionado = null;
	filaSeleccionada = null;
	columnaSeleccionada = null;
	letraColumna = null;
	verBusqueda = false;
	listarIncidencias: any;
	vehiculo: any;
	ESTADOS: any = [];
	ESTADOSESTADOS: any = [];
	notadetallepqr: any = [];
	arryayImage: any = [];
	incRelacionadas: any = [];
	tiposParadas: any;
	repetidos = false;
	listaRepetidos: any;
	procesados: any;
	mostrarProcesados = false;
	INCIOFF: any = [];
	INCI: any = [];
	today = new Date();
	year = this.today.getFullYear() + 1;
	length = 0;
	listaChequeoEjecutada: any[] = [];

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
		private callNumber: CallNumber,
	) {
		if (!(this.platform.is('mobileweb') || this.platform.is('desktop'))) {
			// On Device 

			this.platform.backButton.subscribe(() => {
				if (this.patioSeleccionado != null) {
					this.irAtras();
				} else if (this.verBusqueda) {
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

			try {
				this.getNetworkTestRequest().subscribe(success => {
					//con internet
					this.isConnected = true;
					return;
				}, error => {
					//sin internet
					this.isConnected = false;
					return;
				});
			} catch (err) {
				this.isConnected = false;
				return;
			}
		} else {
			// On Browser 
			this.online = merge(
				of(navigator.onLine),
				fromEvent(window, 'online').pipe(mapTo(true)),
				fromEvent(window, 'offline').pipe(mapTo(false))
			);

			//valida si esta en linea o no 
			this.online.subscribe((isOnline) => {
				if (isOnline) {
					this.isConnected = true;
				} else {
					//no esta en linea
					this.isConnected = false;
				}
			});
		}
		this.menu.enable(true);
	}

	async ngOnInit() {
		this.setdataFiltros();
	}

	async setdataFiltros() {
		await this.storageService.get('dataFiltros').then((data: any) => {
			if (data == null) {
				this.dataFiltros = { estadopqrid: '', terceroid: '', sucursalid: '', fechainicial: '', fechafinal: '' };
			} else {
				this.dataFiltros = data;
			}
		});
	}

	async call() {
		let telefonocoordinador;
		await this.storageService.get('usuarios').then((data: any) => {
			telefonocoordinador = data.telefonocoordinador;
		});

		if (telefonocoordinador) {
			this.callNumber.callNumber(telefonocoordinador, true)
				.then(res => console.log('Laucher Dialer!', res))
				.catch(err => console.log('Error Laucher Dialer', err));
		} else {
			this.alertService.presentToast('El Tecnico no tiene télefono de coordinador Asociado');
		}
	}

	async ionViewWillEnter() {
		await this.storageService.get('logoempresa').then((data: any) => {
			this.logoempresa = data;
		});

		this.menu.close();

		await this.storageService.get('INCIOFF').then((data: any) => {
			if (data != null) {
				data = JSON.parse(data);
				this.INCIOFF = data;
			}
		});

		await this.storageService.get('INCI').then((data: any) => {
			if (data != null) {
				data = JSON.parse(data);
				this.INCI = data;
			}
		});

		document.getElementById('lista').innerHTML = '';
		var self = this;
		this.actualizarInformacion();
		setTimeout(function () {
		}, 2000);

		this.storageService.remove('inciSeleccionado');
	}

	doRefresh(event) {
		var self = this;
		setTimeout(() => {
			event.target.complete();
			self.actualizarInformacion();
		}, 2000);
	}

	volver() {
		this.verBusqueda = false;
		if (this.INCI != null) {
			this.listarIncidencias = this.INCI;
			document.getElementById('lista').innerHTML = '';
			if (this.listarIncidencias.length > 0) {
				this.length = 0;
				this.appendItems(20);
			}
		}
	}

	mostrarBusqueda() {
		this.verBusqueda = true;
		setTimeout(() => {
			this.buscador.setFocus();
		}, 500);
	}

	async buscarVin(form: NgForm) {
		if (form.value.pqrid != '') {

			this.length = 0;
			this.listarIncidencias = this.INCI;

			document.getElementById('lista').innerHTML = '';

			if (this.listarIncidencias.length > 0) {
				var lista = this.listarIncidencias;
				var list = [];
				for (var i = 0; i < lista.length; i++) {
					var vin = lista[i].pqrid;
					var buscar = form.value.pqrid;

					if (vin.toLowerCase().indexOf(buscar.toLowerCase()) != -1) {
						list.push(lista[i]);
					}
				}

				if (list.length == 0) {
					this.alertService.presentToast('No se encontraron coincidencias', 'middle');
				} else {
					this.listarIncidencias = list;
					this.appendItems(20);
				}
			}
		} else {
			this.listarIncidencias = this.INCI;
		}
	}

	buscarLote(repetido) {
		if (this.patioSeleccionado != null) {
			this.vehiculo = repetido;
		} else {
			this.busquedaVin('NULL', repetido.Numerolote);
		}
	}

	async leerInc() {
		const alert = await this.alertController.create({
			header: 'Incidencia',
			message: 'Por favor digite el número de la Incidencia',
			inputs: [{
				name: 'INC',
				type: 'text',
				placeholder: 'INC'
			}],
			buttons: [
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
						var data: any = this.INCI;
						if (value.INC.length > 0) {
							this.search('pqrid', value.INC, data).then((valor: any) => {
								if (this.isConnected) {
									this.busquedaVin(value.INC, 'NULL');
								} else {
									if (valor != undefined && valor.length > 0) {
										if (valor.length == 1) {
											this.ordentrabajo(valor[0]);
										}
									} else {
										this.busquedaIncOffline(value.INC);
									}
								}
							});
						} else {
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

	async verOcultarFiltro() {
		if (this.filtro == false) {
			this.filtro = true;
			this.DtosInicialesFiltro();
		} else {
			this.filtro = false;
			this.actualizarInformacion();
		}
	}

	//Carga el listado de la incidencias
	async filtrar(form: NgForm) {
		this.cargarInformacion(form.value);
	}

	async verTodos() {
		this.filtro = false;
		this.dataFiltros = { estadopqrid: '', terceroid: '', sucursalid: '', fechainicial: '', fechafinal: '' };
		this.storageService.remove('dataFiltros');
		this.storageService.set('dataFiltros', this.dataFiltros);
		this.actualizarInformacion();
	}

	async changeSucursal(e) {
		this.FormularioFiltro.sucursalid = null;
		this.AjaxService.ajax('Dashboard/cMovimientoApp/changeSucursal', {
			param: e
		}).subscribe((resp: any) => {
			if (resp.body == 1) {
				this.alertService.presentToast('No se encontraron coincidencias', 'middle');
			} else {
				this.sucursales = resp.body.SUCURSALES;
				this.FormularioFiltro.terceroid = this.dataFiltros.terceroid;
				setTimeout(() => {
					this.FormularioFiltro.ordenadopor = this.dataFiltros.ordenadopor;
					this.FormularioFiltro.sucursalid = this.dataFiltros.sucursalid;
					this.FormularioFiltro.fechainicial = this.dataFiltros.fechainicial;
					this.FormularioFiltro.fechafinal = this.dataFiltros.fechafinal;
					this.FormularioFiltro.estadopqrid = this.dataFiltros.estadopqrid;
				}, 500);
			}
		}, error => {
			this.alertService.presentToast('Ha ocurrido un problema');
			console.error(error);
		}, () => {
		});
	}

	async DtosInicialesFiltro() {
		this.setdataFiltros();
		this.FormularioFiltro = { ordenadopor: '', estadopqrid: '', terceroid: '', sucursalid: '', fechainicial: '', fechafinal: '' };
		this.AjaxService.ajax('Dashboard/cMovimientoApp/DtosInicialesFiltro', {
			param: '0'
		}).subscribe((resp: any) => {
			if (resp.body == 1) {
				this.alertService.presentToast('No se encontraron coincidencias', 'middle');
			} else {
				this.estadopqr = resp.body.ESTADOS;
				this.clientes = resp.body.CLIENTES;
				if (this.dataFiltros.terceroid != '') {
					this.changeSucursal(this.dataFiltros.terceroid);
				} else {
					setTimeout(() => {
						this.FormularioFiltro = this.dataFiltros;
					}, 500);
				}
			}
		}, error => {
			this.alertService.presentToast('Ha ocurrido un ploblema');
			console.error(error);
		}, () => {
		});
	}

	async busquedaIncOffline(vin) {
		this.alertService.presentToast('Ejecutando consulta fuera de línea');
		await this.storageService.get('INCI').then((data: any) => {
			var retornar = 1;
			if (data != null) {
				var listaINC = data;
				if (listaINC.length > 0) {
					var BIMS = [];
					for (var i = 0; i < listaINC.length; i++) {
						if (listaINC[i].Barras == vin.toUpperCase()) {
							BIMS.push(listaINC[i]);
							retornar = 0;
						}
					}
					if (BIMS.length == 1) {
						this.storageService.set('trasladoVin', JSON.stringify(BIMS[0]));
						this.navCtrl.navigateRoot('/trasladar');
					} else {
						this.listaRepetidos = BIMS;
						this.repetidos = true;
					}
				}
			}
			if (retornar == 1) {
				this.alertService.presentToast('No se encontraron coincidencias, Intente descargar las Incidencias primero');
				return false;
			}
		});
	}

	busquedaVin(Inc, nLote) {
		this.AjaxService.ajax('Dashboard/cMovimientoApp/busquedaINC', {
			pqrid: Inc,
		}).subscribe((resp: any) => {
			if (resp.body == 1) {
				this.alertService.presentToast('No se encontraron coincidencias', 'middle');
			} else {
				if (resp.body.INCI.length > 0) {
					this.ordentrabajo(resp.body.INCI[0]);
				}
			}
		}, error => {
			this.alertService.presentToast('Ha ocurrido un ploblema');
			console.error(error);
		}, () => { });
	}

	ordentrabajo(incidencia) {
		this.storageService.set('inciSeleccionado', JSON.stringify(incidencia)).then(() => {
			this.navCtrl.navigateRoot('/ordentrabajo');
		});
	}

	ocultarProcesados() {
		this.mostrarProcesados = false;
		this.procesados = [];
	}

	async actualizarInformacion() {
		this.repetidos = false;
		if (this.isConnected) {
			await this.guardarMovimientos().then(() => {
				setTimeout(() => {
					this.cargarInformacion(this.dataFiltros);
				}, 1000);
			});
		} else {
			await this.storageService.get('INCI').then(
				(data: any) => {
					data = JSON.parse(data);
					if (data != null) {
						this.INCI = data;
						this.listarIncidencias = data;

						document.getElementById('lista').innerHTML = '';
						if (this.listarIncidencias.length > 0) {
							this.length = 0;
							this.appendItems(20);
						}
					}
				}
			);

			this.listArryaStorage('tiposParadas', 'tiposParadas');

			this.listArryaStorage('ESTADOS', 'ESTADOS');

			this.loader(false);
		}
	}

	async guardarMovimientos() {
		this.listArryaStorage('notaDetalle', 'notadetallepqr');
		this.listArryaStorage('arryayImage', 'arryayImage');
		this.listArryaStorage('notasIncRelacionadas', 'incRelacionadas');
		this.listArryaStorage('listaChequeoEjecutada', 'listaChequeoEjecutada');
		await this.storageService.get('movimientos').then((data: any) => {
			data = JSON.parse(data);
			if (data != null || this.INCIOFF.length > 0 || this.notadetallepqr.length > 0 || this.arryayImage.length > 0 || this.incRelacionadas.length > 0 || this.listaChequeoEjecutada.length > 0) {
				this.AjaxService.ajax('Dashboard/cMovimientoApp/guardarMovimientos', {
					INCIOFF: JSON.stringify(this.INCIOFF)
					, movim: JSON.stringify(data)
					, notadetallepqr: JSON.stringify(this.notadetallepqr)
					, arryayImage: JSON.stringify(this.arryayImage)
					, incRelacionadas: JSON.stringify(this.incRelacionadas)
					, listaChequeoEjecutada: JSON.stringify(this.listaChequeoEjecutada)
				}).subscribe(
					(dt: any) => {
						if (dt.body == 1) {
							if (data == null) {
								this.listarIncidencias = [];
							}

							this.storageService.remove('movimientos');
							this.storageService.remove('notasIncRelacionadas');
							this.storageService.remove('notaDetalle');
							this.storageService.remove('listaChequeoEjecutada');
							this.storageService.set('arryayImage', JSON.stringify(0));

							this.storageService.remove('INCI');
							this.storageService.remove('INCIOFF');
							this.listaChequeoEjecutada = [];
						} else if (dt.body == 0) {
							this.alertService.presentToast('Ocurrio un error al procesar la información');
						} else {
							if (dt.body.length > 0) {
								this.mostrarProcesados = true;
								this.procesados = dt.body;
								this.storageService.remove('movimientos');
								this.storageService.remove('notasIncRelacionadas');
								this.storageService.remove('notaDetalle');
								this.storageService.remove('listaChequeoEjecutada');
								this.storageService.set('arryayImage', JSON.stringify(0));
								this.listaChequeoEjecutada = [];
							}
						}
					},
					error => {
						this.alertService.presentToast('Ha ocurrido un ploblema');
						console.error(error);
					},
					() => { }
				)
			}
		});
	}

	listArryaStorage(key, vari) {
		this.storageService.get(key).then((data: any) => {
			data = JSON.parse(data);
			if (data != null) {
				this[vari] = data;
			}
		});
	}

	//Carga el listado de la incidencias
	async cargarInformacion(dataFiltros) {
		this.filtro = false;
		let datofiltro = '';
		let orderBy = '';

		if (dataFiltros.estadopqrid) {
			datofiltro += " pq.estadopqrid = '" + dataFiltros.estadopqrid + "' and ";
		}

		if (dataFiltros.terceroid) {
			datofiltro += " pq.terceroid = '" + dataFiltros.terceroid + "' and ";
		}

		if (dataFiltros.sucursalid) {
			datofiltro += " pq.sucursalid = '" + dataFiltros.sucursalid + "' and ";
		}

		if (dataFiltros.fechainicial) {
			datofiltro += " af.fecha >= '" + dataFiltros.fechainicial + "' and ";
		}

		if (dataFiltros.fechafinal) {
			datofiltro += " af.fechafinal <= '" + dataFiltros.fechafinal + "' and ";
		}

		if (dataFiltros.ordenadopor) {
			switch (dataFiltros.ordenadopor) {
				case '1':
					orderBy += "order by pq.sucursalid asc";
					break;

				case '2':
					orderBy += "order by pq.pqrid::int asc";
					break;

				case '3':
					orderBy += "order by pq.pqrid::int desc";
					break;

				case '4':
					orderBy += "order by it.codigointerno asc";
					break;

				case '5':
					orderBy += "order by pq.fechapqr asc";
					break;

				case '6':
					orderBy += "order by qp.nombre asc";
					break;

				case '7':
					orderBy += "order by accion,pq.pqrid::int desc";
					break;
			}
		}

		this.storageService.remove('dataFiltros');
		this.storageService.set('dataFiltros', dataFiltros);

		this.loader(true);

		await this.AjaxService.ajax('Dashboard/cMovimientoApp/busquedaExistFiltro', {
			filtro: datofiltro,
			orderBy: orderBy,
		}).subscribe((data: any) => {
			this.storageService.remove('INCI');
			this.listarIncidencias = data.body.INCI;
			this.INCI = this.listarIncidencias;
			this.storageService.set('INCI', JSON.stringify(this.listarIncidencias)).then(() => {
				document.getElementById('lista').innerHTML = '';
				if (this.listarIncidencias.length > 0) {
					this.length = 0;
					this.appendItems(20);
				}
			});

			this.ESTADOS = data.body.ESTADOS;
			this.storageService.set('ESTADOS', JSON.stringify(data.body.ESTADOS));
			this.storageService.set('TODOSESTADOS', JSON.stringify(data.body.TODOSESTADOS));

			this.tiposParadas = data.body.tiposParadas;
			this.storageService.set('tiposParadas', JSON.stringify(data.body.tiposParadas));
		}, error => {
			this.alertService.presentToast('Ha ocurrido un ploblema');
			console.error(error);
			this.loader(false);
		}, () => {
			this.loader(false);
		});
	}

	async search(key, nameKey, myArray) {
		var arr = [];
		for (var i = 0; i < myArray.length; i++) {
			if (myArray[i][key] == nameKey.toUpperCase()) {
				arr.push(myArray[i]);
			}
		}
		return arr;
	}

	getNetworkTestRequest() {
		return this.http.get('https://jsonplaceholder.typicode.com/todos/1');
	}

	loader(estado: boolean) {
		this.cargando = estado === true ? false : true;
		this.contenido = estado === true ? true : false;
	}

	loadData(event) {
		var self = this;
		self.infiniteScroll = event;
		setTimeout(() => {
			event.target.complete();
			self.appendItems(20);
		}, 1000);
	}


	//recorre el listado de las incidencias para opintarlas en la vista
	appendItems(number) {
		var originalLengh = this.length;
		var list = document.getElementById('lista');
		var self = this;
		for (var i = 0; i < number; i++) {
			if (this.listarIncidencias[i + originalLengh] != undefined && this.listarIncidencias[i + originalLengh].finalizo != 1) {

				let Prioridad = '--';
				if (self.listarIncidencias[i + originalLengh].prioridadid != null) {
					Prioridad = self.listarIncidencias[i + originalLengh].prioridadid
				}

				let Operacion = '--';
				if (self.listarIncidencias[i + originalLengh].operacion != null) {
					Operacion = self.listarIncidencias[i + originalLengh].operacion
				}

				let codigointerno = '--';
				if (self.listarIncidencias[i + originalLengh].codigointerno != null) {
					codigointerno = self.listarIncidencias[i + originalLengh].codigointerno
				}

				let nombresucursal = '--';
				if (self.listarIncidencias[i + originalLengh].nombresucursal != null) {
					nombresucursal = self.listarIncidencias[i + originalLengh].nombresucursal;
				}

				let fechalimite = '--';
				let colorfechalimite = ''
				if (self.listarIncidencias[i + originalLengh].fechalimite != null) {
					colorfechalimite = self.listarIncidencias[i + originalLengh].colorfechalimite;
					fechalimite = self.listarIncidencias[i + originalLengh].fechalimite;
				}

				let fechapqr = moment(self.listarIncidencias[i + originalLengh].fechapqr).format('DD-MM-YYYY');
				const el = document.createElement('ion-item');
				let accion = '';
				let background = '';
				switch (self.listarIncidencias[i + originalLengh].accion) {
					case 'pausar':
						background = '#c85404';
						accion = 'Pausó';
						break;

					case 'continuar':
						background = '#a1a13b';
						accion = 'Continuo';
						break;

					case 'FinalizoRuta':
						background = '#0e1b37';
						accion = 'Finalizo Ruta';
						break;

					case 'InicioRuta':
						background = '#0e1b37';
						accion = 'Inicio Ruta';
						break;
					case 'iniciar':
						background = '#10dc60';
						accion = 'Inicio';
						break;

					case 'finalizaractividad':
						background = '#10dc60';
						accion = 'Finalizó Actividad';
						break;

					case 'finalizar':
						background = 'red';
						accion = 'Finalizó Incidencia';
						break;

					default:
						background = '#d6e7f2';
						accion = 'Sin Iniciar';
						break;
				};

				let color = (background == '' ? 'Black' : self.getContrastYIQ(background));

				el.innerHTML = '<ion-label>' +
					`<p style="font-size: 11px;"><strong style="font-size: 11px;"><label style="color: black;"> Inc:</label> </strong> ${self.listarIncidencias[i + originalLengh].pqrid} <strong><label style="color: black;"> F. Inc:</label></strong> ` + fechapqr + `<span class="listFecha" style="float: right;font-size: 11px;"><strong><label style="color: black;"> F.Limite:</label> ` + fechalimite + `</strong></span></p>` +
					`<p style="margin: 0px;"><strong style="font-size: 11px;"><label style="color: black;"> Cliente:</label> ${self.listarIncidencias[i + originalLengh].nombretercero}</strong>  <span class="listFecha" style="float: right;font-size: 11px;"><strong><label style="color: black;"> Sucursal:</label></strong>  ` + nombresucursal + `</span></p>` +
					`<p style="margin: 0px;"><strong style="font-size: 11px;"><label style="color: black;"> Equipo:</label></strong><span class="listFecha" style="float: right;font-size: 11px;"> ${self.listarIncidencias[i + originalLengh].nombreequipo}</span></p>` +
					`<p style="margin: 0px;"><strong style="font-size: 11px;"><label style="color: black;"> Serial:</label> ${self.listarIncidencias[i + originalLengh].serialequipo}</strong> <span class="listFecha" style="float: right;font-size: 11px;"> <strong><label style="color: black;"> C.Interno:</label> ${codigointerno}</strong></span></p>` +
					`<p style="margin: 0px; display:flex; flex-direction: column;"><strong style="font-size: 11px;"><label style="color: black;"> Asunto:</label></strong><textarea disabled rows="3" class="listFecha" style="float: right;font-size: 11px;"> ${self.listarIncidencias[i + originalLengh].asunto}</textarea></p>` +
					`<p style="margin: 0px;"><strong style="font-size: 11px;"><label style="color: black;"> Operación:</label> ${Operacion}</strong> <span class="listFecha" style="float: right;font-size: 11px;"><label style="color: black;"> Prioridad:</label>   ${Prioridad}</span></p>` +
					`<p style="margin: 0px;"><strong style="font-size: 11px;"><label style="color: black;"> Acción: </label></strong><span class="listFecha" style="color:` + color + `;  background:` + background + `; float: right;font-size: 11px;width: 30%;text-align: center;"><strong>` + accion + ` </strong></span></p>` +
					'</ion-label>';
				this.apend(list, el, i, originalLengh);
				this.length++;
			}
			if (this.length <= this.listarIncidencias.length && this.length == this.listarIncidencias.length) {
				if (self.infiniteScroll != undefined) {
					self.infiniteScroll.disabled = true;
				}
				break;
			}
		}
	}

	getContrastYIQ(hexcolor) {
		hexcolor = hexcolor.replace("#", "");
		var r = parseInt(hexcolor.substr(0, 2), 16);
		var g = parseInt(hexcolor.substr(2, 2), 16);
		var b = parseInt(hexcolor.substr(4, 2), 16);
		var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
		return (yiq >= 128) ? 'Black' : 'white';
	}

	async apend(list, el, i, originalLengh) {
		list.appendChild(el);
		var self = this;
		el.disabled = self.listarIncidencias[i + originalLengh].disabled;
		el.onclick = function (event) {
			//carga la orden de trabajo segun la incidencia seleccionada
			self.ordentrabajo(self.listarIncidencias[i + originalLengh]);
		};
		return;
	}

	async irAtras() {
		await this.storageService.remove('patioSeleccionado');
		await this.storageService.remove('filaSeleccionada');
		await this.storageService.remove('columnaSeleccionada');
		await this.storageService.remove('letraColumna');
		this.navCtrl.navigateRoot('/desplazamientomasivo');
	}

	navegarEjecutarListaChequeo() {
		this.navCtrl.navigateRoot('/ejecutar-lista-chequeo');
	}
}