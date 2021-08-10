import { Component, OnInit,Input } from '@angular/core';
import {MenuController, NavController, Platform,ModalController,NavParams,PopoverController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage implements OnInit {
  nombre:any;
  constructor(
    private navCtrl: NavController,
    private modalCtrl : ModalController,
    private navParams : NavParams,
    private popoverController : PopoverController
  ) {
    this.nombre = navParams.get('data');
   }

  ngOnInit() {
    console.log('componente de filtros');
  }

  irAtras(){
      this.modalCtrl.dismiss();
  }

  async filtro(form: NgForm) {
    console.log('cesar',form.value);
    let result = "se cerró"
    this.popoverController.dismiss({result:result});
    
	}
}
