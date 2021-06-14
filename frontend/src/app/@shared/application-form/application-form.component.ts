import { FormState } from '@app/@shared/application-form/application-form.model';
import { UntilDestroy, untilDestroyed } from '@core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Controls, keyOfControls, ContactMethod, Upload } from './application-form.model';

function emailExistIfIsPreferredContactMethodValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const preferredContact = control.get(keyOfControls('preferredContact')).value as ContactMethod;
    const email = control.get(keyOfControls('email')).value;

    //TODO: get this to validate correctly
    return (preferredContact === "Email" && !email) ? {invalidEmailAsPreferredContectMethod: {value: email}} : null;
  };
}

@UntilDestroy()
@Component({ 
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationFormComponent implements OnInit, AfterViewInit {
  acknowledgementTextStr = "I hereby authorize TNT Smog to perform a smog inspection/test. TNT Smog is authorized to operate the vehicle for inspection, testing, pick up & delivery at the vehicle owner's risk. TNT Smog will NOT be responsible for loss or damage to vehicle, or articles left in vehicle in case of fire, theft, accident or many other cause beyond our control. I understand TNT Smog does not do any repairs or adjustments and cannot diagnose or refer me to any special shop for repair. I also understand that I WILL HAVE TO PAY THE INSPECTION FEE WHETHER THE INSPECTION PASS OR NOT. The costs of performing inspections services has been explained to my satisfaction. If you agree, please enter your Initials, e.g. JD for John Doe."

  private controls: {[K in keyof Controls]: any} = {
    id: [''],
    formState: [''],
    firstName: [''],
    lastName: [''],
    address: [''],
    city: [''],
    state: [''],
    zipcode: [''],
    phone: [''],
    email: [''],
    date: [''],
    year: [''],
    make: [''],
    model: [''],
    license: [''],
    mileage: [''],
    vin: [''],
    price: [''],
    initials: [''],
    preferredContact: ['TextMessage'],
    acknowledgementText: [this.acknowledgementTextStr],
    certificate: [null]
  }
  
  formGroup: FormGroup = this.fb.group(this.controls, {validators: [emailExistIfIsPreferredContactMethodValidator]});
  isReadonly: boolean = false;
  workorderId: number;
  certificateFormControl: AbstractControl = this.formGroup.get(keyOfControls('certificate'));

  @Input()
  passcode: string;

  @Input()
  set certificate(val: Upload) {
    this.certificateFormControl.setValue(val);
  } 
  
  @Input()
  set formState(val: FormState) {
    this.formGroup.get(keyOfControls('formState')).setValue(val);
  }

  @Input()
  disabledSubmit: boolean = false;

  @Input()
  set id(val: number) {
    this.workorderId = val;
    this.formGroup.get(keyOfControls('id')).setValue(val);
  }

  @Input()
  set firstName(val: string) {
    this.formGroup.get(keyOfControls('firstName')).setValue(val);
  }

  @Input()
  set lastName(val: string) {
    this.formGroup.get(keyOfControls('lastName')).setValue(val);
  }

  @Input()
  set address(val: string) {
    this.formGroup.get(keyOfControls('address')).setValue(val);
  }

  @Input()
  set city(val: string) {
    this.formGroup.get(keyOfControls('city')).setValue(val);
  }

  @Input()
  set state(val: string) {
    this.formGroup.get(keyOfControls('state')).setValue(val);
  }

  @Input()
  set zipcode(val: string) {
    this.formGroup.get(keyOfControls('zipcode')).setValue(val);
  }

  @Input()
  set phone(val: string) {
    this.formGroup.get(keyOfControls('phone')).setValue(val);
  }

  @Input()
  set email(val: string) {
    this.formGroup.get(keyOfControls('email')).setValue(val);
  }

  @Input()
  set date(val: Date) {
    this.formGroup.get(keyOfControls('date')).setValue(val);
  }

  @Input()
  disableDate: boolean

  @Input()
  set year(val: string) {
    this.formGroup.get(keyOfControls('year')).setValue(val);
  }

  @Input()
  set make(val: string) {
    this.formGroup.get(keyOfControls('make')).setValue(val);
  }

  @Input()
  set model(val: string) {
    this.formGroup.get(keyOfControls('model')).setValue(val);
  }

  @Input()
  set license(val: string) {
    this.formGroup.get(keyOfControls('license')).setValue(val);
  }

  @Input()
  set mileage(val: string) {
    this.formGroup.get(keyOfControls('mileage')).setValue(val);
  }

  @Input()
  set vin(val: string) {
    this.formGroup.get(keyOfControls('vin')).setValue(val);
  }

  @Input()
  set price(val: string) {
    this.formGroup.get(keyOfControls('price')).setValue(val);
  }

  @Input()
  set acknowledgementText(val: string) {
    this.acknowledgementTextStr = (val) ? val : this.acknowledgementTextStr;
    this.formGroup.get(keyOfControls('acknowledgementText')).setValue(this.acknowledgementTextStr);
  }

  @Input()
  set initials(val: string) {
    this.formGroup.get(keyOfControls('initials')).setValue(val);
  }

  @Input()
  isNewForm: boolean;

  @Input()
  set readonly(val: boolean) {
    if(!!val) {
      for( const control of Object.values(this.formGroup.controls) ) {
        control.disable();
      }
    }

    this.isReadonly = val;
  }

  @Input()
  requireVehicleInfo: boolean;

  @Output()
  formSubmit: EventEmitter<Controls> = new EventEmitter(null);

  @Output()
  formChanges: EventEmitter<Controls> = new EventEmitter(null);

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((val) => {
      this.formChanges.next(val);
    })
  }

  submitForm() {
    if(this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value)
    }
  }

  updateUploadedFile(newFile: Upload[]) {
    this.certificateFormControl.setValue(newFile)
  }

  ngAfterViewInit(): void {
    this.formChanges.next(this.formGroup.value)
  }
}
