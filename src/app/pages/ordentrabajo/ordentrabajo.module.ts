
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';


import { IonicModule } from '@ionic/angular';
import { CambioClavePage } from '../cambioclave/cambioclave.page';

import { OrdentrabajoPageRoutingModule } from './ordentrabajo-routing.module';

import { OrdentrabajoPage } from './ordentrabajo.page';

import { IonicSelectableModule } from 'ionic-selectable'; 
import { PipesModule } from '../../pipes/pipes.module';
import { AgregarPqrsfrComponent } from 'src/app/pages/notas_inc_relacionadas/notas_inc_relacionadas.component';
import { ListaChequeoModule } from '../lista-chequeo/lista-chequeo.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		OrdentrabajoPageRoutingModule,
		IonicSelectableModule,
		PipesModule,
		ListaChequeoModule
	],
	// schemas: [NO_ERRORS_SCHEMA],
	providers: [CambioClavePage],
	declarations: [OrdentrabajoPage,AgregarPqrsfrComponent]
	,entryComponents : [AgregarPqrsfrComponent]
	
})
export class OrdentrabajoPageModule {}

