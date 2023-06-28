import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-seleccion-cliente',
  templateUrl: './seleccion-cliente.component.html',
  styleUrls: ['./seleccion-cliente.component.scss'],
})
export class SeleccionClienteComponent implements OnInit {

  @Input() listaClientes: Array<{nombre: string, terceroid: string}>;

  clientesfiltrados: any;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.clientesfiltrados = [...this.listaClientes];
  }

  busquedaCliente(event){
    const nombresSinNull = this.listaClientes.filter(c => c.nombre != null);
    this.clientesfiltrados = nombresSinNull.filter(c => c.nombre.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  seleccionCliente(cliente) {
    this.modalController.dismiss(cliente, 'confirmar');
  }

  cerrarModal() {
    this.modalController.dismiss(null, 'cancelar');
  }

}
