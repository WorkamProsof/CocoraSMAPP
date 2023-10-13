import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroFotograficoComponent } from './registro-fotografico.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [RegistroFotograficoComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [RegistroFotograficoComponent]
})
export class RegistroFotograficoModule { }
