import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FiltrosPage } from '../modals/filtros/filtros.page';

@NgModule({
	imports: [
	CommonModule,
	FormsModule,
	IonicModule,
	DashboardPageRoutingModule
	],
	
	providers: [
		Network, 
		BarcodeScanner
	],

	declarations: [
		DashboardPage,
		FiltrosPage
	],

	entryComponents: [
		FiltrosPage
	]
})
export class DashboardPageModule {}