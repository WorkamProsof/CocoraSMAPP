import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsumosPqrPage } from './insumos-pqr.page';

const routes: Routes = [
  {
    path: '',
    component: InsumosPqrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsumosPqrPageRoutingModule {}
