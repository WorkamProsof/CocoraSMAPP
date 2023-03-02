import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaChequeoComponent } from '../lista-chequeo/lista-chequeo.component';
import { ListaChequeoRoutingModule } from './lista-chequeo-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ListaChequeoRoutingModule
  ],
  declarations: [ListaChequeoComponent],
  exports: [ListaChequeoComponent]
})
export class ListaChequeoModule {}
