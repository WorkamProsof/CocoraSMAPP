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

  insumosPqr                : any = [];
  listaInsumosSeleccionados : any = [];
  inhabilitarCambioCantidad : boolean = false;
  agregarInsumo             : boolean = false;
  descargarInsumos          : boolean = false;
  procesando                : boolean = false;
  stepCantidadInsumo        : number = 1;

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
    unidad            : string,
    cantidadDecimales : number
  }

  formulario = new FormGroup({
    productoid: new FormControl('', [Validators.required]),
    cantfin: new FormControl(1.0, [Validators.required, Validators.min(0.0001)]),
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
    this.formulario.controls.unidad.disable();
    this.formulario.controls.cantidadDisponible.disable();
    this.cargarInsumos();
  }

  cargarInsumos() {
    this.AjaxService.ajax('Dashboard/insumosPqr/listaInsumosPqr', { pqrid: this.pqrid, almacenDescarga: this.almacenDescarga}).subscribe((resp: any) => {
      if(resp) {
        this.insumosPqr = resp.body.listaInsumos.map(insumo => (
          {...insumo,
            cantfin : insumo.cantidadDisponible == '.00000000' ? 0 : parseFloat(insumo.cantidaddescargada) == 0 ? parseFloat(insumo.cantfin) : parseFloat(insumo.cantidaddescargada) >= parseFloat(insumo.cantini) ? 0 : parseFloat(insumo.cantini) - parseFloat(insumo.cantidaddescargada),
            cantidadDisponible: insumo.cantidadDisponible == '.00000000' ? 0 : parseFloat(insumo.cantidadDisponible),
            cantidaddescargada  : parseFloat(insumo.cantidaddescargada),
            stepCantidadInsumo  : 1 / (Math.pow(10, insumo.cantidadDecimales))
          }
        ));
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
          unidad            : '',
          cantidadDecimales : 0
        };
      }
    });
  }

  irAtras() {
    this.modalController.dismiss();
  }

  onAgregarInsumo() {
    this.agregarInsumo = !this.agregarInsumo;
    if (this.formulario.controls.productoid.value === '') {
      this.modalSeleccionProducto();
    }
  }

  sumarInsumoPedido() {
    this.formulario.controls.cantfin.setValue(this.formulario.controls.cantfin.value + 1);
  }

  restarInsumoPedido() {
    if(this.formulario.controls.cantfin.value <= 0) return;
    this.formulario.controls.cantfin.setValue(parseFloat((parseFloat(this.formulario.controls.cantfin.value) - 1).toFixed(this.insumo.cantidadDecimales)));
  }

  limitarDecimales() {
    let valor: any = String(this.formulario.value.cantfin);
    if (valor.includes('.') && (valor.split('.')[1].length > this.insumo.cantidadDecimales)) {
      let valorFixed = parseFloat(valor).toFixed(this.insumo.cantidadDecimales);
      valor = parseFloat(valorFixed);
      this.formulario.controls.cantfin.setValue(valor);
    };
  }

  agregarInsumoALista() {
    this.insumo.cantini = this.formulario.controls.cantfin.value;
    this.insumo.cantfin = this.formulario.controls.cantfin.value;
    if (this.insumosPqr.find(insumo => insumo.productoid === this.formulario.controls.productoid.value)) {
      this.alertService.presentToast('El insumo ya se encuentra en la lista', 'middle');
    } else {
      this.procesando = true;
      this.AjaxService.ajax('Dashboard/insumosPqr/agregarInsumoAPqr', this.insumo).subscribe((resp: any) => {
        this.procesando = false;
        this.agregarInsumo = false;
        if(!resp.body.error) {
          this.cargarInsumos();
          this.alertService.presentToast(resp.body.mensaje, 'middle');
        } else {
          this.alertService.presentToast(resp.body.mensaje, 'middle');
        }
      });
    };
  }

  cancelarAgregarInsumo() {
    this.agregarInsumo = !this.agregarInsumo;
  }

  sumarInsumo(insumo: any) {
    this.insumosPqr = this.insumosPqr.map(i => i.productoid === insumo.productoid ? {...i, cantfin: i.cantfin + 1} : i);
  }

  restarInsumo(insumo: any) {
    this.insumosPqr = this.insumosPqr.map(i => i.productoid === insumo.productoid ? {...i, cantfin: i.cantfin - 1} : i);
    this.insumosPqr.forEach(i => {
      if(i.productoid === insumo.productoid) {
        if (i.cantfin <= 0) {
          i.cantfin = 0; 
        }
        return;
      }
    });
  }

  limitarDecimalesInsumos(insumo) {
    let valor: any = String(insumo.cantfin);
    if (valor.includes('.') && (valor.split('.')[1].length > insumo.cantidadDecimales)) {
      let valorFixed = parseFloat(valor).toFixed(insumo.cantidadDecimales);
      valor = parseFloat(valorFixed);
      this.insumosPqr = this.insumosPqr.map(i => i.headpqrinsumoid === insumo.headpqrinsumoid ? {...i, cantfin: valor} : i);
    };
  }

  async eliminarInsumo(insumo) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Seguro desea eliminar el insumo ? Solo se eliminará las cantidades pendientes por requerir',
      buttons: [{ text:'Cancelar', role: 'cancelar' }, { text:'Ok', role: 'confirmar' }],
    });

    await alert.present();
		const {data, role} = await alert.onWillDismiss();
    if (role === 'confirmar') {
      this.descargarInsumos = true;

      this.AjaxService.ajax('Dashboard/insumosPqr/eliminarInsumoAPqr', insumo).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
        if(!resp.body.error) {
          this.cargarInsumos();
          this.alertService.presentToast(resp.body.mensaje, 'middle');
        } else {
          this.alertService.presentToast(resp.body.mensaje, 'middle');
        }
        this.descargarInsumos = false;
      });
    }
  }

  async descargarInsumo() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Las cantidades faltantes se enviaran para solicitud de requisición',
      buttons: [{ text:'Cancelar', role: 'cancelar' }, { text:'Ok', role: 'confirmar' }],
    });

    await alert.present();
		const {data, role} = await alert.onWillDismiss();
    if (role === 'confirmar') {
      this.descargarInsumos = true;
      let listaRequeridos = [];
      let listaDescargar = [];
      listaRequeridos = this.insumosPqr.filter((insumo => (insumo.cantfin > insumo.cantidadDisponible || insumo.cantidadDisponible <= 0) && insumo.cantfin !== 0)).map(i => ({ ...i, cantfin: i.cantfin - i.cantidadDisponible }));
      listaDescargar = this.insumosPqr.filter(insumo => (insumo.cantidadDisponible > 0 && insumo.cantfin > 0)).map(i => ({  ...i, cantfin: i.cantidadDisponible >= i.cantfin ? i.cantfin : i.cantidadDisponible }));
      this.AjaxService.ajax('Dashboard/insumosPqr/descargarInsumoERPFive', {listaRequeridos, listaDescargar}).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
        if(resp.body.error) {
          this.alertService.presentToast(resp.body.mensaje, 'middle');
        } else {
          this.alertService.presentToast(resp.body.mensaje, 'middle');
          this.cargarInsumos();
        }
        this.descargarInsumos = false;
      });
    };
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
        operacion         : this.insumosPqr.length > 0 ? this.insumosPqr[0].operacion : null,
        operacionid       : this.insumosPqr.length > 0 ? this.insumosPqr[0].operacionid : null,
        pqrid             : this.pqrid,
        producto          : data.nombre,
        productoid        : data.productoid,
        tipo              : 'Adicional',
        unidad            : data.unidad,
        cantidadDecimales : data.decimalesCantidad
      };
      this.stepCantidadInsumo = 1/(Math.pow(10, data.decimalesCantidad));
    };

    if (role === 'cancelar') {
      if (this.formulario.controls.productoid.value === '') {
        this.agregarInsumo = false;
      }
    };
  }

  iniciarFormulario() {
    this.formulario.controls.productoid.setValue('');
    this.formulario.controls.cantfin.setValue(1);
    this.formulario.controls.nombre.setValue('');
    this.formulario.controls.unidad.setValue('');
    this.formulario.controls.cantidadDisponible.setValue('');
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
