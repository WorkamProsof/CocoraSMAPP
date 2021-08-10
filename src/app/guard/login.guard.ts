import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
	providedIn: 'root'
})
export class LoginGuard implements CanActivate {
	constructor(
		private router: Router,
		private loginService: LoginService
	) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		const currentUser = this.loginService.isLoggedIn;
		if(currentUser) {
			// authorised so return true
			return true;
		}

		// not logged in so redirect to login page with the return url
		this.router.navigate(['/nit']);
		return false;
	}

}
