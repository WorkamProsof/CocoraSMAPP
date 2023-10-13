import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumirInsumoComponent } from './consumir-insumo.component';
import { SeleccionProductoComponent } from '../seleccion-producto/seleccion-producto.component';
import { SeleccionProductoModule } from '../seleccion-producto/seleccion-producto.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ConsumirInsumoComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SeleccionProductoModule
  ],
  exports: [ConsumirInsumoComponent],
  entryComponents: [SeleccionProductoComponent]
})
export class ConsumirInsumoModule { }
