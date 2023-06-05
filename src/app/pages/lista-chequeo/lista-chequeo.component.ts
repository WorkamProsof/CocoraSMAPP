import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-lista-chequeo',
  templateUrl: './lista-chequeo.component.html',
  styleUrls: ['./lista-chequeo.component.scss'],
})
export class ListaChequeoComponent implements OnInit {

  @Input() listasChequeo: Array<object>;
  @Input() listaChequeoHTML: string;
  @Input() pqrid: string;
  @Input() itemequipoid: string;

  searching: boolean = true;
  listasSeleccionadas: any[] = [];
  opcionRespuesta: any[] = [];
  auxiliarSelecccioLista: boolean = false;
  formularioValido: boolean = true;


  constructor(
    private modalController: ModalController,
    private storageService: StorageService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit() {

  }

  seleccionLista(lista) {
    if (this.listasSeleccionadas.find(ls => ls === parseInt(lista.listachequeoid))) {
      this.listasSeleccionadas = this.listasSeleccionadas.filter(ls => ls !== parseInt(lista.listachequeoid));
    } else {
      this.listasSeleccionadas.push(parseInt(lista.listachequeoid));
    }
    if (this.listasSeleccionadas.length > 0) {
      this.auxiliarSelecccioLista = true;
    } else {
      this.auxiliarSelecccioLista = false;
    }

    // if (this.listasSeleccionadas.find(ls => ls === lista)) {
    //   this.listasSeleccionadas = this.listasSeleccionadas.filter(ls => ls.listachequeoid !== lista.listachequeoid);
    // } else {
    //   this.listasSeleccionadas.push(lista);
    // }
  }

  volverSeleccionlista() {
    this.auxiliarSelecccioLista = true;
    if (document.getElementById('listas')) {
      document.getElementById('listas').classList.remove('hide');
      document.getElementById('formulario').classList.add('hide');
      (<HTMLFormElement>document.getElementById('formElementslista')).reset();
      var elements = document.getElementById('formElementslista').children;
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('hide');
      }
    }
  }

  mostrarListasChequeo() {
    if (this.listasSeleccionadas.length == 0) {
      alert("Seleccione al menos una lista de chequeo");
    } else {
      this.auxiliarSelecccioLista = false;
      document.getElementById('listas').classList.add('hide');
      document.getElementById('formulario').classList.remove('hide');

      document.getElementById('contenidoHtml').innerHTML = this.listaChequeoHTML;

      let docu: any = document.getElementById("formElementslista");

      var frm = docu.elements;
      for (var i = 0; i < frm.length - 1; i++) {
        var elemento = frm[i];
        var atributos = frm[i].attributes;

        for (var x = 0; x < atributos.length - 1; x++) {

          let el = this.closestByClass(elemento, 'tblPrincipal');
          if (el != null) {
            if (el.classList.contains('hide') != false)
              break;

            if (atributos[x].name == 'listachequeoid') {
              let valor = parseInt(atributos[x].value);

              if (!(this.listasSeleccionadas.indexOf(valor) > -1)) {
                el.classList.add('hide');
              }
            }
          }
        }
      }
    }
  }

  closestByClass = function (el, clazz) {
    while (el.className != clazz) {
      el = el.parentNode;
      if (!el) {
        return null;
      }
    }
    return el;
  }

  submitListas() {
    this.searching = true;
    var date = new Date();
    var fecha = date.getFullYear() + "-" + date.getDate() + "-" + (date.getMonth() + 1) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var form = document.getElementById("formElementslista");
    var dataFormularioRespuestas = {};
    dataFormularioRespuestas = this.cargarDatos({}, form['elements']);

    var date = new Date(),
      fecha = date.getFullYear() + "-" + date.getDate() + "-" + (date.getMonth() + 1) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let dataListaChequeo = {
      listaRespuesta: dataFormularioRespuestas
      , itemequipoid: this.itemequipoid
      , proceso: 'Recepción'
      , fecha: fecha
      , pqrid: this.pqrid ? this.pqrid : null
      , opcion: 'Ejecución Listas chequeo desde App'
    };

    if (dataFormularioRespuestas == undefined) {
      this.alertService.presentToast('Todas las preguntas deben tener al menos una respuesta diligenciada', 'middle');
      return;
    }

    this.storageService.get('listaChequeoEjecutada').then(
      (data: any) => {
        data = JSON.parse(data);
        if (data == null) {
          data = [];
        }
        data.push(dataListaChequeo);
        this.storageService.set('listaChequeoEjecutada', JSON.stringify(data));
      }
    );
    this.alertService.presentToast('La lista de chequeo fue registrada con exito', 'middle');
    this.searching = false;
    this.cerrarModal();
      this.router.navigate(['dashboard']);
  }

  cargarDatos(data: any, elements: any) {
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var el = this.closestByClass(element, 'tblPrincipal');
      if (el != null) {
        if (element.name) {
          if (!data[element.getAttribute('listachequeoid')]) {
            data[element.getAttribute('listachequeoid')] = {};
          }
          if (!data[element.getAttribute('listachequeoid')][element.name]) {
            data[element.getAttribute('listachequeoid')][element.name] = {
              preguntaid: element.name
            };
          }

          if (element.getAttribute('tiporespuestaid') && !data[element.getAttribute('listachequeoid')][element.name]['tiporespuestaid']) {
            data[element.getAttribute('listachequeoid')][element.name]['tiporespuestaid'] = element.getAttribute('tiporespuestaid');
            data[element.getAttribute('listachequeoid')][element.name]['tipo'] = element.getAttribute('nombre');
            data[element.getAttribute('listachequeoid')][element.name]['esselecion'] = element.getAttribute('esselecion');
          }

          if (element.classList.contains('observacion')) {

            data[element.getAttribute('listachequeoid')][element.name]['observacion'] = element.value;
          } else if (element.classList.contains('tiempo') && !data[element.getAttribute('listachequeoid')][element.name]['tiempo']) {
            data[element.getAttribute('listachequeoid')][element.name]['tiempo'] = element.value;
          } else if (element.classList.contains('valor') && !data[element.getAttribute('listachequeoid')][element.name]['valor']) {
            data[element.getAttribute('listachequeoid')][element.name]['valor'] = element.value;
          } else {
            if (element.type === "checkbox") {
              if (element.getAttribute('nombre') == 'valorlogico') {
                data[element.getAttribute('listachequeoid')][element.name]['value'] = element.checked;
              } else {
                if (element.checked) {
                  data[element.getAttribute('listachequeoid')][element.name]['opcionrespuestaid'] = element.getAttribute('opcionid');
                  data[element.getAttribute('listachequeoid')][element.name]['res'] = (data[element.getAttribute('listachequeoid')][element.name]['res'] || []).concat({ value: element.value, id: element.id });
                }
              }
            } else if (element.options && element.multiple) {
              data[element.getAttribute('listachequeoid')][element.name]['opcionrespuestaid'] = element.getAttribute('opcionid');
              data[element.getAttribute('listachequeoid')][element.name]['res'] = this.getSelectValues(element);
            } else if (element.type == 'radio') {
              if (typeof data[element.getAttribute('listachequeoid')][element.name]['value'] === 'undefined') {
                data[element.getAttribute('listachequeoid')][element.name]['value'] = '';
                for (var i = 0; i < document.getElementsByName(element.name).length; i++) {
                  if (document.getElementsByName(element.name)[i]['checked']) {
                    data[element.getAttribute('listachequeoid')][element.name]['opcionrespuestaid'] = element.getAttribute('opcionid');
                    data[element.getAttribute('listachequeoid')][element.name]['value'] = document.getElementsByName(element.name)[i]['value'];
                    break;
                  }
                }
              }
            } else {
              data[element.getAttribute('listachequeoid')][element.name]['value'] = element.value;
            }
          }
        }
      }
    }
    data['observaciones'] = document.getElementById('observaciones')['value'];

    for (const key in data) {
      const element = data[key];
      if (typeof (element) != typeof ('')) {
        for (const key2 in element) {
          if (element[key2].value == '') {
            this.formularioValido = false;
          } else {
            this.formularioValido = true;
          }
        }
      }
    }
    if (this.formularioValido) return data;
  }

  getSelectValues(select) {
    var resultado = [];
    var options = select && select.options;
    var opt;

    for (var i = 0; i < options.length; i++) {
      opt = options[i];

      if (opt.selected) {
        resultado.push(opt.value || opt.text);
      }
    }
    return resultado;
  };

  cerrarModal() {
    this.auxiliarSelecccioLista = true;
    this.modalController.dismiss();
  }

}
