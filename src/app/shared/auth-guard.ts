import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';
import { UsersService } from '../services/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UsersService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;
    return true;
    // this.store.pipe(
    //   select(s => s.status),
    //   map(status => {
    //     if (!status.loggedIn) {
    //       const user = AuthenticationService.getUser();
    //       if (user) {
    //         if (!this.authService.isAuthenticated()) {
    //           this.store.dispatch(new AuthActions.LoginRedirect());
    //         } else {
    //           this.store.dispatch(new AuthActions.LoginSuccess({
    //             user,
    //             permissions: user.permissions,
    //             url: url
    //           }));
    //           return true;
    //         }
    //       } else {
    //         this.store.dispatch(new AuthActions.LoginRedirect());
    //       }
    //       return false;
    //     }
    //     return true;
    //   }),
    //   take(1)
    // );
  }
}
