import { Injectable } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

declare let ga: Function;

@Injectable()
export class AnalyticsService {
  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga("send", {
          hitType: "pageView",
          eventCategory: "navigation",
          eventAction: event.urlAfterRedirects
        });
      }
    });
  }
  //   eventCategory	text	yes	Typically the object that was interacted with (e.g. 'Video')
  // eventAction	text	yes	The type of interaction (e.g. 'play')
  // eventLabel	text	no	Useful for categorizing events (e.g. 'Fall Campaign')
  // eventValue	integer	no	A numeric value associated with the event (e.g. 42)
  public trackEvent(
    eventCategory: string,
    eventAction: string,
    eventValue: string = ""
  ) {
    ga("send", {
      hitType: "event",
      eventCategory,
      eventAction,
      eventValue
    });
  }
}
