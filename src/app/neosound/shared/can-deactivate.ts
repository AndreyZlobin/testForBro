import { Injectable } from "@angular/core";
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<any> {
  constructor() {}

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean {
    if(nextState.url === "/auth/login") {
      return true;
    }
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
