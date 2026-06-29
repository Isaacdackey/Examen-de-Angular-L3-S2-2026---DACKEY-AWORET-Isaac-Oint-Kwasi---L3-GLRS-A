import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closeOnOutsideClick = true;
  @Input() showCloseButton = true;
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';
  @Input() showFooter = true;
  @Input() loading = false;
  @Input() disableConfirm = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isOpen) {
      this.onClose();
    }
  }
  
  onClose() {
    this.close.emit();
  }
  
  onConfirm() {
    this.confirm.emit();
  }
  
  onCancel() {
    this.cancel.emit();
  }
  
  onOverlayClick() {
    if (this.closeOnOutsideClick) {
      this.onClose();
    }
  }
  
  getModalSize(): string {
    const sizes = {
      sm: 'modal-sm',
      md: 'modal-md',
      lg: 'modal-lg',
      xl: 'modal-xl'
    };
    return sizes[this.size] || 'modal-md';
  }
}