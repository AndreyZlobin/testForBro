import { Injectable } from "@angular/core";
import { Subject, timer, Subscription } from "rxjs";
import { merge, map } from "rxjs/operators";

@Injectable()
export class PlayerService {
  public time: any;
  public tick$: Subject<any> = new Subject();
  public events$: any = merge(
    this.tick$.pipe(map(value => ({ name: "tick", value }))),
  );

  constructor() {}
  setActive(time) {
    this.time = time;
    this.tick$.next(time);
  }
}
