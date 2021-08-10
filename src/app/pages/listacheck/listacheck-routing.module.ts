import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListacheckPage } from './listacheck.page';

const routes: Routes = [
  {
    path: '',
    component: ListacheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListacheckPageRoutingModule {}
