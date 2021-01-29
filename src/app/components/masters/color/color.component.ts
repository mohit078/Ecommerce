import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DbOperation } from 'src/app/shared/db-operation';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { NoWhiteSpcaeValidator, TextFieldValidator } from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit, OnDestroy {
  addForm:FormGroup;
  buttonText:string;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  @ViewChild('tabset') elname:any;

  formErrors = {
    name: '',
    code: ''
  };

  validationMessage = {
    name: {
      required : 'Name is required',
      minlength : 'Min Length Should be three Characters',
      maxlength: 'Max Length Should be ten Characters',
      validTextField : 'Name should contains only numbers and Letters',
      noWhiteSpcaeValidator : 'only white space is not allowed'
    },
    code: {
      required : 'code is required',
      minlength : 'Min Length Should be three Characters',
      maxlength: 'Max Length Should be ten Characters',
      validTextField : 'Name should contains only numbers and Letters',
      noWhiteSpcaeValidator : 'only white space is not allowed'
    },
  };


  constructor(private _fb: FormBuilder, private _dataService: DataService, private _toasterService: ToastrService) { }

  setFormState(){
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";

    this.addForm = this._fb.group({
      Id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
      
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpcaeValidator.noWhiteSpcaeValidator
      ])],
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });  
  } 
  
  get f(){
    return this.addForm.controls;
  }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }
  
  onValueChanged(){
    if(!this.addForm){
      return;
    }
    
    for(const field of Object.keys(this.formErrors)){
      this.formErrors[field] = "";
      const control = this.addForm.get(field);
    
      if(control && control.dirty && !control.valid){
        const message = this.validationMessage[field];

        for(const key of Object.keys(control.errors)){
          if (key !== 'required') {
            this.formErrors[field] += message[key] + ' '; 
          }
        }
      }
    }
  }

  //get data
  getData(){
    this._dataService.get(Global.BASE_API_PATH + 'ColorMaster/GetAll').subscribe((res) => {
      // console.log(res);
      
      if(res.isSuccess){
        this.objRows = res.data;
      }else{
        this._toasterService.error(res.errors[0], 'Color Master');
      }
    })
  }

  onSubmit(){
    switch(this.dbops) {
      case DbOperation.create:
        this._dataService.post(Global.BASE_API_PATH + "ColorMaster/Save/", this.addForm.value).subscribe((res) => {
          if(res.isSuccess){
            this.getData(); //get data after Saving data in data base and fetch data from API
            this._toasterService.success("Data Created Succesfully" , "Color Master");
            this.elname.select('viewtab'); //Switch tab after creating color code Form value in data base
            this.setForm(); //set form that next time again go for insert Operation
          }else{
            this._toasterService.error(res.errors[0], "Color Master")
          }
        });
        break;
        case DbOperation.update:
        this._dataService.post(Global.BASE_API_PATH + "ColorMaster/Update/", this.addForm.value).subscribe((res) => {
          if(res.isSuccess){
            this.getData(); //get data after Saving data in data base and fetch data from API
            this._toasterService.success("Data updated Succesfully" , "Color Master");
            this.elname.select('viewtab'); //Switch tab after creating color code Form value in data base
            this.setForm(); //set form that next time again go for insert Operation
          }else{
            this._toasterService.error(res.errors[0], "Color Master")
          }
        });
    }

  }

  setForm(){  
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
  }

  edit(id:number){
    this.dbops = DbOperation.update;
    this.buttonText = "Updated";
    this.elname.select("addtab");
    this.objRow = this.objRows.find(x => x.id === id);
    this.addForm.controls['Id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
    this.addForm.controls['code'].setValue(this.objRow.code);
 }

  delete(Id:number){
    let obj = {
      id: Id
    };

    this._dataService.post(Global.BASE_API_PATH + "ColorMaster/Delete/", obj).subscribe((res) => {
      if(res.isSuccess){
        this.getData();
        this._toasterService.success("Data Deleted Sucessfully", "Color Master");
      }else{
        this._toasterService.error(res.errors[0], "Color Master");
      }    
    });
  }

  cancelForm(){
    this.addForm.reset({
      Id: 0
    });
    
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.elname.select("viewtab");
  }

  onTabChange(event){
    // debugger;
    if(event.activeId == "addtab"){
      this.addForm.reset({
          Id: 0
        });
        this.dbops = DbOperation.create;
        this.buttonText = "Submit";
    }
  }

  onSort(event: any) {
    console.log(event);
  }

  setPage(event: any) {
    console.log(event);
  }

  ngOnDestroy(){
    this.objRow = null;
    this.objRows = null;
  }




}
