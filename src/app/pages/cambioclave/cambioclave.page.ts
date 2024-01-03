import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { AjaxService } from 'src/app/services/ajax.service';
import { AlertService } from 'src/app/services/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({ 
	selector: 'app-cambioclave',
	templateUrl: './cambioclave.page.html',
	styleUrls: ['./cambioclave.page.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CambioClavePage implements OnInit {
	passwordType 	: string 	= 'password';
	passwordIcon 	: string 	= 'eye-off';
	nombreusuario :any;
	usuarios = [];
	user     :any;
	usuario  :any;
	logoempresa :any; 
	password :any;

	patios   : any;
	patio    : any;
	PatioId  : any;

	matriz   : any;

	columnas : any = [];
	columna  : any;
	filas    : any = [];

	fila     : any;

	ordentrabajo        : any = false;
	patioSeleccionado   : any;
	filaSeleccionada    : any;
	columnaSeleccionada : any;
	letraColumna        : any;

	constructor(
		private menu          : MenuController,
		private navCtrl       : NavController,
		private storageService: StorageService,
		private loginService  : LoginService,
		private AjaxService   : AjaxService,
		private alertService  : AlertService,
		private http          : HttpClient,
		) {
		this.menu.enable(true);
	}

	async ngOnInit() {

		await this.storageService.get('logoempresa').then(
			(data:any) => {
				this.logoempresa = data;
			}
			);

		await this.storageService.get('usuarios').then(
			(data:any) => {
				console.log('usuarios logueado',data);
				this.usuarios  = [data];
				setTimeout(() => {
					this.user     = data.user;
					this.password = data.password;
				}, 2000);
			}
			);

	}

	async ionViewWillEnter(){
		this.menu.close();
	}

	async cambioClave(form: NgForm){
		//this.loader(true);
		console.log('this.cambioClave',form.value);

		if(form.value.nuevaContrasena == ""  && form.value.ConfiContrasena == ""){
			this.alertService.presentToast('No se encontraron coincidencias en las Contraseñas', 'middle');
			return;
		}

		if(form.value.nuevaContrasena  != form.value.ConfiContrasena){
			this.alertService.presentToast('No se encontraron coincidencias en las Contraseñas', 'middle');
			return;
		}

		this.AjaxService.ajax('Login/CambioClave', {
			user            : form.value.user,
			password        : form.value.password,
			nuevaContrasena : form.value.nuevaContrasena
		}).subscribe(
		(resp:any) => {
			if(resp.body != 1){
				this.alertService.presentToast('No se encontraron coincidencias', 'middle');
			}else{
				this.alertService.presentToast('Transacción Exitosa', 'middle');
				this.navCtrl.navigateRoot('/nit');
			}
		},
		error => {
			this.alertService.presentToast('Ha ocurrido un ploblema');
			console.error(error);
		},
		() => {
		}
		);
	}

	hideShowPassword() {
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
		this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}
}