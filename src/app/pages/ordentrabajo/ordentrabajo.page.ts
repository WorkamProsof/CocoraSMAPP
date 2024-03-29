import { IonItemSliding, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuController, AlertController, NavController, Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { AlertService } from 'src/app/services/alert.service';
import { CambioClavePage } from '../cambioclave/cambioclave.page';
import { Camera,CameraOptions} from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { NgForm } from '@angular/forms';
import { CallNumber     } from '@ionic-native/call-number/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ModalimagenPage } from '../../modalimagen/modalimagen.page';
import * as moment from 'moment';
import { mapTo, timeout } from 'rxjs/operators';
import { IonicSelectableComponent } from "ionic-selectable";
import { FiltroListaPipe } from 'src/app/pipes/filtro-lista/filtro-lista.pipe';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { AgregarPqrsfrComponent } from 'src/app/pages/notas_inc_relacionadas/notas_inc_relacionadas.component';
import { ListaChequeoComponent } from '../../components/lista-chequeo/lista-chequeo.component';
import { ResultadoListaChequeoComponent } from '../resultado-lista-chequeo/resultado-lista-chequeo.component';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { HttpClient } from '@angular/common/http';
import { ConsumirInsumoComponent } from 'src/app/components/consumir-insumo/consumir-insumo.component';
import { RegistroFotograficoComponent } from 'src/app/components/registro-fotografico/registro-fotografico.component';

@Component({
	selector: 'app-ordentrabajo', 
	templateUrl: './ordentrabajo.page.html',
	styleUrls: ['./ordentrabajo.page.scss'],
	encapsulation: ViewEncapsulation.None
})
export class OrdentrabajoPage implements OnInit {
	constructor(
		private menu : MenuController,
		private camera : Camera,
		private navCtrl : NavController,
		private storageService : StorageService,
		private alertService : AlertService,
		private alertController: AlertController,
		private platform: Platform,
		private cambioclave: CambioClavePage,
		private localNotifications : LocalNotifications,
		private modalCtrl : ModalController,
		private photoLibrary : PhotoLibrary,
		private notificaciones: NotificacionesService,
		private network: Network,
		private http: HttpClient,
	  //  private callNumber : CallNumber

	  ) {
		if(!(this.platform.is('mobileweb') || this.platform.is('desktop'))){
			// On Device 
			this.platform.backButton.subscribe(() => {
				this.irAtras();
			});
		}
	}

	multipleactividadapp : boolean = false;
	actividadmultiple : string = '';
	incRelacionadas     : any = [];


	validaPausa : boolean = false;
	searching   : boolean = true;
	buscarLista : string = '';
	Icon 	: string 	= 'arrow-dropdown-circle';
	validaObservacion   : boolean = false;
	proincrelacionadasapp : boolean = false;
	transicionestadoapp : any;
	multipleoperarios   : any;
	tecnicoDisabled     : boolean = false;

	validarutaapp       : any;
	image               : any;
	arryayImage         : any = [];
	arryayImage_aux     : any = [];
	ESTADOSESTADOS      : any = [];
	usuario             : any;
	privado             = '1';
	datoeEstadoSelet    : any;
	datoTecnicoSelet    : any;
	datoTecnicoSelet_aux: any;
	estadoSelet         = false;
	estadopqrid         : any;
	logoempresa         : any;
	Arraypqr            : any;
	ArraypqrNotas       : any;
	tiposParadas        : any;
	ESTADOS             = [];
	patio               : any;
	PatioId             : any;
	tipoParada          : string = '';
	estadoInc           : string = '';
	estadoFinInc        : string = '';
	procesoPausa        = false;
	procesoIniciar      = false;
	procesoFin          = false;
	seleccionProceso    = false;
	columnas            : any = [];
	columna             : any;
	filas               : any = [];
	fila                : any;
	observacion         : string = '';
	movimientos         : any = [];
	tipoactividades     : any;
	tipoactividadid     : any = [];
	Arryusuarios        : any = [];
	proceso             : any = null;
	tipoactividadSel    : any;
	forNota             = false;
	forNotaHistotial    = false;
	selectMultiple      = true;
	arrayTenicosAsignados : any;
	isConnected			= true;
	private online: Observable<boolean>;
	
	actividades: Array<Object> = [{
		id: "Inicio",
		nombre: "Limpiar lavadora"
	},{
		id: "Pausado",
		nombre: "aceitada horno"
	}];

	async ngOnInit() {
		if (!(this.platform.is('mobileweb') || this.platform.is('desktop'))) {
			// On Device 

			this.network.onDisconnect().subscribe(() => {
				this.isConnected = false;
			});

			this.network.onConnect().subscribe(() => {
				setTimeout(() => {
					this.isConnected = true;
				}, 2000);
			});

			try {
				this.getNetworkTestRequest().subscribe(success => {
					//con internet
					this.isConnected = true;
					return;
				}, error => {
					//sin internet
					this.isConnected = false;
					return;
				});
			} catch (err) {
				this.isConnected = false;
				return;
			}
		} else {
			// On Browser 
			this.online = merge(
				of(navigator.onLine),
				fromEvent(window, 'online').pipe(mapTo(true)),
				fromEvent(window, 'offline').pipe(mapTo(false))
			);

			//valida si esta en linea o no 
			this.online.subscribe((isOnline) => {
				if (isOnline) {
					this.isConnected = true;
				} else {
					//no esta en linea
					this.isConnected = false;
				}
			});
		}
		
		this.alertas();
		this.menu.enable(false);
		this.menu.close();

		

		await this.storageService.get('logoempresa').then(
			(data:any) => {
				this.logoempresa = data;
			} 
			);

		await this.storageService.get('Arryusuarios').then(
			(data:any) => {
				this.Arryusuarios = data;
			} 
			);

		await this.storageService.get('usuarios').then(
			(data:any) => {
				this.usuario = data.user;
				// this.datoTecnicoSelet = data.user;
			}
			);
		
		await this.storageService.get('transicionestadoapp').then(
			(data:any) => {
				this.transicionestadoapp = data;
			}
			);

		await this.storageService.get('multipleoperarios').then(
			(data:any) => {
				this.multipleoperarios = data;
				if(this.multipleoperarios == '1'){
					this.selectMultiple = true;
				}else{
					this.selectMultiple = false;
				}
			}
			);

		await this.storageService.get('validarutaapp').then(
			(data:any) => {
				this.validarutaapp = data;
			}
			);

		
		await this.storageService.get('proincrelacionadasapp').then(
			(data:any) => {
				this.proincrelacionadasapp = data;
			}
			);

		await this.storageService.get('multipleactividadapp').then(
			(data:any) => {
				this.multipleactividadapp = data;
			}
			);

		await this.storageService.get('inciSeleccionado').then(
			(data:any) => {
				data = JSON.parse(data);
				this.Arraypqr             = data;
				this.Arraypqr.fechapqr    = moment(this.Arraypqr.fechapqr).format('DD-MM-YYYY');
				this.ArraypqrNotas        = data.ArrayNotasPqr;
				this.estadoInc            = this.Arraypqr.accion;
				this.tipoactividadid      = this.Arraypqr.tipoactividadid;
				this.estadopqrid          = this.Arraypqr.estadopqrid;
				this.datoeEstadoSelet     = this.Arraypqr.estadopqrid;
				this.datoTecnicoSelet     = this.selectMultiple == true ? this.Arraypqr.tecniosAsignados : this.usuario;
				this.datoTecnicoSelet_aux = this.datoTecnicoSelet;
				this.tecnicoDisabled      = this.Arraypqr.cierre == '1' ? true : false;
				this.tipoactividades      = this.Arraypqr.actividadPqr;//nueva modificacion
				this.incRelacionadas      = this.Arraypqr.incRelacionadas;
			}
			);

		await this.storageService.get('tiposParadas').then(
			(data:any) => {
				data = JSON.parse(data);
				this.tiposParadas = data;
			}
			);
		let self = this;


		await this.storageService.get('ESTADOS').then(
			(data:any) => {
				data = JSON.parse(data);
				this.ESTADOS = data[this.estadopqrid];
				this.ESTADOS.push({'nuevoestado':this.Arraypqr.estadopqrid,'nombrenuevoestadopqr':this.Arraypqr.nombreestadopqr});
			}
			);

		await this.storageService.get('TODOSESTADOS').then(
			
			(data:any) => {
				data = JSON.parse(data);
				this.ESTADOSESTADOS = data;
			}
			);

		await this.storageService.get('arryayImage').then(
			(data:any) => {
				if(JSON.parse(data) != 0){
					this.arryayImage = JSON.parse(data) ? JSON.parse(data) :[]; 
					for (let i = 0; i < this.arryayImage.length; i++) {
						if(this.Arraypqr.pqrid == this.arryayImage[i]['pqrid']){
							this.arryayImage_aux.push({'img':this.arryayImage[i]['img']});
						} 	
					}
				}
			}
		);
	}

	private getNetworkTestRequest() {
		return this.http.get('https://jsonplaceholder.typicode.com/todos/1');
	}

	alertas(){
		this.localNotifications.schedule({
			text : 'texto de notificacion',
			trigger: {at: new Date(new Date().getTime() + 3600)},
			led:'FF0000',
			sound : null
		});
	}

	changePrivate(){
		if(this.privado == '1'){
			this.privado = '0';
		}else{
			this.privado = '1';
		}
	}

	seleccionTipoParada(select){
		this.tipoParada = select.detail.value;
	}

	seleccionActividad(select){
		this.tipoactividadid  = select.detail.value;
		this.tipoactividadSel = select.detail.value;
	}

	iniciar(){
		this.procesoIniciar = true;
		this.storageService.get('INCI').then(
			(data:any) => {
				data = JSON.parse(data);
				this.tipoactividades = this.Arraypqr.actividadPqr;
			}
			);
	}

	iniciarRuta(){
		// se continua la operacion
		var movim = {
			tipo 		    : 'storeLog',
			accion          : 'InicioRuta',
			pqrid   	    : this.Arraypqr.pqrid,
			estado 		    : 'InicioRuta',
			tipoParada 	    : null,
			tipoactividadid : null,
			created_at      : this.getDate(),
		};

		this.llenarMovimientos(movim);

		this.storageService.get('INCI').then(
			(data:any) => {
				data = JSON.parse(data);
				this.storageService.remove('INCI');
				this.storageService.set('INCI', JSON.stringify(this.actualizarInci(data, this.Arraypqr, 'InicioRuta',null,this.estadopqrid)));
			}
			);

		this.alertService.presentToast('Inicio Ruta la operación', 'middle');
		this.estadoInc = 'InicioRuta';	
	}

	FinalizoRuta(){
		// se continua la operacion
		var movim = {
			tipo 		    : 'storeLog',
			accion          : 'FinalizoRuta',
			pqrid   	    : this.Arraypqr.pqrid,
			estado 		    : 'FinalizoRuta',
			tipoParada    	: null,
			tipoactividadid : null,
			created_at      : this.getDate(),
		};

		this.llenarMovimientos(movim);

		this.storageService.get('INCI').then(
			(data:any) => {
				data = JSON.parse(data);

				this.storageService.remove('INCI');
				this.storageService.set('INCI', JSON.stringify(this.actualizarInci(data, this.Arraypqr, 'FinalizoRuta',null,this.estadopqrid)));
			}
			);

		this.alertService.presentToast('Finalizo Ruta la operación', 'middle');
		this.estadoInc = 'FinalizoRuta';	
	}

	procesarIniciar(){
		if(this.tipoactividadSel == undefined){
			this.alertService.presentToast('Seleccione la  Atividad del equipo', 'middle');
		}else{
			// se inicia la incidencia
			var movim = {
				tipo 		        : 'storeLog',
				accion              : 'iniciar',
				pqrid   	        : this.Arraypqr.pqrid,
				estado 		        : 'I',
				tipoParada      	: null,
				tipoactividadid 	: this.tipoactividadid,
				created_at 		    : this.getDate(),
			};

		
			this.llenarMovimientos(movim);
			this.storageService.get('INCI').then(
				(data:any) => {
					data = JSON.parse(data);
					this.storageService.remove('INCI');
					this.storageService.set('INCI', JSON.stringify(this.actualizarInci(data,this.Arraypqr, 'pausar',this.tipoactividadid,this.estadopqrid)));
				}
				);

			this.alertService.presentToast('Inicio la Actividad', 'middle');
			this.estadoInc = 'iniciar';
			this.procesoIniciar = false;
		}
	}

	
	dataObservacion(){
		if(this.Icon == 'arrow-dropdown-circle'){
			this.validaObservacion = true;
			this.Icon = 'arrow-dropup-circle';
		}else{
			this.validaObservacion = false;
			this.Icon = 'arrow-dropdown-circle';
		}
	}

	continuar(){
		// se continua la operacion
		var movim = {
			tipo 		: 'storeLog',
			accion      : 'continuar',
			pqrid   	: this.Arraypqr.pqrid,
			estado 		: 'continuar',
			tipoParada 	: this.tipoParada,
			tipoactividadid : this.tipoactividadid,
			created_at  : this.getDate(),
		};

		this.llenarMovimientos(movim);

		this.storageService.get('INCI').then(
			(data:any) => {
				data = JSON.parse(data);

				this.storageService.remove('INCI');
				this.storageService.set('INCI', JSON.stringify(this.actualizarInci(data, this.Arraypqr, 'continuar',this.tipoactividadid,this.estadopqrid)));
			}
			);

		this.alertService.presentToast('Continuo la operación', 'middle');
		this.estadoInc = 'continuar';	
	}

	pausar(){
		this.procesoPausa = true;
		this.procesoFin = false;
		this.PatioId = null;
		this.proceso = null;
		this.storageService.get('tiposParadas').then(
			(data:any) => {
				data = JSON.parse(data);
				this.tiposParadas = data;
			}
			);
	}

	finalizar(){
		this.estadoFinInc = "finalizar";
	}

	procesarPausa(){
		if(this.tipoParada == ''){
			this.alertService.presentToast('Seleccione el Tipo de Parada', 'middle');
		}else{
			var movim = {
				tipo 		    : 'storeLog',
				accion          : 'pausar', 
				pqrid   	    : this.Arraypqr.pqrid, 
				estado 		    : 'P',
				tipoParada      : this.tipoParada,
				tipoactividadid : this.tipoactividadid,
				inicio 		    : -1,
				created_at	    : this.getDate(),
			};

			this.llenarMovimientos(movim);
			this.storageService.get('INCI').then(
				(data:any) => {
					data = JSON.parse(data);
					this.storageService.remove('INCI');
					this.storageService.set('INCI', JSON.stringify(this.actualizarInci(data, this.Arraypqr, 'pausar',this.tipoactividadid,this.estadopqrid)));
				}
				);
		
			this.alertService.presentToast('Pausó la operación', 'middle');
			this.estadoInc = 'pausar';
			this.procesoPausa = false;
		}
	}

	FinalizarActividad(){
		this.estadoFinInc       = "";
		var movim = {
			tipo 		        : 'storeLog',
			accion              : 'finalizaractividad',
			pqrid   	        : this.Arraypqr.pqrid, 
			estado 		        : 'P',
			tipoParada 	        : null,
			tipoactividadid 	: this.tipoactividadid,
			inicio 		        : -1,
			created_at	        : this.getDate(),
		};

		this.llenarMovimientos(movim);
		this.storageService.get('INCI').then(
			(data:any) => {
				data = JSON.parse(data);
				this.storageService.remove('INCI');
				this.storageService.set('INCI', JSON.stringify(this.actualizarInci(data, this.Arraypqr, 'finalizaractividad',this.tipoactividadid,this.estadopqrid)));
			}
			);

		let self = this;
		this.alertService.presentToast('Finalizó la actividad', 'middle');
		setTimeout(function(){
			self.irAtras();
		}, 1500);
	}



	seleccionEstadopqr(select,option = 1){
		if(option == 1){
			this.datoeEstadoSelet  = select.detail.value;
			let estado = this.ESTADOS.filter(data => data.nuevoestado == this.datoeEstadoSelet);
			if(estado[0].cierre == '1'){
				this.datoTecnicoSelet = this.datoTecnicoSelet_aux;
				this.tecnicoDisabled = true;
			}else{
				this.tecnicoDisabled = false;
			}
		}else{
			this.datoTecnicoSelet  = select.detail.value;
		}
	}

	FinalizarIncidencia(){
		let valida = false;
		this.notificaciones.alerta("¿Desea finalizar la Incidencia " + this.Arraypqr.pqrid + "?").then(({ role, data }) => {
			if (role == 'aceptar') {
				if(this.estadoSelet == false  &&  this.transicionestadoapp == 1){
					this.estadoSelet = true;
				}else{
					if((this.datoTecnicoSelet == undefined || this.datoTecnicoSelet == '') &&  this.transicionestadoapp == 1){
						this.alertService.presentToast('Seleccione el Tecnico de la Incidencia', 'middle');
						return;
					}
		
					if((this.datoeEstadoSelet == undefined || this.datoeEstadoSelet == '') &&  this.transicionestadoapp == 1){
						this.alertService.presentToast('Seleccione el Estado de la Incidencia', 'middle');
					}else{	
						this.datoTecnicoSelet = this.selectMultiple == true ? this.datoTecnicoSelet : [this.datoTecnicoSelet];
						this.estadoFinInc       = "";
						var	movim = {
								tipo 		        : 'storeLog',
								accion              : 'finalizar',
								pqrid   	        : this.Arraypqr.pqrid, 
								estado 		        : 'P',
								tipoParada 	        : null,
								tipoactividadid 	: this.tipoactividadid,
								inicio 		        : -1,
								created_at	        : this.getDate(),
								Tecnicoasignado	    : this.datoTecnicoSelet,
								coordinadorid       : this.Arraypqr.coordinadorid, 
								estadopqrid         : this.transicionestadoapp == 1 ? this.datoeEstadoSelet : null,
							};
		
						this.llenarMovimientos(movim);
						this.storageService.get('INCI').then(
							(data:any) => {
								data = JSON.parse(data);
								this.storageService.remove('INCI');
								this.storageService.set('INCI', JSON.stringify(this.actualizarInci(data, this.Arraypqr, 'finalizar',this.tipoactividadid,this.estadopqrid)));
							}
							);
		
						let self = this;
						this.alertService.presentToast('Finalizó la Incidencia', 'middle');
						this.estadoSelet = false;
						setTimeout(function(){
							self.irAtras();
						}, 1500);
					}
				}
			} else {
				valida = true;
			}
		});
	}

	Setcamera(param){
		
		var dataOption = {};
		if(param == 1){
			//configuracion Imagenes
			dataOption = {
				quality: 100,
				destinationType : this.camera.DestinationType.DATA_URL,
				targetWidth :1000,
				targetHeight : 1000,
			};
		}else{
			/// configuracion Galeria
			dataOption = {
				sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
				destinationType:this.camera.DestinationType.DATA_URL,
			}; 
		}

		let options: CameraOptions = dataOption
		this.camera.getPicture(options).then((imageData) =>{
			if (options.sourceType != undefined || options.sourceType == 0) {
				//SE VERIFICA SI LA INFORMACION DE LA IMAGEN LLEGA CON EXTENCION, DE SER ASI NO SE GUARDA PORQUE NO HAY FORMA DE RECONOCER QUE TIPO DE IMAGEN ES
				let imagenExtencion = imageData.split('.');
				if (imagenExtencion.length > 1) {
					this.alertService.presentToast('No se puede subir ese tipo de imagen');
					return;
				};
			};
			var contenido = `${imageData}`;
			this.image = `data:image/jpeg;base64,${imageData}`;
			let objimg = {
				'img'       : this.image,
				'contenido' : contenido,
				'pqrid'     : this.Arraypqr.pqrid,
				'created_at': this.getDate()
			}

		 	this.arryayImage_aux.push(objimg);
		    this.arryayImage.push(objimg);
			this.storageService.set('arryayImage', JSON.stringify(this.arryayImage));
		
		 },(err) => {
				//Handle error 
		 });
	}

	verCrearNota(){
		if(this.forNota == false){
			this.forNota = true;
		}else{
			this.forNota = false;
		}
		this.forNotaHistotial = false;
	}

	verHistorialNota(){
		if(this.forNotaHistotial == false){
			this.forNotaHistotial = true;
		}else{
			this.forNotaHistotial = false;
		}
		this.forNota = false;
	}

	cerrarNota(){
		this.forNota = false;
		this.forNotaHistotial = false;
		this.privado          = '1';

	}

	async submitNotaDetalle(form: NgForm){
		if(form.value.detalle != ''){
			var crear_notaDetallepqr = {
				'detallepqrid'        : this.Arraypqr.detallepqrid,
				'detalle'             : form.value.detalle,
				'pqrid'               : this.Arraypqr.pqrid,
				'privado'             : this.privado,
				'created_at'          : this.getDate()
			}
			this.alertService.presentToast('Registro Guardado Exitosamente', 'middle');
			this.llenarNotadetalle(crear_notaDetallepqr);
			this.privado          = '1';
		}else{
			this.alertService.presentToast('La nota no puede estar vacio', 'middle');
		}
		
	}

	irAtras(){
		this.navCtrl.navigateRoot('/dashboard');
	}

	search(key, nameKey, myArray) {
		for (var i = 0; i < myArray.length; i++) {
			if(myArray[i][key] === nameKey) {
				return myArray[i];
			}
		}
	}

	getDate(){
		var date = new Date(),
		fecha = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return fecha;
	}

	llenarMovimientos(movim){
		this.storageService.get('movimientos').then(
			(data:any) => {
				data = JSON.parse(data);
				var arrDt = [];
				if(data == null){
					data = arrDt;
				}
				data.push(movim);
				this.storageService.set('movimientos', JSON.stringify(data));
			}
		);
	}

	llenarNotadetalle(notaDetalle){
		this.storageService.get('notaDetalle').then(
			(data:any) => {
				data = JSON.parse(data);
				var arrDt = [];
				if(data == null){
					data = arrDt;
				}
				data.push(notaDetalle);
				this.storageService.set('notaDetalle', JSON.stringify(data));
				let nota = {
					'detalle'       : notaDetalle.detalle,
					'privado'       : notaDetalle.privado,
					'created_at'    : this.getDate(),
					'nombreusuario' : this.usuario.nombreusuario
				}
				this.ArraypqrNotas.push(nota);
				this.forNota = false;
			}
			);
	} 

	actualizarInci(dt, dtSelect, accion,tipoactividadid,estadopqrid){
		var arr = []; 
		var j = 0;

		for(var i = 0; i < dt.length; i++){
			if(dt[i].pqrid == dtSelect.pqrid){
				// Acá es cuando Finaliza
				if(accion  == 'finalizar'){
					dtSelect.finalizo    = 1;
				}
				dtSelect.accion          = accion;
				dtSelect.tipoactividadid = tipoactividadid;
				dtSelect.estadopqrid     = estadopqrid;
				
				arr[j] = dtSelect;
				j++;
			}else{
				arr[j] = dt[i];
				j++;
			}
		}
		return arr;
	}

	convertNumber($l){ 
		var $letras = $l.split();
		var $numero = 0;
		var $numeros = $letras.length;
		if($numeros > 1){
			$numero = 26 * ($numeros - 1);
		}
		$numero += (this.ord($letras[$numeros - 1]) - 64);
		return $numero;
	}

	ord(str){
		return str.charCodeAt(0);
	}

	verImagen(){
		this.modalCtrl.create({
			component: ModalimagenPage,
			componentProps : {
				image : this.arryayImage_aux,
				pqr   : this.Arraypqr.pqrid
			}
		}).then(modal => modal.present())
	}

	buscarFiltro(evento) {
		this.buscarLista = evento.detail.value;
	}

	slidingVehiculo(ref) {
		let elem: any = document.getElementById(ref);
		(elem as IonItemSliding).getSlidingRatio().then(numero => {
			if (numero === 1) {
				(elem as IonItemSliding).close();
			} else {
				(elem as IonItemSliding).open("end");
			}
		});
	}



	accionActividad(nombreaccion:string ,tipo: string, tipoactividadid: number, nombre?: string) {
		// console.log(nombreaccion);
		// console.log(tipo);
		// console.log(tipoactividadid);
		// console.log(nombre);
		this.searching = true;
		if(tipo == 'pausar'){
			this.procesarPausaMultiple(nombreaccion,tipo,tipoactividadid);
		}else{
			let valida = false;
			if(tipo == 'finalizaractividad'){
				this.notificaciones.alerta("¿Desea finalizar la actividad " + nombre + "?").then(({ role, data }) => {
					if (role == 'aceptar') {
						this.actualizarMovimientoMultiple(nombreaccion,tipo,tipoactividadid);
					} else {
						this.searching = false;
						valida = true;
					}
				});
			}else{
				this.actualizarMovimientoMultiple(nombreaccion,tipo,tipoactividadid);
			}
		}
	}

	actualizarMovimientoMultiple(nombreaccion,tipo,tipoactividadid){
		console.log(nombreaccion);
		console.log(tipo);
		console.log(tipoactividadid);
		if(tipo == 'pausar'){
			tipoactividadid  = this.actividadmultiple;
			this.validaPausa = false;
		}

		this.validaPausa = false;
		this.actualizarActividades(nombreaccion,tipo,tipoactividadid);
		var movim = {
			tipo 		: 'storeLog',
			accion      : tipo,
			pqrid   	: this.Arraypqr.pqrid,
			estado 		: tipo,
			tipoParada 	: this.tipoParada,
			tipoactividadid : tipoactividadid,
			created_at  : this.getDate(),
		};

		this.llenarMovimientos(movim);

		this.storageService.get('INCI').then(
			(data:any) => {
				data = JSON.parse(data);

				this.storageService.remove('INCI');
				this.storageService.set('INCI', JSON.stringify(this.actualizarInci(data, this.Arraypqr, tipo,tipoactividadid,this.estadopqrid)));
			}
			);
		this.alertService.presentToast(tipo + ' la operación', 'middle');	
		
	}


	//funciones multiples para el inicio actividaddes mukltiples
	procesarPausaMultiple(nombreaccion,tipo,id){
		this.validaPausa = true;
		this.actividadmultiple = id;
		this.actualizarActividades(nombreaccion,tipo,id);
	}

	pausaMultiple(){
		if(this.tipoParada == ''){
			this.alertService.presentToast('Seleccione el Tipo de Parada', 'middle');
		}else{
			this.actualizarMovimientoMultiple('Pausada','pausar',this.actividadmultiple);
		}
	}

	actualizarActividades(nombreaccion,tipo,tipoactividadid){
		this.tipoactividades = this.tipoactividades.filter(function(elemento){
				if(elemento.id == tipoactividadid){
					elemento.accion = tipo;
					elemento.nombreaccion = nombreaccion;
					
				}
				return elemento;
			});

		var dataArray :any = [];
		this.storageService.get('inciSeleccionado').then(
			(data:any) => {
				dataArray = JSON.parse(data);
				dataArray.actividadPqr = this.tipoactividades;
				this.storageService.remove('inciSeleccionado');
				this.storageService.set('inciSeleccionado', JSON.stringify(dataArray)).then(() => {

				});
			}
		);
	}


	// datos de actualizar notas maxivas
	async formularioInc(accion = "crear") {
		let componentProps = { 
			accion, 
			estados       : this.ESTADOSESTADOS,
			pqrid         :this.Arraypqr.pqrid,
			incRelacionadas : this.incRelacionadas
		};
		const modal = await this.modalCtrl.create({
			component: AgregarPqrsfrComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({data}) => {
			console.log(data);
			if (data == 'listar') {
				// this.listaPQRSF = [];
				// let datos = {
				// 	inicio: this.inicio,
				// 	fin: this.fin,
				// 	where: this.buscarLista,
				// 	fechaInicio: this.fechaInicio,
				// 	fechaFin: this.fechaFin,
				// 	tipoReunion: this.tipoReunion
				// }
				// this.listaPQR(datos);
			}
		}, console.error);
	}

	// Mostar modal para listas de chequeo
	async listasChequeo() {
		const modal = await this.modalCtrl.create({
			component:  ListaChequeoComponent,
			componentProps: { 
				listasChequeo	: this.Arraypqr.listaCheck,
				listaChequeoHTML: this.Arraypqr.listaCheckHTML,
				pqrid: this.Arraypqr.pqrid,
				itemequipoid: this.Arraypqr.itemequipoid,
			}
		});
		await modal.present();
		modal.onWillDismiss().then(({data}) => {
		}, console.error);
	}

	async resultadosListasChequeo() {
		const modal = await this.modalCtrl.create({
			component:  ResultadoListaChequeoComponent,
			componentProps: { 
				listasChequeo	: this.Arraypqr.listaCheck,
				pqrid: this.Arraypqr.pqrid,
			}
		});
		await modal.present();
	}

	// Mostar pagina para usar insumos incidencia
	async verInsumos() {
		const modal = await this.modalCtrl.create({
			component:  ConsumirInsumoComponent,
			componentProps: { 
				almacenDescarga	: this.Arraypqr.almacendescarga,
				pqrid			: this.Arraypqr.pqrid
			}
		});
		await modal.present();
	}

	// Mostar pagina para ver evidencia fotografica
	async verEvidenciasFotograficas() {
		const modal = await this.modalCtrl.create({
			component:  RegistroFotograficoComponent,
			componentProps: { 
				pqrid			: this.Arraypqr.pqrid
			}
		});
		await modal.present();
	}

}

	