import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalimagenPageRoutingModule } from './modalimagen-routing.module';

import { ModalimagenPage } from './modalimagen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalimagenPageRoutingModule
  ],
  declarations: [ModalimagenPage]
})
export class ModalimagenPageModule {}
