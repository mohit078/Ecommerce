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
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
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


  onValueChanged(){
    for(const field of Object.keys(this.formErrors)){
      this.formErrors[field] = "";
      const control = this.addForm.get(field);

      if(control && control.dirty && !control.valid)
      {
        const message = this.validationMessage[field];

        for(const key of Object.keys(control.errors)){
          if(key !== 'required'){
            this.formErrors[field] += message[key] + ' '; 
          }
        }
      }
    }
  }

  onSubmit(){
    switch(this.dbops){
      case DbOperation.create:
        this._dataService.post(Global.BASE_API_PATH + 'TagMaster/Save/', this.addForm.value).subscribe(res => {
          if(res.isSuccess){
            this.getData();
            this._toasterService.success("Tag Added Succesfullt", "Tag Master");
            this.elname.select("addtab");
            this.setForm();
          }else{
            this._toasterService.error(res.errors[0], "Tag Master");
          }
        });
        break;
        case DbOperation.update:
          this._dataService.post(Global.BASE_API_PATH + 'TagMaster/Update/', this.addForm.value).subscribe(res => {
            if(res.isSuccess){
              this.getData();
              this.elname.select("viewtab");
              this.setForm();
            }else{
              this._toasterService.error(res.errors[0], "Tag Master");
            }
          })
    }
  }

  setForm(){
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
  }

  //get data
getData(){
  this._dataService.get(Global.BASE_API_PATH + 'TagMaster/GetAll').subscribe((res) => {
    if(res.isSuccess){
      this.objRows = res.data;
    }else{
      this._toasterService.error(res.errors[0], "TagMaster")
    }
  })
}

edit(id: number){
  // debugger;
  this.dbops = DbOperation.update;
  this.buttonText = "Update";
  this.elname.select("addtab");
  this.objRow = this.objRows.find(x => x.id === id);
  this.addForm.controls["id"].setValue(this.objRow.id);
  this.addForm.controls["name"].setValue(this.objRow.name);
}

delete(id: number){
  let obj = {
    id: id
  }
  this._dataService.post(Global.BASE_API_PATH + 'TagMaster/Delete/', obj).subscribe(res => {
    if(res.isSuccess){
      this.getData();
      this._toasterService.success("Tag Deleted Succesfully", "Tag Master");
    }else{
      this._toasterService.error(res.errors[0], "Tag Master");
    }
  })
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
