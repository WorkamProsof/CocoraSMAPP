import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalimagenPage } from './modalimagen.page';

const routes: Routes = [
  {
    path: '',
    component: ModalimagenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalimagenPageRoutingModule {}
