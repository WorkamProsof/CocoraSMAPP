import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjecutarListaChequeoPage } from './ejecutar-lista-chequeo.page';

const routes: Routes = [
  {
    path: '',
    component: EjecutarListaChequeoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjecutarListaChequeoPageRoutingModule {}
