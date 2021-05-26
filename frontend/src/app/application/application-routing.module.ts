import { EditApplicationComponent } from './edit-application/edit-application.component';
import { ViewApplicationComponent } from './view-application/view-application.component';
import { NewApplicationComponent } from './new-application/new-application.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@app/@shared/can-deactivate/can-deactivate.guard';

const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full',
    redirectTo: 'new'
  },
  { path: 'new', component: NewApplicationComponent, data: { title: 'New Application' }  }, 
  { path: ':id', component: ViewApplicationComponent, data: { title: 'My Application' } }, //TODO: create a guard, only param has secret code can access
  { 
    path: 'edit/:id', 
    component: EditApplicationComponent, 
    data: { title: 'Application' },
    canDeactivate: [CanDeactivateGuard]
  } // TODO: only users with rights can access this
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ApplicationRoutingModule { }
