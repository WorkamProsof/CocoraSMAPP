import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	passwordType 	: string 	= 'password';
	passwordIcon 	: string 	= 'eye-off';


	usuarios 		    : any;
	logoempresa     	: any;
	transicionestadoapp : any;
	validarutaapp       : any;
	multipleoperarios   : any;
	
	cargando 		: boolean 	= false;
	contenido 		: boolean 	= true;



	constructor(
		private modalController: ModalController,
		private loginService: LoginService,
		private navCtrl: NavController,
		private alertService: AlertService,
		private storageService: StorageService,
		) { }

	ngOnInit() {
		this.loginService.getUsuarios().subscribe(
			(data:any) => {

				console.log('usuarios', data);
				this.usuarios            = data.Usuarios;
				this.logoempresa         = data.logoempresa;
				this.transicionestadoapp = data.transicionestadoapp;
				this.validarutaapp       = data.validarutaapp;
				this.multipleoperarios   = data.multipleoperarios;
				this.storageService.set('Arryusuarios',this.usuarios);
				this.storageService.set('logoempresa', this.logoempresa);
				this.storageService.set('transicionestadoapp', this.transicionestadoapp);
				this.storageService.set('validarutaapp', this.validarutaapp);
				this.storageService.set('proincrelacionadasapp', data.proincrelacionadasapp);
				this.storageService.set('multipleactividadapp', data.multipleactividadapp);
				this.storageService.set('multipleoperarios', this.multipleoperarios);
				this.loader(false);
			},
			error => {
				this.alertService.presentToast('Ha ocurrido un problema, pero no te preocupes. No es tu culpa');
				console.error(error);
				this.loader(false);
			},
			() => {
				this.loader(false);
			}
			);
	}

	dismissLogin() {
		this.modalController.dismiss();
	}

	
	async login(form: NgForm) {
		this.loader(true);
		this.loginService.login(form.value.user, form.value.password)
		.subscribe(
			data => {
				if(data == 0){
					this.alertService.presentToast('Contraseña no válida...');
				}else if(typeof data === 'object'){
					this.dismissLogin();

					for (var i in this.usuarios ){
						if(form.value.user == this.usuarios[i].usuarioid){
							form.value.nombreusuario = this.usuarios[i].nombre;
							form.value.telefonocoordinador = this.usuarios[i].telefonocoordinador;
						}
					}
					this.storageService.set('usuarios',form.value);
					this.navCtrl.navigateRoot('/dashboard');
				}else{
					this.alertService.presentToast('Ha ocurrido un problema, pero no te preocupes. No es tu culpa');
					console.error(data);
				}
			},
			error => {
				this.alertService.presentToast('Ha ocurrido un problema, pero no te preocupes. No es tu culpa');
				console.error(error);
				this.loader(false);
			},
			() => {
				this.loader(false);
			}
			);
	}

	hideShowPassword() {
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
		this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	loader(estado : boolean) {
		this.cargando = estado === true ? false : true;
		this.contenido = estado === true ? true : false;
	}
}
