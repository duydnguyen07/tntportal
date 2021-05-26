import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormConfig, FormState, Controls } from '@app/@shared/application-form/application-form.model';
import { map } from 'rxjs/operators';

interface CreatePayload extends Omit<FormConfig, "id" | "published_at" | "created_at" | "updated_at"> {
  CertificatePasscode: string;
}

interface UpdatePayload extends Omit<FormConfig, "id" | "published_at" | "created_at" | "updated_at"> {
}

export type ErrorCode = 'ID_INVALID' | 'PASSCODE_INVALID'

export interface ErrorResponse {
  ERROR_CODE: ErrorCode
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClient: HttpClient) { }

  create(controls: Controls, passcode: string): Observable<Object> {
    const data: CreatePayload = {
      ...this.transformToDTO(controls),
      CertificatePasscode: passcode
    }

    return this.httpClient.post<FormConfig>('/workorders', data, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    })
  }

  updateForm(controls: Controls, applicationId: number) {
    const data: UpdatePayload = this.transformToDTO(controls)

    return this.httpClient.put<Omit<FormConfig, "published_at" | "created_at" | "updated_at">>(
      `/workorders/${applicationId}`, 
      data, 
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).pipe(map((dto) => this.transformToFormControls(dto)))
  }

  getAll(): Observable<FormConfig[]> {
    return this.httpClient.get<FormConfig[]>(`/workorders`)
  }

  getAllNew(): Observable<FormConfig[]> {
    return this.httpClient.get<FormConfig[]>(`/workorders?State=New`) 
  }

  get(id: string): Observable<Controls> {
    return this.httpClient.get<FormConfig>(`/workorders/${id}`).pipe(
      map((dto) => this.transformToFormControls(dto))
    )
  }

  getWithPasscode(id: string, passcode: string): Observable<Controls> {
    return this.httpClient.post<FormConfig>(
              `/workorders/passcode/${id}`,
              { passcode },
              { headers: new HttpHeaders({'Content-Type': 'application/json'}) }
            ).pipe(
              map((dto) => this.transformToFormControls(dto))
            )
  }

  private transformToDTO(controls: Controls): Omit<FormConfig, "id" | "published_at" | "created_at" | "updated_at"> {

    return {
      State: controls.formState,
      PriceUSD: controls.price,
      AcknowledgementInitials: controls.initials,
      AcknowledgementText: controls.acknowledgementText,
      CustomerInformation: {
        FirstName: controls.firstName,
        LastName: controls.lastName,
        Date: controls.date,
        Address: controls.address,
        City: controls.city,
        State: controls.state,
        Zipcode: controls.zipcode,
        Phone: controls.phone,
        Email: controls.email,
        PreferredContactMethod: controls.preferredContact,
      },
      VehicleInformation: {
        Year: controls.year,
        Make: controls.make,
        Model: controls.model,
        License: controls.license,
        Mileage: controls.mileage,
        VIN: controls.vin
      },
      Certificate: controls.certificate
    }
    
  }

  private transformToFormControls(dto: Partial<FormConfig>): Controls {
    return {
      id: dto.id,
      formState: dto.State,
      firstName: dto.CustomerInformation?.FirstName,
      lastName: dto.CustomerInformation?.LastName,
      address: dto.CustomerInformation?.Address,
      city: dto.CustomerInformation?.City,
      state: dto.CustomerInformation?.State,
      zipcode: dto.CustomerInformation?.Zipcode,
      phone: dto.CustomerInformation?.Phone,
      email: dto.CustomerInformation?.Email,
      date: dto.CustomerInformation?.Date,
      year: dto.VehicleInformation?.Year,
      make: dto.VehicleInformation?.Make,
      model: dto.VehicleInformation?.Model,
      license: dto.VehicleInformation?.License,
      mileage: dto.VehicleInformation?.Mileage,
      vin: dto.VehicleInformation?.VIN,
      price: dto.PriceUSD,
      acknowledgementText: dto.AcknowledgementText,
      initials: dto.AcknowledgementInitials,
      preferredContact: dto.CustomerInformation.PreferredContactMethod,
      certificate: dto.Certificate
    }
    

  }

}
