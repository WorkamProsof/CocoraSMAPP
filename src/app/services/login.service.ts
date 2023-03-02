import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { EnvService } from './env.service';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root'
})

export class LoginService {
	isLoggedIn =	false;
	token : 		any;
	isLoggedInNIT =	false;
	tokenNIT : 		any;

	constructor(
		private http: HttpClient,
		private env: EnvService,
		private storage: StorageService,
	) {
		this.getToken();
		this.getTokenNIT();
	}

	validarNIT(nit: String) {
		return this.http.post(this.env.API_URL + 'Login/ValidarNIT', {
			NIT: nit
		})
		.pipe(
			tap(tokenNIT => {
				if(tokenNIT == 1){
					this.storage.set('tokenNIT', nit);
					this.tokenNIT = nit;
					this.isLoggedInNIT = true;
					return nit;
				}else{
					return 0;
				}
			}),
		);
	}

	login(user: String, password: String) {
		const headers = new HttpHeaders({
			NIT: this.tokenNIT
		});
		return this.http.post(this.env.API_URL + 'Login/Ingreso', {
			user: user,
			password: password
		},{
			headers : headers
		})
		.pipe(
			tap(token => {
				if(token != 0 && typeof token === 'object'){
					this.storage.set('token', token['IngresoId']);
					this.token = token['IngresoId'];
					this.isLoggedIn = true;
					return token;
				}else{
					return 0;
				}
			}),
		);
	}

	logout() {
		const headers = new HttpHeaders({
			NIT: this.tokenNIT,
			Token: this.token
		});
		return this.http.get(this.env.API_URL + 'Login/Cierre',
		{
			headers: headers,
			observe: 'response'
		})
		.pipe(
			tap(data => {
				if(data.body == 1){
					this.storage.clear().then(() => {
						this.storage.set('tokenNIT', this.tokenNIT);
						this.isLoggedIn = false;
						delete this.token;
						delete this.tokenNIT;
					});
				}
			})
		)
	}

	async getToken() {
		return await this.storage.get('token').then(
			data => {
				this.getTokenNIT();
				this.token = data;
				if(this.token != null) {
					this.isLoggedIn=true;
				} else {
					this.isLoggedIn=false;
				}
			},
			erros => {
				this.token = null;
				this.isLoggedIn=false;
			}
		);
	}

	async getTokenNIT() {
		return await this.storage.get('tokenNIT').then(
			data => {
				this.tokenNIT     = data;
				if(this.tokenNIT != null) {
					this.isLoggedInNIT=true;
				} else {
					this.isLoggedInNIT=false;
				}
			},
			erros => {
				this.tokenNIT = null;
				this.isLoggedInNIT=false;
			}
		);
	} 
 
	getUsuarios() {
		const headers = new HttpHeaders({
			NIT: this.tokenNIT
		});
		return this.http.post(this.env.API_URL + 'Login/Usuarios', {},{
			headers : headers
		});
	}
}