import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

import { SincronizarPageRoutingModule } from './sincronizar-routing.module';

import { SincronizarPage } from './sincronizar.page';

@NgModule({
	imports: [
	CommonModule,
	FormsModule,
	IonicModule,
	SincronizarPageRoutingModule
	],
	providers: [Network],
	declarations: [SincronizarPage]
})
export class SincronizarPageModule {}
