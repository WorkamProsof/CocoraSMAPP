import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from './services/login.service';
import { AlertService } from './services/alert.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent {

	anio : any = new Date().getFullYear();

	constructor(
		private platform: 		Platform,
		private splashScreen: 	SplashScreen,
		private statusBar: 		StatusBar,
		private loginService: 	LoginService,
		private navCtrl: 		NavController,
		private storageService: StorageService,
		private alertService: 	AlertService
		) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.overlaysWebView(true);
			this.statusBar.show();
			this.statusBar.backgroundColorByHexString('#337ab7');

			// Commenting splashScreen Hide, so it won't hide splashScreen before auth check
			this.splashScreen.hide();
			this.loginService.getToken();
		});
	}

  	// When Logout Button is pressed
	logout() {
		this.loginService.logout().subscribe(
			data => {
				if(data.body == 1){
					this.alertService.presentToast('La sesión se ha finalizado correctamente');
					this.navCtrl.navigateRoot('/nit');
				}else{
					this.alertService.presentToast('Ha ocurrido un problema, pero no te preocupes. No es tu culpa');
				}
			},
			error => {
				console.error(error);
			},
			() => {
			}
		);
	}

	sincronizarPermisos() {
		this.loginService.getUsuarios().subscribe(
			(data:any) => {
				this.storageService.set('Arryusuarios',data.Usuarios);
				this.storageService.set('logoempresa', data.logoempresa);
				this.storageService.set('transicionestadoapp', data.transicionestadoapp);
				this.storageService.set('validarutaapp', data.validarutaapp);
				this.storageService.set('proincrelacionadasapp', data.proincrelacionadasapp);
				this.storageService.set('multipleactividadapp', data.multipleactividadapp);
				this.storageService.set('multipleoperarios', data.multipleoperarios);
				this.alertService.presentToast('Sincronización con éxito');
			},
			error => {
				this.alertService.presentToast('Ha ocurrido un problema, pero no te preocupes. No es tu culpa');
				console.error(error);
			}
			);
	}
	
	
}
