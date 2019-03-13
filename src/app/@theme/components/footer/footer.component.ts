import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../neosound/services/language.service';
import { DataService } from '../../../neosound/shared';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by" *ngIf="config.footer.title.show">
    {{t(config.footer.title.text)}} <b><a href="{{config.footer.title.link}}" target="_blank">{{config.footer.title.name}}</a></b>
    </span>
    <div class="socials">

      <a *ngIf="config.footer.terms.show" href="{{config.footer.terms.link}}" class="text-link" target="_blank" style="font-size: 12px;">{{t(config.footer.terms.text)}}</a>
      <a *ngIf="config.footer.about.show" href="{{config.footer.about.link}}" class="text-link" target="_blank" style="font-size: 12px;">{{t(config.footer.about.text)}}</a>
      <!-- <a href="#"  target="_blank" class="ion ion-social-facebook"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a>
      <a href="#" target="_blank" class="ion ion-social-linkedin"></a> -->
    </div>
  `,
})
export class FooterComponent implements OnInit {
  config = {};
  ngOnInit() {
    this.config = DataService.config;
  }
  t(v) {
    return LanguageService.t(v);
  }
}
