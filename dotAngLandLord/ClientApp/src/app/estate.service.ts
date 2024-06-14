import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Estate } from './estate';

import { Observable, catchError, map, throwError } from 'rxjs';
import { Facility } from './facility';

@Injectable({
  providedIn: 'root'
})
export class EstateService 
{
  selectedEstate!: Estate;
  url = 'http://localhost:5283/estate';

  constructor(private http: HttpClient) { }

  // readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';
  
  
  private mapToFacility = (ef: any): Facility => {
    return {
      id: ef.facility.id,
      name: ef.facility.name,
      isPresent: ef.isPresent,
      isBasic: ef.facility.isBasic
    };
  }

  mapToEstate = (data: any): Estate => {
    // console.log("is facilities an array?: "+ Array.isArray(data.estateFacilities));
    // data.estateFacilities.forEach((ef: any) => console.log(ef.facility));
    // console.log("break");
    // console.log(data);
    // console.log(data.images);
    return {
      id: data.id,
      userId: data.userId,
      name: data.name,
      city: data.city,
      region: data.region,
      country: data.country,
      streetName: data.streetName, 
      streetNumber: data.streetNumber,
      flatNumber: data.flatNumber,
      createdOn: new Date(data.createdOn),
      facilities: Array.isArray(data.estateFacilities) ? data.estateFacilities?.map(this.mapToFacility) : [],
      images: data.images,
      
      };
  }

  deleteEstate(id: number): Observable<number> {
    const httpOptions = {
      withCredentials: true, // Include credentials
    };
    return this.http.delete<void>(`${this.url}/delete/id?id=${id}`, httpOptions).pipe(map(() => id));
  }
  
  getAllEstates(): Observable<Estate[]> {
    return this.http.get<Estate[]>(this.url);
    // const data = await fetch(this.url);
    // return await data.json() ?? [];
  }
  
  FetchBasicFacilities(): Observable<Facility[]> {
    const httpOptions = {
      withCredentials: true, // Include credentials
    };
    return this.http.get<Facility[]>(`${this.url}/facilitiestype?facilitiestype=basic`, httpOptions);
  }

  async getEstateById(id: number): Promise<Estate | undefined> {
    const data = await fetch(`${this.url}/id?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    // const data = await fetch(`${this.url}/id?id=${id}`);
    return await data.json() ?? {};
  }

  updateEstate(estate: Estate): Observable<Estate> {

    const formData = this.mapEstateToFormData(estate);
    const httpOptions = {
      withCredentials: true,
    };
    return this.http.put<HttpResponse<any>>(`${this.url}/update`, formData, httpOptions).pipe(
      map((response) => {
        // console.log("response status: "  +response.statusText+"  "+ response.ok);
        if (response) {
          console.log('Estate updated successfully, with response ok returned');
          // return response.body as Estate;
          return estate;
        } else {
          throw new Error('Failed to update estate');
        }
      }),
      catchError((error: any) => {
        console.error('Failed to update existing estate', error);
        return throwError(error);
      })
    );

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

    return await data.json() ?? [];
  }

  private mapEstateToFormData(newEstate: Estate): FormData {
    let formData = new FormData();
  
    // Add Estate fields to formData
    formData.append('id', newEstate.id?.toString());
    formData.append('name', newEstate.name);
    formData.append('city', newEstate.city);
    formData.append('region', newEstate.region);
    formData.append('country', newEstate.country);
    formData.append('streetName', newEstate.streetName);
    formData.append('streetNumber', newEstate.streetNumber);
    formData.append('flatNumber', newEstate.flatNumber ?? '');
    formData.append('createdOn', newEstate.createdOn?.toISOString() ?? '');
    console.log("postNewEstate gets an estate with this many images: ");
    console.log(newEstate.images.length);
    // Add images to formData
    newEstate.images?.forEach((image, index) => {
      if (image.id !== undefined) {
        formData.append(`images[${index}].id`, String(image.id));
      }
      if (image.estateId !== undefined) {
        formData.append(`images[${index}].estateId`, String(image.estateId));
      }
      formData.append(`images[${index}].fileName`, image.fileName);
      formData.append(`images[${index}].isMain`, String(image.isMain));
      if (image.data) {
        formData.append(`images[${index}].data`, new Blob([image.data], { type: 'application/octet-stream' }), image.fileName);
      }

    });

    // Add facilities to formData
    newEstate.facilities?.forEach((facility, index) => {
      console.log(`Appending facility: ${JSON.stringify(facility)}`);

      if (facility.id !== undefined) {
        formData.append(`facilities[${index}].id`, String(facility.id));
      }
      if (facility.name !== undefined) {
        formData.append(`facilities[${index}].name`, String(facility.name));
      }
      formData.append(`facilities[${index}].isPresent`, facility.isPresent ? 'true' : 'false');
      formData.append(`facilities[${index}].isBasic`, facility.isBasic ? 'true' : 'false');
    });

    return formData;
  }

  async postNewEstate(newEstate: Estate): Promise<Estate | undefined> {
    const formData = this.mapEstateToFormData(newEstate);

    const response = await fetch(this.url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
  
    if (response.ok) {
      console.log('Estate persisted successfully, with response ok returned'); 
      return await response.json();
    } else {
      console.error('Failed to persist new estate');
      return undefined;
    }
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`);
  }

}