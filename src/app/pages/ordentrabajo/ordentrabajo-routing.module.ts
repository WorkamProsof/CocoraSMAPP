import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdentrabajoPage } from './ordentrabajo.page';

const routes: Routes = [
  {
    path: '',
    component: OrdentrabajoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdentrabajoPageRoutingModule {}
