import { Directive, Input, ElementRef, OnInit } from "@angular/core";
import { PlayerService } from "../services/player.service";
import { ToastrService } from "ngx-toastr";
import {DataService} from "../shared";

@Directive({
  selector: "[interval]"
})
export class IntervalDirective implements OnInit {
  @Input("timeInterval")
  timeInterval = [];
  private start = 0;
  private end = 0;
  primaryColor: string;

  constructor(
    private playerService: PlayerService,
    private el: ElementRef,
    private toastrService: ToastrService,
    private userData: DataService,
  ) {
    if (this.userData.config["colors"].secondary) {
      this.primaryColor = this.userData.config["colors"].secondary;
    } else {
      this.primaryColor = "#0098d9";
    }
  }
  ngOnInit() {
    this.start = parseFloat(this.timeInterval[0]);
    this.end = parseFloat(this.timeInterval[1]);
    this.playerService.tick$.subscribe((time: any) => {
      if (time > this.start && time < this.end) {
        this.el.nativeElement.scrollIntoView({
          block: "start",
          behavior: "smooth",
          inline: "nearest"
        });
        this.el.nativeElement.style.color = this.primaryColor; //"#009ad2";
      } else {
        this.el.nativeElement.style.color = "#4b4b4b";
      }
    });
  }
}
