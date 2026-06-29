import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xof',
  standalone: true
})
export class XofPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '0 XOF';
    }
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return '0 XOF';
    }
    
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(numValue);
  }
}