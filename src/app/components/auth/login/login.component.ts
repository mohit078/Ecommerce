import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { MustMatchValidator } from 'src/app/validations/validations.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerationForm: FormGroup;
  submitted: boolean =false;
  strMsg: string ="";
  @ViewChild('tabset') elname: any;
  
  constructor(private _authService: AuthService, private _dataService: DataService, private _fb: FormBuilder, private _toaster: ToastrService ) { 
    this.strMsg ="";
    this._authService.logOut();
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegisterForm();
  }

  createLoginForm(){
   this.loginForm = this._fb.group({
    userName : ['', Validators.required],
    password : ['', Validators.required]
   }); 
  }

  createRegisterForm(){
    this.registerationForm = this._fb.group({
      Id : [0],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])], // Not an right pattern
      userTypeId: [1],
      password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{3,}")]],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: MustMatchValidator('password', 'confirmPassword')
    })
   }

    // convenience getter for easy access to form fields
   get f(){
     return this.registerationForm.controls;
   }

   onLoginSubmit(){
     if(this.loginForm.get('userName').value == ""){
        this._toaster.error("Please enter username", "login");
      }else if(this.loginForm.get('password').value == "") {
        this._toaster.error("Please enter Password", "login");
     }
     else{
       if(this.loginForm.valid){
         this._dataService.post(Global.BASE_API_PATH + "UserMaster/Login", this.loginForm.value).subscribe(res => {
           if(res.isSuccess){
             this._authService.login(res.data);
             this.strMsg = this._authService.getMessage();
             if(this.strMsg != ""){
               this._toaster.error(this.strMsg, "login");
               this.reset();
             }
           }else{
             this._toaster.error("Invalid User name and password", "login");
           }
         })
       }
       else{
            this._toaster.error("Invalid User name and password", "login"); 
       }
     }

   }

   onRegisteration(formData: any){ 
    // debugger;
      this.submitted = true;
      if(this.registerationForm.invalid){
        return;
      }

      this._dataService.post(Global.BASE_API_PATH + "UserMaster/Save", formData.value).subscribe(res => {
        // debugger;
        if(res.isSuccess){
          this._toaster.success("Account has been created sucessfully","User data");
          this.registerationForm.reset();
          this.submitted = false;
          this.elname.select('loginTab');
        }else{
          this._toaster.error(res.errors[0], "User Master");
        }
      })
   }

   reset(){
    this.loginForm.reset();
   }
}
