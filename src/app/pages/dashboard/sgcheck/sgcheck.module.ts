import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

import { SgcheckPageRoutingModule } from './sgcheck-routing.module';

import { SgcheckPage } from './sgcheck.page';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
	imports: [
	CommonModule,
	FormsModule,
	IonicModule,
	SgcheckPageRoutingModule
	],
	providers: [Network, BarcodeScanner],
	declarations: [SgcheckPage]
})
export class SgcheckPageModule {}
