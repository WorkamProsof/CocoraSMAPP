import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AjaxService } from 'src/app/services/ajax.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-resultado-lista-chequeo',
  templateUrl: './resultado-lista-chequeo.component.html',
  styleUrls: ['./resultado-lista-chequeo.component.scss'],
})
export class ResultadoListaChequeoComponent implements OnInit {

  @Input() listasChequeo: Array<object>;
  @Input() pqrid: string;
  
  listasChequeoEjecutadas = [];
  mostrarResultado = false;
  noTieneListas = false;

  constructor(
    private modalController: ModalController,
    private AjaxService: AjaxService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.AjaxService.ajax('Dashboard/cMovimientoApp/getListaChequeoEjecutadas', { pqrid: this.pqrid }).subscribe((resp: any) => 
      {
        if (resp.body.length > 0) {
          this.listasChequeoEjecutadas = [...this.listasChequeoEjecutadas, ...resp.body];
        } else {
          this.noTieneListas = true;
        }
      }, error => {
        this.alertService.presentToast('Ha ocurrido un problema');
        console.error(error);
      }, () => {
    });
  }

  verResultadosListaChequeoEjecutada(listaChequeo) {
    this.mostrarResultado = true;
    this.AjaxService.ajax('Dashboard/cMovimientoApp/listaConsultar', {
    	ejecucionid: listaChequeo.ejecucionid
    }).subscribe((resp: any) => {
      document.getElementById('contenidoHTMLResultado').innerHTML = resp.body.ListaCheckHTML;
      if (resp.body.ListaCheckHTML != '') {
        setTimeout(() => {
          document.getElementsByClassName('tablaObservaciones')[0].remove();
          this.resultado(resp.body.respuestas);
        }, 100);
      }
    }, error => {
    	this.alertService.presentToast('Ha ocurrido un problema');
    	console.error(error);
    }, () => {
    });
  }

  resultado(respuestas) {
    let resultado = respuestas.respTexto;
    for (var i = 0; i < resultado.length; i++) {
      let dato = resultado[i];
      let valor = '';

      if (dato.valortexto != null) {
        valor = dato.valortexto;
      } else if (dato.valorentero != null) {
        valor = dato.valorentero;
      } else if (dato.valorreal != null) {
        valor = dato.valorreal;
      } else if (dato.valorfecha != null) {
        valor = dato.valorfecha;
      }

      if (dato.observacion != null) {
        const fila = document.getElementsByName(dato.preguntaid).length;
        document.getElementsByName(dato.preguntaid)[fila - 1].innerHTML = dato.observacion;
      }
      if (valor != '') {
        document.getElementById('');
        document.getElementsByName(dato.preguntaid)[0].setAttribute('value', valor);
      }
    }

    const resultadoCheck = respuestas.respCheck;
    const observaciones = document.getElementsByClassName('observacion');
    for (var i = 0; i < resultadoCheck.length; i++) {
      let dato = resultadoCheck[i];
      let observacion = observaciones[observaciones.length - (i+1+resultado.length)];
      if (dato.opcionid != null) {
        if (document.getElementById(dato.preguntaid+dato.opcionid).getAttribute('name') == dato.preguntaid) {
          document.getElementById(dato.preguntaid+dato.opcionid).setAttribute('checked', 'true');
        }
        if (document.getElementsByName(dato.preguntaid)[0].getAttribute('name') == observacion.getAttribute('name')) {
          observacion.innerHTML = dato.observacion;
        }

      } 
    }
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

}
