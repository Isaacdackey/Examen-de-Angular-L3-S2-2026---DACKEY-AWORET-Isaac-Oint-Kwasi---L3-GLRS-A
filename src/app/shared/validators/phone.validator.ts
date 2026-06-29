import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }
    
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

export function phoneRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return { phoneRequired: true };
    }
    
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