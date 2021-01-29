import { FormControl, FormGroup } from "@angular/forms";

// Allow Alpha numeric and char only
export class TextFieldValidator{
    static validTextField(fc: FormControl){
        if(fc.value != undefined && fc.value == ""){
            const regex = /^[0-9a-zA-Z ]+$/;
            if(regex.test(fc.value)){
                return null;
            }
            else{
                return  { validTextField:true };
            }
        }else{
            return null;
        }
    }
}

// Allow numeric char only
export class NumericFieldValidator{
    static validNumericField(fc: FormControl){
        if(fc.value != undefined && fc.value == ""){
            const regex = /[0-9]+/;
            if(regex.test(fc.value)){
                return null;
            }
            else{
                return  { validNumericField:true };
            }
        }else{
            return null;
        }
    }
}

// Validatons : Allow char and space only
export class EmailValidator {
    static validEmail(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validEmail: true };
            }
        } else {
            return null;
        }
    }
}

// Validatons : Not Allow Whitespace only
export class NoWhiteSpcaeValidator {
    static noWhiteSpcaeValidator(fc: FormControl) {
        if (fc.value != undefined && fc.value != "" && fc.value != null) {
            const isWhiteSpace = (fc.value.toString()).trim().length === 0;

            if (!isWhiteSpace) {
                return null;
            } else {
                return { noWhiteSpcaeValidator: true };
            }
        } else {
            return null;
        }
    }
}


// Validations : To check two fileds match
export function MustMatchValidator(controlName: string, matchingControlName: string){
    return(formGroup: FormGroup) => {
        const controls = formGroup.controls[controlName];
        const matchingControls = formGroup.controls[matchingControlName];

        if(matchingControls.errors && !matchingControls.errors.mustMatch){
            return;
        }

        if(controls.value !== matchingControls.value){
            return matchingControls.setErrors({ mustMatch: true });
        }else{
            matchingControls.setErrors(null);
        }
    }
}