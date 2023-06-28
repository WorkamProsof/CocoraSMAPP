import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AjaxService } from 'src/app/services/ajax.service';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-seleccion-producto',
  templateUrl: './seleccion-producto.component.html',
  styleUrls: ['./seleccion-producto.component.scss'],
})
export class SeleccionProductoComponent implements OnInit, OnDestroy {

  @Input() almacenDescarga: Array<any>;

  listaProductos    : any = [];
  productosfiltrados: any;
  nombreProducto    : any = '';

  private destroy$ = new Subject();

  constructor(
    private AjaxService: AjaxService,
    private modalController: ModalController,
    private alertService: AlertService,
  ) { }

  ngOnInit() {}

  onNombreProducto(event) {
    this.nombreProducto = event.target.value;
  }

  busquedaProducto(){
    if(this.nombreProducto.length <= 3){
      this.alertService.presentToast('Debe introducir minimo 3 letras');
      return;
    }
    this.AjaxService.ajax('Dashboard/insumosPqr/listaInsumos', { almacenDescarga: this.almacenDescarga, nombreProducto: this.nombreProducto}).pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      this.listaProductos = resp.body;
    });
  }

  seleccionProducto(producto) {
    console.log(producto);
    this.modalController.dismiss(producto, 'confirmar');
  }

  cerrarModal() {
    this.modalController.dismiss(null, 'cancelar');
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
