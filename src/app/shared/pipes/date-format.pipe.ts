import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: string = 'short'): string {
    if (!value) {
      return '';
    }
    
    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('fr-SN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      
      case 'long':
        return date.toLocaleDateString('fr-SN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      
      case 'full':
        return date.toLocaleDateString('fr-SN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      
      case 'time':
        return date.toLocaleTimeString('fr-SN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      
      default:
        return date.toLocaleDateString('fr-SN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    }
  }
}