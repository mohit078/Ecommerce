import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DbOperation } from 'src/app/shared/db-operation';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import {
  NoWhiteSpcaeValidator,
  TextFieldValidator,
} from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss'],
})
export class SizeComponent implements OnInit {
  addForm: FormGroup;
  buttonText: string;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  @ViewChild('tabset') elname: any;

  formErrors = {
    name: ''
  };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Min Length Should be three Characters',
      maxlength: 'Max Length Should be ten Characters',
      validTextField: 'Name should contains only numbers and Letters',
      noWhiteSpcaeValidator: 'only white space is not allowed',
    }
  };

  constructor(
    private _fb: FormBuilder,
    private _dataService: DataService,
    private _toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  setFormState() {
    this.dbops = DbOperation.create;
    this.buttonText = 'Submit';

    this.addForm = this._fb.group({
      id: [0],
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          TextFieldValidator.validTextField,
          NoWhiteSpcaeValidator.noWhiteSpcaeValidator,
        ]),
      ],
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });
  }

  get f() {
    return this.addForm.controls;
  }

  onValueChanged() {
    if (!this.addForm) {
      return;
    }

    for(const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";
      const control = this.addForm.get(field);

      if (control && control.dirty && !control.valid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] += message[key] + ' ';
          }
        }
      }
    }
  }
 
 onSubmit(){
   switch(this.dbops){
     case DbOperation.create:
       this._dataService.post(Global.BASE_API_PATH + 'SizeMaster/Save/', this.addForm.value).subscribe((res) => {
         if(res.isSuccess){
           this.getData();
           this._toasterService.success("Record Added Succesfully", "Size MAster");
           this.elname.select("viewtab");
           this.setForm();
         }else{
           this._toasterService.error(res.errors[0], "Size Master");
         }
       });
       break;
       case DbOperation.update :
        this._dataService.post(Global.BASE_API_PATH + 'SizeMaster/Update/', this.addForm.value).subscribe((res) => {
          if(res.isSuccess){
            debugger;
            this.getData();
            this._toasterService.success("Record Updated Succesfully", "Size MAster");
            this.elname.select("viewtab");
            this.setForm();
          }else{
            this._toasterService.error(res.errors[0], "Size Master");
          }
        });
    }
  }
  
  setForm(){
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
  }
//get data
getData(){
  this._dataService.get(Global.BASE_API_PATH + 'SizeMaster/GetAll').subscribe((res) => {
    if(res.isSuccess){
      this.objRows = res.data;
    }else{
      this._toasterService.error(res.errors[0], "Size Master")
    }
  })
}

edit(id: number){
  this.dbops = DbOperation.update;
  this.buttonText = "Update";
  this.elname.select("addtab");
  this.objRow = this.objRows.find(x => x.id === id);
  this.addForm.controls["Id"].setValue(this.objRow.id);
  this.addForm.controls["name"].setValue(this.objRow.name);
}

delete(id: number){
  let obj= {
    id: id
  }
  this._dataService.post(Global.BASE_API_PATH + 'SizeMaster/Delete/', obj).subscribe(res => {
    if(res.isSuccess){
      this.getData();
      this._toasterService.success("Size Deleted Succesfully", "Size Master");
    }else{
      this._toasterService.error(res.errors[0], "Size Master");
    }
  })
}

onTabChange(event){
  if(event.activeId == "addtab"){
    this.addForm.reset({
      Id: 0
    });
    this.dbops = DbOperation.create;
    this.buttonText = "Submit"
  }
}

onSort(event: any) {
  console.log(event);
}

setPage(event: any) {
  console.log(event);
}

}
