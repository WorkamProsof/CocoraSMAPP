import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-seleccion-item',
  templateUrl: './seleccion-item.component.html',
  styleUrls: ['./seleccion-item.component.scss'],
})
export class SeleccionItemComponent implements OnInit {

  @Input() listaItems: Array<{nombre: string, id: string}>;
  @Input() titulo: string;

  itemsFiltrados: any;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.itemsFiltrados = [...this.listaItems];
  }

  busquedaCliente(event){
    const nombresSinNull = this.listaItems.filter(i => i.nombre != null);
    this.itemsFiltrados = nombresSinNull.filter(i => i.nombre.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  seleccionCliente(item) {
    this.modalController.dismiss(item, 'confirmar');
  }

  cerrarModal() {
    this.modalController.dismiss(null, 'cancelar');
  }

}
