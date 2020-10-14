import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddListPage } from './add-list.page';

const routes: Routes = [
  {
    path: '',
    component: AddListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
