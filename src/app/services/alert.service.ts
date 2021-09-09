import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class AlertService {

	constructor(
		private toastController: ToastController,
		private alertController: AlertController 
	) { }

	async presentToast(message: any, position: any = 'top') {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000,
			position: 'top',
			color: 'dark'
		});
		toast.present();
	}
}
