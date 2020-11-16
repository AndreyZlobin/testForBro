import { filter } from "rxjs/operators";
import { Router, NavigationEnd } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";

enum Files {
  File = "/file/",
  Video = "/video/",
}

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  @Input() position = "normal";

  user: any;
  isFixedPosition: boolean = false;

  userMenu = [{ title: "Profile" }, { title: "Log out" }];

  constructor(_router: Router) {
    _router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isFixedPosition = false;
        if (event.url.includes(Files.File) || event.url.includes(Files.Video)) {
          this.isFixedPosition = true;
        }
      });
  }

  ngOnInit() {}

  toggleSidebar(): boolean {
    return false;
  }

  toggleSettings(): boolean {
    return false;
  }

  goToHome() {}

  startSearch() {}

  isChrome() {
    return (
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    );
  }
}
