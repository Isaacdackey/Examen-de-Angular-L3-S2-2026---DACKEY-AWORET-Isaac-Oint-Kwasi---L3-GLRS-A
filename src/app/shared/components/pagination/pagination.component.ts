import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  @Input() showPageSize = true;
  @Input() showTotalItems = true;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  
  readonly pageNumbers = computed(() => {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    
    if (total <= 7) {
      for (let i = 0; i < total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);
      
      if (current > 2) {
        pages.push('...');
      }
      
      const start = Math.max(1, current - 1);
      const end = Math.min(total - 2, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < total - 3) {
        pages.push('...');
      }
      
      pages.push(total - 1);
    }
    
    return pages;
  });
  
  displayPage(page: number | string): number | string {
    return typeof page === 'number' ? page + 1 : page;
  }

  onPageChange(page: number | string) {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
  
  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const size = parseInt(select.value, 10);
    this.pageSizeChange.emit(size);
  }
  
  getStartItem(): number {
    return this.totalItems === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }
  
  getEndItem(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalItems);
  }
}