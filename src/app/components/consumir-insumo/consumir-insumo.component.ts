import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AjaxService } from 'src/app/services/ajax.service';
import { AlertController, ModalController } from '@ionic/angular';
import { SeleccionProductoComponent } from '../seleccion-producto/seleccion-producto.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-consumir-insumo',
  templateUrl: './consumir-insumo.component.html',
  styleUrls: ['./consumir-insumo.component.scss'],
})
export class ConsumirInsumoComponent implements OnInit, OnDestroy {

  @Input() pqrid: string;
  @Input() almacenDescarga: string;

  insumosPqr: any = [];
  listaInsumosSeleccionados: any = [];
  inhabilitarCambioCantidad: boolean = false;
  agregarInsumo: boolean = false;

  insumo: {
    cantfin           : number,
    cantidadDisponible: number,
    cantini           : number,
    costo             : string,
    headpqrinsumoid   : string,
    operacion         : string,
    operacionid       : string,
    pqrid             : string,
    producto          : string,
    productoid        : string,
    tipo              : string,
    unidad            : string
  }

  formulario = new FormGroup({
    productoid: new FormControl('', [Validators.required]),
    cantfin: new FormControl(0, [Validators.required, Validators.min(0)]),
    nombre: new FormControl(''),
    unidad: new FormControl(''),
    cantidadDisponible: new FormControl(0),
  });

  private destroy$ = new Subject();

  constructor(
    private AjaxService     : AjaxService,
    private modalController : ModalController,
    private alertService    : AlertService,
    private alertController : AlertController
  ) { }

  ngOnInit() {
    this.formulario.controls.cantfin.disable();
    this.formulario.controls.unidad.disable();
    this.formulario.controls.cantidadDisponible.disable();
    this.cargarInsumos();
  }

  cargarInsumos() {
    this.AjaxService.ajax('Dashboard/insumosPqr/listaInsumosPqr', { pqrid: this.pqrid, almacenDescarga: this.almacenDescarga}).subscribe((resp: any) => {
      if(resp) {
        this.insumosPqr = resp.body.listaInsumos.map(insumo => ({...insumo, cantfin: parseInt(insumo.cantfin), cantidadDisponible: insumo.cantidadDisponible == '.00000000' ? 0 : parseInt(insumo.cantidadDisponible)}));
      }
    });
  }

  irAtras() {
    this.modalController.dismiss();
  }

  onAgregarInsumo() {
    this.agregarInsumo = !this.agregarInsumo;
  }

  agregarInsumoALista() {
    this.insumo.cantfin = this.formulario.controls.cantfin.value;
    if (this.insumosPqr.find(insumo => insumo.productoid === this.formulario.controls.productoid.value)) {
      this.alertService.presentToast('El insumo ya se encuentra en la lista', 'middle');
    } else {
      this.AjaxService.ajax('Dashboard/insumosPqr/agregarInsumoAPqr', this.insumo).subscribe((resp: any) => {
        if(!resp.body.error) {
          this.cargarInsumos();
          this.alertService.presentToast(resp.body.mensaje, 'middle');
          this.iniciarFormulario();
          this.insumo = {
            cantfin           : 0,
            cantidadDisponible: 0,
            cantini           : 0,
            costo             : '',
            headpqrinsumoid   : null,
            operacion         : '',
            operacionid       : '',
            pqrid             : '',
            producto          : '',
            productoid        : '',
            tipo              : '',
            unidad            : ''
          };
        } else {
          this.alertService.presentToast(resp.body.mensaje, 'middle');
        }
      });
    }
  }

  cancelarAgregarInsumo() {
    this.agregarInsumo = !this.agregarInsumo;
  }

  sumarInsumo(insumo: any) {
    this.insumosPqr = this.insumosPqr.map(i => i.productoid === insumo.productoid ? {...i, cantfin: i.cantfin + 1} : i);
  }

  restarInsumo(insumo: any) {
    this.insumosPqr = this.insumosPqr.map(i => i.productoid === insumo.productoid ? {...i, cantfin: i.cantfin - 1} : i);
  }

  sumarInsumoPedido() {
    this.formulario.controls.cantfin.setValue(this.formulario.controls.cantfin.value + 1);
  }

  restarInsumoPedido() {
    if(this.formulario.controls.cantfin.value <= 0) return;
    this.formulario.controls.cantfin.setValue(parseInt(this.formulario.controls.cantfin.value) - 1);
  }

  async enviarInsumo() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Las cantidades faltantes se enviaran para solicitud de requisición',
      buttons: [{ text:'Cancelar', role: 'cancelar' }, { text:'Ok', role: 'confirmar' }],
    }).then(
    
    );
    await alert.present();
		const {data, role} = await alert.onWillDismiss();
    if (role === 'confirmar') {
      let listaRequeridos = [];
      let listaDescargar = [];
      listaRequeridos = this.insumosPqr.filter(insumo => (insumo.cantfin > insumo.cantidadDisponible || insumo.cantidadDisponible <= 0)).map(i => ({ ...i, cantfin: i.cantfin - i.cantidadDisponible }));
      listaDescargar = this.insumosPqr.filter(insumo => (insumo.cantidadDisponible > 0)).map(i => ({  ...i, cantfin: i.cantidadDisponible >= i.cantfin ? i.cantfin : i.cantidadDisponible }));
  
      this.AjaxService.ajax('Dashboard/insumosPqr/descargarInsumoERPFive', {listaRequeridos, listaDescargar}).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
        if(resp.body == 1) {
          this.modalController.dismiss(null, 'cancelar');
        }
      });
    }
  }

  async modalSeleccionProducto() {
    const modal = await this.modalController.create({
      component: SeleccionProductoComponent,
      componentProps: {
        almacenDescarga: this.almacenDescarga,
      }
    });
    await modal.present();
    const {data, role} = await modal.onWillDismiss();
    if (role === 'confirmar') {
      this.formulario.patchValue(data);
      this.insumo = {
        cantfin           : 0,
        cantidadDisponible: data.cantidadDisponible,
        cantini           : 0,
        costo             : data.costo,
        headpqrinsumoid   : null,
        operacion         : this.insumosPqr[0].operacion,
        operacionid       : this.insumosPqr[0].operacionid,
        pqrid             : this.pqrid,
        producto          : data.nombre,
        productoid        : data.productoid,
        tipo              : 'Adicional',
        unidad            : data.unidad
      };
    }
    
  }

  iniciarFormulario() {
    this.formulario.controls.productoid.setValue('');
    this.formulario.controls.cantfin.setValue(0);
    this.formulario.controls.nombre.setValue('');
    this.formulario.controls.unidad.setValue('');
    this.formulario.controls.cantidadDisponible.setValue('');
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
