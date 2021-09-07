import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { ModalimagenPageModule} from  "./modalimagen/modalimagen.module";
import { FiltrosPageModule } from './dashboard/modals/filtros/filtros.module';


//firebase
//import {FCM} from '@ionic-native/fcm/ngx';
//
@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		ModalimagenPageModule,
		FiltrosPageModule,
		IonicStorageModule.forRoot(),
	],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [
		//FCM,
		StatusBar,
		SplashScreen,
		Camera,
		PhotoLibrary,
		CallNumber,
		Contacts,
		SMS,
		LocalNotifications,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
		
	],
	bootstrap: [AppComponent]
})

export class AppModule {}