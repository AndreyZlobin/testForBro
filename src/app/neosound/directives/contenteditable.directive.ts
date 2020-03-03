import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  HostBinding,
  forwardRef,
  Input
} from "@angular/core";

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[contenteditable]",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableDirective),
      multi: true
    }
  ]
})
export class ContenteditableDirective implements ControlValueAccessor {
  @Input() propValueAccessor = "textContent";
  @HostBinding("attr.contenteditable") @Input() contenteditable = true;

  private onChange: (value: string) => void;
  private onTouched: () => void;
  private removeDisabledState: () => void;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener("input")
  callOnChange() {
    if (typeof this.onChange == "function") {
      this.onChange(this.elementRef.nativeElement[this.propValueAccessor]);
    }
  }

  @HostListener("blur")
  callOnTouched() {
    if (typeof this.onTouched == "function") {
      this.onTouched();
    }
  }

  writeValue(value: any): void {
    const normalizedValue = value == null ? "" : value;
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      this.propValueAccessor,
      normalizedValue
    );
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        "disabled",
        "true"
      );
      this.removeDisabledState = this.renderer.listen(
        this.elementRef.nativeElement,
        "keydown",
        this.listenerDisabledState
      );
    } else {
      if (this.removeDisabledState) {
        this.renderer.removeAttribute(
          this.elementRef.nativeElement,
          "disabled"
        );
        this.removeDisabledState();
      }
    }
  }

  private listenerDisabledState(e: KeyboardEvent) {
    e.preventDefault();
  }
}
