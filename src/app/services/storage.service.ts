import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
	providedIn: 'root'
})

export class StorageService {

	constructor(
		private storage: Storage
	) { }

	public set(settingName, value) {
		return this.storage.set(`WOMS_APP:${ settingName }`, value);
	}

	public async get(settingName) {
		return await this.storage.get(`WOMS_APP:${ settingName }`);
	}

	public async remove(settingName) {
		return await this.storage.remove(`WOMS_APP:${ settingName }`);
	}

	public clear() {
		return this.storage.clear();
	}
}
