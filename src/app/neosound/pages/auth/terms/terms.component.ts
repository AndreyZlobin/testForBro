import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { DataService } from '../../../shared';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private lang: LanguageService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
  }

  get legalName() {
    return this.dataService.config && (this.dataService.config as any).legalName || 'NeoSound';
  }

  get legalNameFull() {
    return this.dataService.config && (this.dataService.config as any).legalNameFull || 'NeoSound Intelligence B.V.';
  }

  get companyUrl() {
    return this.dataService.config && (this.dataService.config as any).companyMainUrl || 'https://NeoSound.eu';
  }

  isEnglish() {
    return this.lang.checkLanguage('en');
  }
  isSpanish() {
    return this.lang.checkLanguage('sp');
  }
}
