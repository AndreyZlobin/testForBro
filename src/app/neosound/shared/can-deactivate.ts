import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<any> {
  constructor() {}

  canDeactivate(component: any): boolean {
    if (component && component.hasUnsaved) {
      if (
        confirm(
          `You have unsaved ${component.unsavedLabel}s If you leave, your changes will be lost.`
        )
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
