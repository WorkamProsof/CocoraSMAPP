
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CambioClavePage } from '../cambioclave/cambioclave.page';

import { OrdentrabajoPageRoutingModule } from './ordentrabajo-routing.module';

import { OrdentrabajoPage } from './ordentrabajo.page';

import { IonicSelectableModule } from 'ionic-selectable';
import { PipesModule } from '../../pipes/pipes.module';
 
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		OrdentrabajoPageRoutingModule,
		IonicSelectableModule,
		PipesModule
		
	],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [CambioClavePage],
	declarations: [OrdentrabajoPage]
	
})
export class OrdentrabajoPageModule {}
