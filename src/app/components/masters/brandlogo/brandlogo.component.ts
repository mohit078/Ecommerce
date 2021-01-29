import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DbOperation } from 'src/app/shared/db-operation';
import { Global } from 'src/app/shared/global';
import { DataService } from 'src/app/shared/services/data.service';
import { NoWhiteSpcaeValidator, TextFieldValidator } from 'src/app/validations/validations.validator';


@Component({
  selector: 'app-brandlogo',
  templateUrl: './brandlogo.component.html',
  styleUrls: ['./brandlogo.component.scss']
})
export class BrandlogoComponent implements OnInit, OnDestroy {
  addForm:FormGroup;
  buttonText:string;
  dbops: DbOperation;
  objRows = [];
  objRow: any;
  fileToUpload : File;
  editImagePath = "assets/images/product-list/1.jpg";
  
  @ViewChild('tabset') elname:any;
  @ViewChild('file') elfile: ElementRef;


  formErrors = {
    name: ''
  };

  validationMessage = {
    name: {
      required : 'Name is required',
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
    this._dataService.get(Global.BASE_API_PATH + 'BrandLogo/GetAll').subscribe((res) => {
      // console.log(res);
      
    debugger;
      if(res.isSuccess){
        this.objRows = res.data;
      }else{
        this._toasterService.error(res.errors[0], 'Brand Logo Master');
      }
    })
  }

  upload(files: any){
    if(files.Length === 0){
      return;
    }

    let fileType = files[0].type;
    if(fileType.match(/image\/*/) == null){
      this._toasterService.error("Only Files are supported", "Brand Logo");
      return;
    }

    this.fileToUpload = files[0];
  }

  onSubmit(){
    if(this.dbops === DbOperation.create && !this.fileToUpload){
      this._toasterService.error("Please Upload Image");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.addForm.controls["Id"].value);
    formData.append("Name", this.addForm.controls["name"].value);

    if(this.fileToUpload){
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }

    switch(this.dbops) {
      case DbOperation.create:
        this._dataService.post(Global.BASE_API_PATH + "BrandLogo/Save/", formData).subscribe((res) => {
          if(res.isSuccess){
            this.getData(); //get data after Saving data in data base and fetch data from API
            this._toasterService.success("Data Created Succesfully" , "Brand Logo Master");
            this.elname.select('viewtab'); //Switch tab after creating Brand Logo code Form value in data base
            this.setForm(); //set form that next time again go for insert Operation
          }else{
            this._toasterService.error(res.errors[0], "Brand Logo Master")
          }
        });
        break;
        case DbOperation.update:
        this._dataService.post(Global.BASE_API_PATH + "BrandLogo/Update/", formData).subscribe((res) => {
          if(res.isSuccess){
            this.getData(); //get data after Saving data in data base and fetch data from API
            this._toasterService.success("Data updated Succesfully" , "Brand Logo Master");
            this.elname.select('viewtab'); //Switch tab after creating Brand Logo code Form value in data base
            this.setForm(); //set form that next time again go for insert Operation
          }else{
            this._toasterService.error(res.errors[0], "Brand Logo Master")
          }
        });
    }

  }

  setForm(){  
    this.dbops = DbOperation.create;
    this.buttonText = "Submit";
    this.fileToUpload = null;
    this.editImagePath = "assets/images/product-list/1.jpg";
  }

  edit(id:number){
    this.dbops = DbOperation.update;
    this.buttonText = "Updated";
    this.elname.select("addtab");
    this.objRow = this.objRows.find(x => x.id === id);
    this.addForm.controls['Id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
    this.editImagePath = this.objRow.imagePath;
 }

  delete(Id:number){
    let obj = {
      id: Id
    };

    this._dataService.post(Global.BASE_API_PATH + "BrandLogo/Delete/", obj).subscribe((res) => {
      if(res.isSuccess){
        this.getData();
        this._toasterService.success("Data Deleted Sucessfully", "Brand Logo Master");
      }else{
        this._toasterService.error(res.errors[0], "Brand Logo Master");
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
    this.fileToUpload = null;
    this.editImagePath = "assets/images/product-list/1.jpg";
  }

  onTabChange(event){
    // debugger;
    if(event.activeId == "addtab"){
      this.addForm.reset({
          Id: 0
        });
        this.dbops = DbOperation.create;
        this.buttonText = "Submit";
        this.fileToUpload = null;
        this.editImagePath = "assets/images/product-list/1.jpg";
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
    this.fileToUpload = null;
  }


}
