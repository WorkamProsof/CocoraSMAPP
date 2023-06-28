import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'src/app/services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from 'src/app/services/storage.service';
import { SeleccionProductoComponent } from 'src/app/components/seleccion-producto/seleccion-producto.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-insumos-pqr',
  templateUrl: './insumos-pqr.page.html',
  styleUrls: ['./insumos-pqr.page.scss'],
})
export class InsumosPqrPage implements OnInit {

  listaInsumos: any;
  listaInsumosSeleccionados: any = [];
  inhabilitarCambioCantidad: boolean = false;
  agregarInsumo: boolean = false;
  pqrid: any;
  productos: any;

  formulario = new FormGroup({
    productoid: new FormControl('', [Validators.required]),
    cantfin: new FormControl('', [Validators.required]),
  });

  constructor(
    private AjaxService: AjaxService,
    private navCtrl: NavController,
    private acticatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private storageService: StorageService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.pqrid = this.acticatedRoute.snapshot.paramMap.get('pqrid');
    
    this.AjaxService.ajax('Dashboard/insumosPqr/listaInsumosPqr', { pqrid: this.pqrid}).subscribe((resp: any) => {
      if(resp) console.log(resp.body);
      this.listaInsumos = resp.body.listaInsumos.map(insumo => ({...insumo, cantfin: parseInt(insumo.cantfin)}));
      this.productos = resp.body.totalInsumos;
    });

    // this.AjaxService.ajax('Dashboard/insumosPqr/listaInsumos', {}).subscribe((resp: any) => {
    //   if(resp) console.log(resp.body);
    //   // this.productos = resp.body.map(insumo => ({...insumo, cantfin: parseInt(insumo.cantfin)}));
    //   this.productos = resp.body;
    // })
  }

  irAtras() {
    this.navCtrl.back();
  }

  onAgregarInsumo() {
    this.agregarInsumo = !this.agregarInsumo
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
    this.listaInsumos = this.listaInsumos.map(i => i.productoid === insumo.productoid ? {...i, cantfin: i.cantfin + 1} : i);
  }

  restarInsumo(insumo: any) {
    this.listaInsumos = this.listaInsumos.map(i => i.productoid === insumo.productoid ? {...i, cantfin: i.cantfin - 1} : i);
  }

  // Mostar modal para escoger producto
  async modalSeleccionProducto() {
    const modal = await this.modalController.create({
      component: SeleccionProductoComponent,
      componentProps: {
        listaProductos: this.productos,
      }
    });
    await modal.present();
    const {data, role} = await modal.onWillDismiss();
    if (role === 'confirmar') {
      console.log(data);
      this.formulario.patchValue(data);
      console.log(this.formulario.value);
      // this.clienteSeleccionado = data;
      // this.formulario.controls.terceroid.setValue(data.terceroid);
      // this.seleccionCliente(data.terceroid);
    }
    
  }

}
