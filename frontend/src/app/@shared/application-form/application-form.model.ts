export interface FormConfig {
  id: number;
  State: FormState;
  PriceUSD: number;
  AcknowledgementInitials: string;
  AcknowledgementText: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  CustomerInformation: CustomerInformation;
  VehicleInformation: VehicleInformation;
  Certificate: Upload[];
}

export enum FormState {
  New = 'New',
  InProgress = 'InProgress',
  Canceled = 'Canceled',
  Completed = 'Completed'
}
export type ContactMethod = 'Email' | 'TextMessage';

export interface CustomerInformation {
  FirstName: string;
  LastName: string;
  Date: string;
  Address: string;
  City: string;
  State: string;
  Zipcode: string;
  Phone: string;
  Email: string;
  PreferredContactMethod: ContactMethod;
}

export interface VehicleInformation {
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
  ext: string;
  provider: 'aws-s3';
  created_at: string; //e.g. "2021-04-06T15:22:02.464Z"
  updated_at: string; //"2021-04-06T15:22:02.464Z"
}

export interface Controls {
  id: number;
  formState: FormState;
  firstName: string;
  lastName: string;
  address: string,
  city: string,
  state: string,
  zipcode: string,
  phone: string,
  email: string,
  date: string,
  year: number,
  make: string,
  model: string,
  license: string,
  mileage: string,
  vin: string,
  price: number,
  initials: string,
  preferredContact: ContactMethod,
  acknowledgementText: string,
  certificate: Upload[]
} 

export function keyOfControls<K extends keyof Controls>(key: K): K {
  return key;
}

// export enum ControlName {
//   id="id",
//   firstName="firstName",
//   lastName="lastName",
//   address="address",
//   city="city",
//   state="state",
//   zipcode="zipcode",
//   phone="phone",
//   email="email",
//   date="date",
//   year="year",
//   make="make",
//   model="model",
//   license="license",
//   mileage="mileage",
//   vin="vin",
//   price="price",
//   initials="initials",
//   preferredContact="preferredContact",
//   acknowledgementText="acknowledgementText",
//   certificate="certificate"
// } 