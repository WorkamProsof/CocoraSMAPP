import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InsumosPqrPageRoutingModule } from './insumos-pqr-routing.module';
import { InsumosPqrPage } from './insumos-pqr.page';
import { SeleccionProductoComponent } from 'src/app/components/seleccion-producto/seleccion-producto.component';
import { SeleccionProductoModule } from 'src/app/components/seleccion-producto/seleccion-producto.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsumosPqrPageRoutingModule,
    SeleccionProductoModule
  ],
  declarations: [InsumosPqrPage],
  entryComponents: [SeleccionProductoComponent]
})
export class InsumosPqrPageModule {}
