import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams} from '@ionic/angular';

@Component({
  selector: 'app-modalimagen',
  templateUrl: './modalimagen.page.html',
  styleUrls: ['./modalimagen.page.scss'],
})
export class ModalimagenPage implements OnInit {
 incidencia : any;
 arryayImage_aux : any = [];

  constructor(
    private modalCtrl : ModalController,
    private navParams : NavParams,
  ) { 
    this.arryayImage_aux = this.navParams.get('image');
    this.incidencia = this.navParams.get('pqr'); 
  }

  ngOnInit() {
    console.log('this.arryayImage_aux',this.arryayImage_aux);
  }

  cerrarModal(){
		this.modalCtrl.dismiss();
	}
}
