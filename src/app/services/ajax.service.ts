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

	settings: any;

	constructor(
		private http: HttpClient,
		private env: EnvService,
		private storage: StorageService,
		private loginService: LoginService
	) {
		const headers = new HttpHeaders({
			NIT: this.loginService.tokenNIT,
			Token: this.loginService.token,
			// 'Content-Type': 'application/json',
			"Content-Type": "application/json; charset=utf-8",
			// "Access-Control-Expose-Headers": "Token"
		});

		this.settings = {
			headers: headers,
			observe: 'response'
		};
	}

	NIT() {
		return this.loginService.tokenNIT;
	}

	ajax(url: string, data: object, customHeaders: any = null) {

		for (var attrname in customHeaders) {
			this.settings[attrname] = customHeaders[attrname];
			delete customHeaders[attrname];
		}
		return this.http.post(this.env.API_URL + url, data, this.settings).pipe(
			tap(data => {
				if (data.hasOwnProperty('headers')) {
					if (data['headers'].get('Token')) {
						if (data['headers'].get('Token') == '0') {
							// console.error('El usuario no está logeado');
						}
					}
				}
			})
		)

	}
}
