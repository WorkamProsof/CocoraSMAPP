import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SgcheckPage } from './sgcheck.page';

const routes: Routes = [
  {
    path: '',
    component: SgcheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SgcheckPageRoutingModule {}
