import { Directive, ElementRef, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();
  
  private isListening = false;
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit(): void {
    this.startListening();
  }
  
  ngOnDestroy(): void {
    this.stopListening();
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isListening) {
      return;
    }
    
    const target = event.target as HTMLElement;
    const element = this.elementRef.nativeElement;
    
    if (!element.contains(target)) {
      this.clickOutside.emit();
    }
  }
  
  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    if (!this.isListening) {
      return;
    }
    
    const target = event.target as HTMLElement;
    const element = this.elementRef.nativeElement;
    
    if (!element.contains(target)) {
      this.clickOutside.emit();
    }
  }
  
  startListening(): void {
    this.isListening = true;
  }
  
  stopListening(): void {
    this.isListening = false;
  }
}