import { Directive, Input, ElementRef, OnInit } from "@angular/core";
import { PlayerService } from "../services/player.service";

@Directive({
  selector: "[interval]"
})
export class IntervalDirective implements OnInit {
  @Input("timeInterval")
  timeInterval = [];
  private start = 0;
  private end = 0;
  constructor(private playerService: PlayerService, private el: ElementRef) {}
  ngOnInit() {
    this.start = parseFloat(this.timeInterval[0]);
    this.end = parseFloat(this.timeInterval[1]);
    this.playerService.tick$.subscribe((time: any) => {
      if (time > this.start && time < this.end) {
        this.el.nativeElement.scrollIntoView();
        this.el.nativeElement.style.color = "#009ad2";
      } else {
        this.el.nativeElement.style.color = "#4b4b4b";
      }
    });
  }
}
