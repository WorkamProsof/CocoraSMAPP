import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaChequeoComponent } from './lista-chequeo.component';

const routes: Routes = [
  {
    path: '',
    component: ListaChequeoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaChequeoRoutingModule {}
