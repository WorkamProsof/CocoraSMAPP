import { Component, Input, OnInit } from '@angular/core';
import { ModalController,IonItemSliding } from '@ionic/angular';
import { IonicSelectableComponent } from "ionic-selectable";
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertService } from 'src/app/services/alert.service';
import { rendererTypeName } from '@angular/compiler';
import { NgForm ,FormGroup,FormControl} from '@angular/forms';

@Component({
  	selector: 'app-notas_inc_relacionadas',
  	templateUrl: './notas_inc_relacionadas.component.html',
  	styleUrls: ['./notas_inc_relacionadas.component.scss'],
})
export class AgregarPqrsfrComponent implements OnInit {
	@Input() pqrid        : string;
	@Input() accion       : string;
	@Input() estados      : Array<object>;
	@Input() incRelacionadas: Array<object>;
	searching             : boolean = false;
	nombreInputFile       : string  = "Seleccionar Archivo";
	formAcciones          : FormGroup;  //Fomulario
	buscarLista           : string  = '';
	
	anexosEstado = {
		estadopqrid : '', anexos : '',  descripcion : '' , pqrid : ''
	}

	private file: File;
	constructor(
		private alertService : AlertService,
		private modalController: ModalController,
		private notificaciones: NotificacionesService,
		private storageService: StorageService
	) {}

	async ngOnInit() {
		this.configForm();

		await this.storageService.get('notasIncRelacionadas').then(
			(data:any) => {
				data = JSON.parse(data);
			}
		);
	}

  	cerrarModal(datos?) {
		this.modalController.dismiss(datos);
	}

	configForm() {
		this.formAcciones = new FormGroup({
			'estadopqrid' : new FormControl(this.anexosEstado.estadopqrid),
			'descripcion' : new FormControl(this.anexosEstado.descripcion),
			'anexos'      : new FormControl(this.anexosEstado.anexos),
			'nombre'      : new FormControl(this.anexosEstado.pqrid)
		});

	}

	async guardarNotasEstados() {
		this.searching = true;
		if(this.formAcciones.value.descripcion != ''){
			const informacion ={}; 
			this.incRelacionadas.push({pqridrelacionada : this.pqrid,asunto : '', equipo : '' });
			informacion['pqris']             = this.pqrid; 
			informacion['estadopqrid']       = this.formAcciones.value.estadopqrid.id; 
			informacion['descripcion']       = this.formAcciones.value.descripcion;
			informacion['incRelacionadas']   = this.incRelacionadas;
			informacion['created_at']        = this.getDate();
			      
			
			if (this.file) {
				informacion['Archivos']      = await this.getBase64(this.file);
				informacion['ArchivoNombre'] = this.file.name;
				informacion['TipoArchivo']   = this.file.type;
			} else {
				informacion['Archivos']      = ''
			}
		
			this.storageService.get('notasIncRelacionadas').then(
				(data:any) => {
					data = JSON.parse(data);
					var arrDt = [];
					if(data == null){
						data = arrDt;
					}
					data.push(informacion);
					this.storageService.set('notasIncRelacionadas', JSON.stringify(data));
				}
			);
			this.alertService.presentToast('La nota registrada con exito', 'middle');
			this.cerrarModal();
			this.searching = true;
		}else{
			this.searching = false;
			this.alertService.presentToast('La nota no puede estar vacio', 'middle');
		}
	}

	getDate(){
		var date = new Date(),
		fecha = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return fecha;
	}

	onFileChange(event){
		this.file = event.target.files[0];
		if (this.file) {
			this.nombreInputFile = this.file.name;
		} else {
			this.nombreInputFile = 'Seleccionar Archivo';
		}
	}

	getBase64(file){
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				resolve(reader.result);
			}
			reader.onerror = function (error) {
				reject(error);
			}
		});
	}

	buscarFiltro(evento) {
		this.buscarLista = evento.detail.value;
	}
}
