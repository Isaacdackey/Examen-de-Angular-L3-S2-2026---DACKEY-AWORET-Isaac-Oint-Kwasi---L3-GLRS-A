import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('221')) {
      return null;
    }
    if (cleaned.length === 9 && cleaned.startsWith('77')) {
      return null;
    }
    return { invalidPhone: true };
  };
}

export function differentPhoneValidator(senderField: string, receiverField: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const formGroup = form as FormGroup;
    const sender = formGroup.get(senderField)?.value;
    const receiver = formGroup.get(receiverField)?.value;
    if (!sender || !receiver) return null;
    const senderCleaned = sender.replace(/\D/g, '');
    const receiverCleaned = receiver.replace(/\D/g, '');
    if (senderCleaned === receiverCleaned) {
      return { differentPhone: true };
    }
    return null;
  };
}