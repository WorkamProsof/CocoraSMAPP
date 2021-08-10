import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NITPage } from './nit.page';

const routes: Routes = [
  {
    path: '',
    component: NITPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NITPageRoutingModule {}
