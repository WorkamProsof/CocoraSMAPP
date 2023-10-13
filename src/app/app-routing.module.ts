import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './guard/login.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'nit',
		pathMatch: 'full'
	},
	{
		path: 'nit',
		loadChildren: () => import('./pages/login/nit/nit.module').then( m => m.NITPageModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login/login.module').then( m => m.LoginPageModule)
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./pages/dashboard/dashboard/dashboard.module').then( m => m.DashboardPageModule),
		canActivate: [LoginGuard]
	},
	{
		path: 'ordentrabajo',
		loadChildren: () => import('./pages/ordentrabajo/ordentrabajo.module').then( m => m.OrdentrabajoPageModule),
		canActivate: [LoginGuard]
	},
	{
		path: 'cambioclave',
		loadChildren: () => import('./pages/cambioclave/cambioclave.module').then( m => m.CambioClavePageModule),
		canActivate: [LoginGuard]
	},
	{
		path: 'modalimagen',
		loadChildren: () => import('./modalimagen/modalimagen.module').then( m => m.ModalimagenPageModule)
	},
	{
		path: 'filtros',
		loadChildren: () => import('./pages/dashboard/modals/filtros/filtros.module').then( m => m.FiltrosPageModule)
	},
  	{
  	  	path: 'ejecutar-lista-chequeo',
  	  	loadChildren: () => import('./pages/ejecutar-lista-chequeo/ejecutar-lista-chequeo.module').then( m => m.EjecutarListaChequeoPageModule)
  	},
  	{
  	  	path: 'insumos-pqr/:pqrid',
  	  	loadChildren: () => import('./pages/insumos-pqr/insumos-pqr.module').then( m => m.InsumosPqrPageModule)
  	},

	];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
