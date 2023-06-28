import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AjaxService } from 'src/app/services/ajax.service';
import { ModalController } from '@ionic/angular';
import { SeleccionProductoComponent } from '../seleccion-producto/seleccion-producto.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-consumir-insumo',
  templateUrl: './consumir-insumo.component.html',
  styleUrls: ['./consumir-insumo.component.scss'],
})
export class ConsumirInsumoComponent implements OnInit, OnDestroy {

  @Input() pqrid: string;
  @Input() almacenDescarga: string;
  @Input() requisicion: boolean;

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
    private AjaxService: AjaxService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.formulario.controls.cantfin.disable();
    this.formulario.controls.unidad.disable();
    this.formulario.controls.cantidadDisponible.disable();

    this.AjaxService.ajax('Dashboard/insumosPqr/listaInsumosPqr', { pqrid: this.pqrid}).subscribe((resp: any) => {
      if(resp) console.log(resp.body);
      this.insumosPqr = resp.body.listaInsumos.map(insumo => ({...insumo, cantfin: parseInt(insumo.cantfin)}));
      // this.productos = resp.body.totalInsumos;
    });
  }

  irAtras() {
    this.modalController.dismiss();
  }

  onAgregarInsumo() {
    this.agregarInsumo = !this.agregarInsumo;
  }

  agregarInsumoALista() {
    console.log(this.insumo);
    this.insumosPqr.push(this.insumo);
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

    console.log(this.formulario.value);
  }

  cancelarAgregarInsumo() {
    this.agregarInsumo = !this.agregarInsumo;
  }

  seleccionLista(insumo: any) {
    if (this.listaInsumosSeleccionados.find(i => i.productoid === insumo.productoid)){
      this.listaInsumosSeleccionados = this.listaInsumosSeleccionados.filter(i => i.productoid !== insumo.productoid)
    } else {
      this.listaInsumosSeleccionados.push(insumo);
    }

    if(this.listaInsumosSeleccionados.length > 0) {
      this.inhabilitarCambioCantidad = true;
    } else {
      this.inhabilitarCambioCantidad = false;
    }
  }

  sumarInsumo(insumo: any) {
    this.insumosPqr = this.insumosPqr.map(i => i.productoid === insumo.productoid ? {...i, cantfin: i.cantfin + 1} : i);
  }

  restarInsumo(insumo: any) {
    this.insumosPqr = this.insumosPqr.map(i => i.productoid === insumo.productoid ? {...i, cantfin: i.cantfin - 1} : i);
  }

  sumarInsumoPedido() {
    this.formulario.controls.cantfin.setValue(parseInt(this.formulario.controls.cantfin.value) + 1);
    this.insumo.cantfin = parseInt(this.formulario.controls.cantfin.value);
  }

  restarInsumoPedido() {
    if(this.formulario.controls.cantfin.value <= 0) return;
    this.formulario.controls.cantfin.setValue(parseInt(this.formulario.controls.cantfin.value) - 1);
    this.insumo.cantfin = parseInt(this.formulario.controls.cantfin.value);
  }

  enviarInsumo() {
    if(this.requisicion) {
      this.AjaxService.ajax('Dashboard/insumosPqr/requerirInsumos', this.listaInsumosSeleccionados).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
        console.log(resp.body);
        if(resp.body == 1) {
          this.modalController.dismiss(null, 'cancelar');
        }
      });
    } else {
      this.AjaxService.ajax('Dashboard/insumosPqr/descargarInsumoERPFive', this.listaInsumosSeleccionados).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
        console.log(resp.body);
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
      console.log(data);
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
        tipo              : 'Novedad',
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
