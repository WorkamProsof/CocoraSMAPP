import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
<<<<<<< HEAD
import { ListaChequeoModule } from '../lista-chequeo/lista-chequeo.module';
import { SeleccionItemModule } from '../seleccion-item/seleccion-item.module';
import { EjecutarListaChequeoPageRoutingModule } from './ejecutar-lista-chequeo-routing.module';

import { EjecutarListaChequeoPage } from './ejecutar-lista-chequeo.page';
import { SeleccionItemComponent } from '../seleccion-item/seleccion-item.component';
=======
import { ListaChequeoModule } from '../../components/lista-chequeo/lista-chequeo.module';
import { SeleccionClienteModule } from '../../components/seleccion-cliente/seleccion-cliente.module';
import { EjecutarListaChequeoPageRoutingModule } from './ejecutar-lista-chequeo-routing.module';

import { EjecutarListaChequeoPage } from './ejecutar-lista-chequeo.page';
import { SeleccionClienteComponent } from '../../components/seleccion-cliente/seleccion-cliente.component';
>>>>>>> 122747-alexander

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
