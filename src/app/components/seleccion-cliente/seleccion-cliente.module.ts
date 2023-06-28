import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SeleccionClienteComponent } from './seleccion-cliente.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [SeleccionClienteComponent],
  exports: [SeleccionClienteComponent]
})
export class SeleccionClienteModule {}
