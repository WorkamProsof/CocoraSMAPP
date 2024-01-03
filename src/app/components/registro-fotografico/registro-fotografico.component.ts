import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AjaxService } from 'src/app/services/ajax.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-registro-fotografico',
  templateUrl: './registro-fotografico.component.html',
  styleUrls: ['./registro-fotografico.component.scss'],
})
export class RegistroFotograficoComponent implements OnInit {

  @Input() pqrid: string;

  buscando: boolean = true;
  imagenes = [];

  constructor(
    private AjaxService     : AjaxService,
    private modalController : ModalController,
    private alertService    : AlertService,
  ) { }

  ngOnInit() {
    this.buscando = true;
    this.AjaxService.ajax('Dashboard/cMovimientoApp/obtenerEvidenciaFotografica', { pqrid: this.pqrid }).subscribe((resp: any) => {
      this.buscando = false;
      if(resp.ok) {
        // this.imagenes = resp.body.map((i) => ({...i, contenido: `data:image/jpg;base64,${i.contenido}`}));
        this.imagenes = resp.body.map((i) => ({...i, contenido: `${i.contenido}`})); // Sed eja asi para poder mostrar imagenes
      } else {
        this.alertService.presentToast('Error al obtener imagenes', 'middle');
      }
    });
  }

  irAtras() {
    this.modalController.dismiss();
  }

}
