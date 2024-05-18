import { Injectable } from '@angular/core';
import { Estate } from './estate';

@Injectable({
  providedIn: 'root'
})
export class EstateService {

  constructor() { }
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';
  url = 'http://localhost:5283/estate';

  async getAllEstates(): Promise<Estate[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }
  
  async getEstateById(id: number): Promise<Estate | undefined> {
    const data = await fetch(`${this.url}/id?id=${id}`);
    return await data.json() ?? {};
  }

  async getEstatesByUserId(userid: number): Promise<Estate | undefined> {
    const data = await fetch(`${this.url}/userid?userid=${userid}`);
    return await data.json() ?? {};
  }

  async getUserEstates(): Promise<Estate[] | undefined> {
    const data = await fetch(this.url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    return await data.json() ?? {};
  }

  async postNewEstate(newEstate: Estate): Promise<Estate | undefined> {
    const data = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(newEstate)
    });
    return await data.json() ?? {};
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`);
  }

}