import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaChequeoModule } from '../lista-chequeo/lista-chequeo.module';
import { SeleccionClienteModule } from '../seleccion-cliente/seleccion-cliente.module';
import { EjecutarListaChequeoPageRoutingModule } from './ejecutar-lista-chequeo-routing.module';

import { EjecutarListaChequeoPage } from './ejecutar-lista-chequeo.page';

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
  declarations: [EjecutarListaChequeoPage]
})
export class EjecutarListaChequeoPageModule {}
