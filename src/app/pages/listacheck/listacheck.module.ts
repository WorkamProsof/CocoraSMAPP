import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListacheckPageRoutingModule } from './listacheck-routing.module';

import { ListacheckPage } from './listacheck.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListacheckPageRoutingModule
  ],
  declarations: [ListacheckPage]
})
export class ListacheckPageModule {}
