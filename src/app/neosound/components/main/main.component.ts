import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor() {
  }

  ngOnInit() {
  }

  toggleSidebar(): boolean {

    return false;
  }

  toggleSettings(): boolean {

    return false;
  }

  goToHome() {
  }

  startSearch() {
  }
}
