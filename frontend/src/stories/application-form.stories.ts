import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApplicationFormComponent } from './../app/@shared/application-form/application-form.component';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatNativeDateModule } from '@angular/material/core';

export default {
    title: '@shared/ApplicationForm',
    component: ApplicationFormComponent,
    argTypes: {
        firstName: {
            defaultValue: 'firstName',
            control: 'text'
        },
        lastName: {
            defaultValue: 'lastName',
            control: 'text'
        },
        address: {
            defaultValue: 'address',
            control: 'text'
        },
        city: {
            defaultValue: 'city',
            control: 'text'
        },
        state: {
            defaultValue: 'state',
            control: 'text'
        },
        zipcode: {
            defaultValue: 'zipcode',
            control: 'text'
        },
        phone: {
            defaultValue: 'phone',
            control: 'text'
        },
        email: {
            defaultValue: 'email',
            control: 'text'
        },
        date: {
            defaultValue: new Date(),
            control: 'date'
        },
        year: {
            defaultValue: 'year',
            control: 'text'
        },
        make: {
            defaultValue: 'make',
            control: 'text'
        },
        model: {
            defaultValue: 'model',
            control: 'text'
        },
        license: {
            defaultValue: 'license',
            control: 'text'
        },
        mileage: {
            defaultValue: 'mileage',
            control: 'text'
        },
        vin: {
            defaultValue: 'vin',
            control: 'text'
        },
        price: {
            defaultValue: 'price',
            control: 'text'
        },
        initials: {
            defaultValue: 'initials',
            control: 'text'
        },
    },
    decorators: [
        moduleMetadata({
            imports: [
                MatFormFieldModule, 
                MatInputModule, 
                MatIconModule,
                BrowserAnimationsModule,
                MatDatepickerModule,
                MatNativeDateModule,
                FormsModule,
                ReactiveFormsModule,
                MatRadioModule
            ],
            declarations: [],
            providers: [],
        }),
    ],
  } as Meta;

const Template: Story<ApplicationFormComponent> = (args: ApplicationFormComponent) => ({
    props: args,
});

export const Default = Template.bind({});
