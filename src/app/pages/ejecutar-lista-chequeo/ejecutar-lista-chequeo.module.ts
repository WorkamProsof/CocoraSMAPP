import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaChequeoModule } from '../lista-chequeo/lista-chequeo.module';
import { SeleccionClienteModule } from '../seleccion-cliente/seleccion-cliente.module';
import { EjecutarListaChequeoPageRoutingModule } from './ejecutar-lista-chequeo-routing.module';

import { EjecutarListaChequeoPage } from './ejecutar-lista-chequeo.page';
import { SeleccionClienteComponent } from '../seleccion-cliente/seleccion-cliente.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EjecutarListaChequeoPageRoutingModule,
    ListaChequeoModule,
    SeleccionClienteModule
  ],
  declarations: [EjecutarListaChequeoPage],
  entryComponents: [SeleccionClienteComponent]
})
export class EjecutarListaChequeoPageModule {}
