import { Injectable } from '@angular/core';

//import { UserModel } from './usermodel';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserDataService {

	/*
	private userDataUrl = 'app/userData';
	
	constructor(private http: Http) { }
	
	getUserModels(): Promise<UserModel[]> {
		//return Promise.resolve(HEROES);
		 return this.http.get(this.userDataUrl)
               .toPromise()
               .then(response => response.json().data as UserModel[])
               .catch(this.handleError);
	}
	
	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}

	
	//slow connection mock
	getUserModelSlowly(): Promise<UserModel[]> {
		return new Promise<UserModel>(resolve =>
		setTimeout(resolve, 2000)) // delay 2 seconds
		.then(() => this.getUserModels());
	}
	
	getUserModel(uid : number): Promise<UserModel> {
		return this.getUserModels().then(models => models.find(model => model.uid === uid));
	}
	
	
	private headers = new Headers({'Content-Type': 'application/json'});

	update(model: UserModel): Promise<UserModel> {
		const url = `${this.userDataUrl}/${model.uid}`;
		return this.http.put(url, JSON.stringify(model), {headers: this.headers})
			.toPromise()
			.then(() => model)
			.catch(this.handleError);
	}
	

	delete(uid: number): Promise<void> {
		const url = `${this.userDataUrl}/${uid}`;
		return this.http.delete(url, {headers: this.headers})
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}
	
	*/
}
