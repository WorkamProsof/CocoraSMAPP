import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, NavController, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { AjaxService } from 'src/app/services/ajax.service';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-sincronizar',
	templateUrl: './sincronizar.page.html',
	styleUrls: ['./sincronizar.page.scss'],
})
export class SincronizarPage implements OnInit {

	isConnected = true;
	private online: Observable<boolean> = null;

	cargando : boolean = false;
	contenido: boolean = true;

	listasCheck: any = [];

	porcentajeProgreso : any = 0.00;
	totalProductos : any = 0;
	totalProgreso: any = 0;

	constructor(
		private menu: MenuController,
		private alertController: AlertController,
		private navCtrl: NavController,
		private platform: Platform,
		private network: Network,
		private ajaxService: AjaxService,
		private alertService: AlertService,
		private storageService: StorageService,
		private http: HttpClient,
	) {
		if(!(this.platform.is('mobileweb') || this.platform.is('desktop'))){
			// On Device 
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

	async ionViewWillEnter(){
		this.menu.close();
	}

	ngOnInit() {
		if(this.isConnected){
			this.ajaxService.ajax('Dashboard/cSGCHECK/Vehiculos', {}).subscribe(
			(data:any) => {
				var vehiculos = data.body;
				if(vehiculos.length > 0){

					this.totalProductos = vehiculos.length;

					for (var i = 0; i < vehiculos.length; i++) {
						this.sincronizarVehiculo(vehiculos[i], i+1, vehiculos.length);
					}
				}
			},
			error => {
				this.alertService.presentToast('Ha ocurrido un problema, pero no te preocupes. No es tu culpa');
				console.error(error);
			},
			);
		}else{
			this.alertService.presentToast('Para usar esta función encienda los datos o conectese al Wi-Fi');
			this.navCtrl.navigateRoot('/sgcheck');
		}
	}

	async sincronizarVehiculo(vehiculo : any, contador : any, total : any){
		await this.ajaxService.ajax('Dashboard/cSGCHECK/ListaHeadProd/' + vehiculo, {}, {
			responseType: 'text'
		}).subscribe(
		(data:any) => {
			this.listasCheck.push({
				'id' : vehiculo
				,'html': data.body
			});
			this.totalProgreso = this.totalProgreso + 1;
			this.porcentajeProgreso = Math.round((this.totalProgreso / this.totalProductos) * 100) / 100;

			if(this.totalProgreso == this.totalProductos){
				this.storageService.set('listasCheck', JSON.stringify(this.listasCheck)).then(() => {
					this.alertService.presentToast('Se han descargado satisfactoriamente los datos de las Listas de Chequeo');
					this.navCtrl.navigateRoot('/sgcheck');
				});
			}
		},
		error => {
			this.alertService.presentToast('Ha ocurrido un problema, pero no te preocupes. No es tu culpa');
			console.error(error);
		}
		);
	}

	getNetworkTestRequest(){
		return this.http.get('https://jsonplaceholder.typicode.com/todos/1'); 
	}
}