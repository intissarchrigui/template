import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent} from './front/register/register.component';
import {LoginComponent} from './front/login/login.component';
import {HomeComponent} from './shared/home/home.component';
import {ContainerComponent} from './shared/home/container/container.component';
const routes: Routes = [{
  path: '',
  component: HomeComponent
  ,
  children: [{path: '', component: ContainerComponent}]

  },
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
