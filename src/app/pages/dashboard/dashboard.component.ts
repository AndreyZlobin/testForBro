import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from '../../shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  public users$: Observable<any>;
  public data$: Observable<any>;

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  public loadData() {
    this.users$ = this.dataService.getUsers();
    this.data$ = this.dataService.getData();
  }

  public logout() {
    this.router.navigateByUrl('/');
  }

}
