import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Location } from "@angular/common";
import { filter } from "rxjs/operators";
import { environment } from "../../../environments/environment";

declare let ga: Function;

@Injectable()
export class AnalyticsService {
  enabled: boolean = true;
  constructor(private location: Location, private router: Router) {
    this.enabled = environment.production;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        ga("send", { hitType: "pageview", page: this.location.path() });
      });
  }
  //   eventCategory	text	yes	Typically the object that was interacted with (e.g. 'Video')
  // eventAction	text	yes	The type of interaction (e.g. 'play')
  // eventLabel	text	no	Useful for categorizing events (e.g. 'Fall Campaign')
  // eventValue	integer	no	A numeric value associated with the event (e.g. 42)
  public trackEvent(
    eventCategory: string,
    eventAction: string,
    eventValue: string = null
  ) {
    if (this.enabled) {
      ga("send", {
        hitType: "event",
        eventCategory,
        eventAction,
        eventValue
      });
    }
  }
}
