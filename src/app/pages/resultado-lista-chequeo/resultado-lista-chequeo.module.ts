import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResultadoListaChequeoComponent } from './resultado-lista-chequeo.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [ResultadoListaChequeoComponent],
  exports: [ResultadoListaChequeoComponent]
})
export class ResultadoListaChequeoModule {}
