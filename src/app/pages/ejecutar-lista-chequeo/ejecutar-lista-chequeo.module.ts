import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaChequeoModule } from '../../components/lista-chequeo/lista-chequeo.module';
import { EjecutarListaChequeoPageRoutingModule } from './ejecutar-lista-chequeo-routing.module';

import { EjecutarListaChequeoPage } from './ejecutar-lista-chequeo.page';
import { SeleccionItemModule } from '../seleccion-item/seleccion-item.module';
import { SeleccionItemComponent } from '../seleccion-item/seleccion-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EjecutarListaChequeoPageRoutingModule,
    ListaChequeoModule,
    SeleccionItemModule
  ],
  declarations: [EjecutarListaChequeoPage],
  entryComponents: [SeleccionItemComponent]
})
export class EjecutarListaChequeoPageModule {}
