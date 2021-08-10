import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NITPage } from './nit.page';
import { LoginPage } from '../login/login.page';

const routes: Routes = [
{
	path: '',
	component: NITPage
}
];

@NgModule({
	imports: [
	CommonModule,
	FormsModule,
	IonicModule,
	RouterModule.forChild(routes)
	],
	declarations: [
		NITPage,
		LoginPage
	],
	entryComponents: [
		LoginPage
	]
})
export class NITPageModule {}
