import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioClavePage } from './cambioclave.page';

const routes: Routes = [
  {
    path: '',
    component: CambioClavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambioClavePageRoutingModule {}
