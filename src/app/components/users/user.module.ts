import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListUserComponent } from './list-user/list-user.component';


@NgModule({
  declarations: [CreateUserComponent, ListUserComponent],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
