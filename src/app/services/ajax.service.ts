import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { EnvService } from './env.service';
import { StorageService } from './storage.service';
import { LoginService } from './login.service';

@Injectable({
	providedIn: 'root'
})
export class AjaxService {

	constructor(
		private http: HttpClient,
		private env: EnvService,
		private storage: StorageService,
		private loginService: LoginService
	) { }

	NIT(){
		return this.loginService.tokenNIT;
	}

	ajax(url: string, data: object, customHeaders : any = null) {
		const headers = new HttpHeaders({
			NIT: this.loginService.tokenNIT,
			Token: this.loginService.token,
			// 'Content-Type': 'application/json',
			"Content-Type": "application/json; charset=utf-8",
			// "Access-Control-Expose-Headers": "Token"
		});
		var settings : any = {
			headers: headers,
			observe: 'response'
		};

		for(var attrname in customHeaders){
			settings[attrname] = customHeaders[attrname];
			delete customHeaders[attrname];
		}

		return this.http.post(this.env.API_URL + url, data, settings).pipe(
			tap(data => {
				if(data.hasOwnProperty('headers')){
					if(data['headers'].get('Token')){
						if(data['headers'].get('Token') == '0'){
							// console.error('El usuario no está logeado');
						}
					}
				}
			})
		)
	}	
}
