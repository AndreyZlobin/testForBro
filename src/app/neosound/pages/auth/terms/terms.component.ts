import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private lang: LanguageService,
  ) { }

  ngOnInit() {
  }

  isEnglish() {
    return this.lang.checkLanguage('en');
  }
}
