import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeleccionProductoComponent } from './seleccion-producto.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SeleccionProductoComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[SeleccionProductoComponent]
})
export class SeleccionProductoModule { }
