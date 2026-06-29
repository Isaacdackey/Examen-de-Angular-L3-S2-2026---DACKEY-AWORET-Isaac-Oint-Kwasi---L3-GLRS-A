import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function amountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (value === null || value === undefined || value === '') {
      return { amountRequired: true };
    }
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return { invalidAmount: true };
    }
    
    if (numValue <= 0) {
      return { amountPositive: true };
    }
    
    if (numValue > 1000000000) {
      return { amountTooLarge: true };
    }
    
    return null;
  };
}

export function minAmountValidator(min: number = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return null;
    }
    
    if (numValue < min) {
      return { minAmount: { required: min, actual: numValue } };
    }
    
    return null;
  };
}

export function maxAmountValidator(max: number = 10000000): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return null;
    }
    
    if (numValue > max) {
      return { maxAmount: { required: max, actual: numValue } };
    }
    
    return null;
  };
}