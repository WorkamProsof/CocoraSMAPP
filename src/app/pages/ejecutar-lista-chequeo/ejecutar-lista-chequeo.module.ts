import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjecutarListaChequeoPageRoutingModule } from './ejecutar-lista-chequeo-routing.module';

import { EjecutarListaChequeoPage } from './ejecutar-lista-chequeo.page';
import { ListaChequeoModule } from '../lista-chequeo/lista-chequeo.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EjecutarListaChequeoPageRoutingModule,
    ListaChequeoModule
  ],
  declarations: [EjecutarListaChequeoPage]
})
export class EjecutarListaChequeoPageModule {}
