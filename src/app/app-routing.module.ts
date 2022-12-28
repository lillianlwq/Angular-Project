import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportAddFormComponent } from './report-add-form/report-add-form.component';
import { ShowMoreInfoComponent } from './show-more-info/show-more-info.component';

const routes: Routes = [
  {path: '', component: ReportAddFormComponent},
  {path: 'showmore/:uniqueID', component:ShowMoreInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
