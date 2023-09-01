import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root' 
})
export class EnvService {
    // API_URL = 'http://192.168.0.224:8016/dev/WOMS_APP2/Back/'; //desarrollo loCAL
	API_URL = 'https://prosof.co:8011/testing/WOMS_APP2/Back/';  //testing
    // API_URL = 'https://prosof.co:8011/dev/WOMS_APP2/Back/'; desarrollo
	//API_URL = 'https://prosof.co:8011/WOMS_APP2/Back/'; //producción
	constructor() { } 
}
