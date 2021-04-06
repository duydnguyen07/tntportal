export interface FormConfig {
  id: number;
  State: 'New' | 'InProgress' | 'Canceled' | 'Completed';
  PriceUSD: number;
  AcknowledgementInitials: string;
  AcknowledgementText: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  CustomerInformation: CustomerInformation;
  VehicleInformation: VehicleInformation;
  Certificate: [];
}

export interface CustomerInformation {
  id: number;
  FirstName: string;
  LastName: string;
  Date: string;
  Address: string;
  City: string;
  State: string;
  Zipcode: string;
  Phone: string;
  Email: string;
}

export interface VehicleInformation {
  id: number;
  Year: number;
  Make: string;
  Model: string;
  License: string;
  Mileage: string;
  VIN: string;
}

export interface Upload {
  id: number;
  name: string;
  hash: string;
  mime: 'application/pdf';
  size: number;
  url: string;
  provider: 'aws-s3';
  created_at: string; //e.g. "2021-04-06T15:22:02.464Z"
  updated_at: string; //"2021-04-06T15:22:02.464Z"
}
