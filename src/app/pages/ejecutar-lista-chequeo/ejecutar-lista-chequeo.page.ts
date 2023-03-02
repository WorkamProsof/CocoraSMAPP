import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AjaxService } from 'src/app/services/ajax.service';
import { AlertService } from 'src/app/services/alert.service';
import { ListaChequeoComponent } from '../lista-chequeo/lista-chequeo.component';

@Component({
  selector: 'app-ejecutar-lista-chequeo',
  templateUrl: './ejecutar-lista-chequeo.page.html',
  styleUrls: ['./ejecutar-lista-chequeo.page.scss'],
})
export class EjecutarListaChequeoPage implements OnInit, OnDestroy {

  verFiltro: boolean = false;
  inHabilitarCampos: boolean = false;
  clientes: any[];
  sucursales: any[];
  equipos: any[];
  listasChequeo: any[];
  listaChequeoHTML: any[];

  formulario = new FormGroup({
    terceroid: new FormControl('', [Validators.required]),
    sucursalid: new FormControl(''),
    equipoid: new FormControl('', [Validators.required]),
  });

  customInterface = {
    cssClass: 'custom-alert',
  }

  private destroy$ = new Subject();

  constructor(
    private AjaxService: AjaxService,
    private alertService: AlertService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.DtosInicialesFiltro();
  }

  irAtras() {
    this.navCtrl.navigateRoot('/dashboard');
  }

  //Busca los Clientes
  DtosInicialesFiltro() {
    this.AjaxService.ajax('Dashboard/cMovimientoApp/DtosInicialesFiltro', {
      param: '0'
    }).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (resp.body == 1) {
        this.alertService.presentToast('No se encontraron coincidencias', 'middle');
      } else {
        this.clientes = resp.body.CLIENTES;
      }
    }, error => {
      this.alertService.presentToast('Ha ocurrido un ploblema al obtener los clientes');
      console.error(error);
    }, () => {
    });
  }

  // Busca Sucursales y Equipo cuando se escoge un cliente
  seleccionCliente(e) {
    this.formulario.controls.equipoid.reset();
    this.formulario.controls.sucursalid.reset();
    this.equipos = [];
    if (e != undefined) {
      this.AjaxService.ajax('Dashboard/cMovimientoApp/changeSucursal', {
        param: e
      }).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
        if (resp.body == 1) {
          this.alertService.presentToast('No se encontraron coincidencias', 'middle');
        } else {
          this.sucursales = resp.body.SUCURSALES;
          if (this.sucursales.length <= 0) {
            this.obtenerEquipos();
          }
        }
      }, error => {
        this.alertService.presentToast('Ha ocurrido un problema al obtener las sucursales');
        console.error(error);
      }, () => {
      });
    }
  }

  seleccionSucursal() {
    this.formulario.controls.equipoid.reset();
    this.equipos = [];
    this.obtenerEquipos();

  }

  seleccionEquipo() {
    if (this.formulario.controls.equipoid.value != undefined) this.inHabilitarCampos = true;
  }

  limpiarCampos() {
    this.formulario.reset();
    this.clientes = [];
    this.sucursales = [];
    this.equipos = [];
    this.inHabilitarCampos = false;
    this.DtosInicialesFiltro();
  }

  async cargarListasChequeo() {
    this.AjaxService.ajax(`Dashboard/cMovimientoApp/Diligenciar`, {
      itemequipoid: this.formulario.controls.equipoid.value
    }).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (resp.body == 1) {
        this.alertService.presentToast('No se encontraron listasde  chequeo', 'middle');
      } else {
        if (resp.body.listaChequeo.length > 0) {
          this.listasChequeo = resp.body.listaChequeo;
          this.listaChequeoHTML = resp.body.listaChequeoHMTL;
          this.modalListasChequeo();
        } else {
          this.alertService.presentToast('El equipo no cuenta con listas de chequeo');
          this.inHabilitarCampos = false;
          this.formulario.controls.equipoid.reset();
        }
      }
    }, error => {
      this.alertService.presentToast('Ha ocurrido un problema al obtener los equipos');
      console.error(error);
    }, () => {
    });
  }

  obtenerEquipos() {
    this.AjaxService.ajax('Dashboard/cMovimientoApp/obtenerEquipoTercerosSucursal', {
      terceroid: this.formulario.controls.terceroid.value == undefined ? '' : this.formulario.controls.terceroid.value,
      sucursalid: this.formulario.controls.sucursalid.value == undefined ? '' : this.formulario.controls.sucursalid.value
    }).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (resp.body == 1) {
        this.alertService.presentToast('No se encontraron coincidencias', 'middle');
      } else {
        this.equipos = resp.body;
      }
    }, error => {
      this.alertService.presentToast('Ha ocurrido un problema al obtener los equipos');
      console.error(error);
    }, () => {
    });
  }

  // Mostar modal para listas de chequeo
  async modalListasChequeo() {
    const modal = await this.modalCtrl.create({
      component: ListaChequeoComponent,
      componentProps: {
        listasChequeo: this.listasChequeo,
        listaChequeoHTML: this.listaChequeoHTML,
        itemequipoid: this.formulario.controls.equipoid.value,
      }
    });
    await modal.present();
    modal.onWillDismiss().then(({ data }) => {
    }, console.error);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
