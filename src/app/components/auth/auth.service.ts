import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any>(null); // user token 
  private loggedIn = new BehaviorSubject<boolean>(false); 
  message: string;

  get currentUser(){
    return this.currentUserSubject.asObservable(); //only for read. It will not modify
  }  
  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) {
    this.message = "";
   }

   login(objectUserDetails: any){
      if(objectUserDetails.id == 0){
        localStorage.removeItem(objectUserDetails);
        this.message = "please enter valid details";
        this.loggedIn.next(false);
      }else{
        this.currentUserSubject.next(objectUserDetails); //For token use only
        this.message = ""; //for error message. if loggedin then there is no need
        localStorage.setItem("userDetails", JSON.stringify(objectUserDetails));
        this.loggedIn.next(true);
        this.router.navigate(['/dashboard/default']);
      }
   }

   logOut(){
     localStorage.clear();
     this.loggedIn.next(false);
     this.router.navigate(['/auth/login']);
   }

   getMessage(): string{
     return this.message;
   }
}
