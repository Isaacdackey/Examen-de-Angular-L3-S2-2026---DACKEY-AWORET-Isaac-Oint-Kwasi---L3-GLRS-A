import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 12 && cleaned.startsWith('221')) {
      return `+221 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
    }
    
    if (cleaned.length === 9 && cleaned.startsWith('77')) {
      return `+221 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
    }
    
    return value;
  }
}