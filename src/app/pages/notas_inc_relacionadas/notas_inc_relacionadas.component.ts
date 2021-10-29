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
	@Input() incRelacionadas:Array<object>;
	searching             : boolean = false;
	nombreInputFile       : string  = "Seleccionar Archivo";
	formAcciones          : FormGroup;  //Fomulario
	buscarLista           : string  = '';
	
	
	anexosEstado = {
		 estadopqrid : ''
		,anexos      : ''
		,descripcion : '' 
		,pqrid       : ''
		,privado     : '1'
	}
	
	ESTADOS             = [];
	Arraypqr            : any = [];
	transicionestadoapp : any = [];
	estadopqrid         : any;
	ListaincRelacionada : any = [];
	private file: File;
	constructor(
		private alertService : AlertService,
		private modalController: ModalController,
		private notificaciones: NotificacionesService,
		private storageService: StorageService
	) {}

	async ngOnInit() {
		let data : any = this.incRelacionadas;
		for (let i = 0; i < data.length; i++) {
			if(data[i].pqridrelacionada != this.pqrid){
				this.ListaincRelacionada.push(data[i])
			}
		}

		this.configForm();
	
		await this.storageService.get('notasIncRelacionadas').then(
			(data:any) => {
				data = JSON.parse(data);
			}
		);

		await this.storageService.get('inciSeleccionado').then(
			(data:any) => {
				data = JSON.parse(data);
				this.Arraypqr             = data;
				this.estadopqrid          = this.Arraypqr.estadopqrid;
			}
		);

		await this.storageService.get('transicionestadoapp').then(
			(data:any) => {
				this.transicionestadoapp = data;
			}
		);


		await this.storageService.get('ESTADOS').then(
			(data:any) => {
				data = JSON.parse(data);
				for (let i = 0; i < data[this.estadopqrid].length; i++) {
				this.ESTADOS.push({'id':data[this.estadopqrid][i].nuevoestado,'nombre':data[this.estadopqrid][i].nombrenuevoestadopqr});
				}
				this.ESTADOS.push({'id':this.Arraypqr.estadopqrid,'nombre':this.Arraypqr.nombreestadopqr});
			}
		);
		
		if(this.transicionestadoapp !='1'){
			this.ESTADOS = this.estados;
		}
	}

  	cerrarModal(datos?) {
		this.modalController.dismiss(datos);
	}

	configForm() {
		this.formAcciones = new FormGroup({
			'estadopqrid' : new FormControl(this.anexosEstado.estadopqrid),
			'descripcion' : new FormControl(this.anexosEstado.descripcion),
			'anexos'      : new FormControl(this.anexosEstado.anexos),
			'nombre'      : new FormControl(this.anexosEstado.pqrid),
			'privado'     : new FormControl(this.anexosEstado.privado)
		});

	}

	  // valida color de fondo para cambiar color de letra
  getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace("#","");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'Black' : 'white';
  }
  

	async guardarNotasEstados() {
		this.searching = true;
		if(this.formAcciones.value.descripcion != ''){
			const informacion ={}; 
			
			informacion['pqris']             = this.pqrid; 
			informacion['estadopqrid']       = this.formAcciones.value.estadopqrid.id ? this.formAcciones.value.estadopqrid.id : null; 
			informacion['descripcion']       = this.formAcciones.value.descripcion;
			informacion['privado']           = this.formAcciones.value.privado ? true : this.formAcciones.value.privado;
			informacion['incRelacionadas']   = this.ListaincRelacionada;
			informacion['created_at']        = this.getDate();

			informacion['incRelacionadas'].push({pqridrelacionada : this.pqrid,asunto : '', equipo : '' });
			
			if (this.file) {
				informacion['Archivos']      = await this.getBase64(this.file);
				informacion['ArchivoNombre'] = this.file.name;
				informacion['TipoArchivo']   = this.file.type;
			} else {
				informacion['Archivos']      = '';
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
