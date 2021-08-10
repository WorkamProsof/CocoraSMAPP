import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController, NavController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { LoginService } from 'src/app/services/login.service';
import { AlertService } from 'src/app/services/alert.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nit',
  templateUrl: './nit.page.html',
  styleUrls: ['./nit.page.scss'],
})
export class NITPage implements OnInit {

	cargando : boolean = false;
	contenido: boolean = true;

	constructor(
		private modalController: ModalController,
		private menu: MenuController,
		private loginService: LoginService,
		private navCtrl: NavController,
		private alertService: AlertService
	) {
		this.menu.enable(false);
	}

	ionViewWillEnter() {
		this.loader(false);
		this.loginService.getToken().then(() => {
			this.loginService.getTokenNIT().then(() => {
				if(this.loginService.isLoggedIn) {
					this.navCtrl.navigateRoot('/dashboard');
				}else{
					if(this.loginService.isLoggedInNIT) {
						this.loginModal();
					}
				}
			})
		});
	}

	ngOnInit() {

	}

	async loginModal() {
		const loginModal = await this.modalController.create({
			component: LoginPage,
		});
		return await loginModal.present();
	}

	async login(form: NgForm) {
		this.loader(true);
		this.loginService.validarNIT(form.value.nit)
		.subscribe(
			data => {
				if(data == 1){
					this.loginModal();
				}else{
					this.alertService.presentToast('Empresa no se encuentra registrada o se encuentra en estado Inactiva');
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

	loader(estado : boolean) {
		this.cargando = estado === true ? false : true;
		this.contenido = estado === true ? true : false;
	}
}