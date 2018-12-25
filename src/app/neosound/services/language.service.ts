import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
import { text } from '@angular/core/src/render3/instructions';

@Injectable()
export class LanguageService {

  constructor(
  ) { }

  checkLanguage(ln) {
    const lang = localStorage.getItem('lang');
    return lang && (lang === ln) || !lang && ln === 'en';
  }

  getLanguage() {
    const lang = localStorage.getItem('lang');
    return lang || !lang && 'en';
  }

  static t(text) {
    const lang = localStorage.getItem('lang');
    const current =  lang || !lang && 'en';

    if (current === 'en') {
      return text;
    }
    if (current === 'sp') {
      switch (text) {
        case 'Sign in': return 'Conéctese';
        case 'Username': return 'Nombre de usuario';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';
        // case '': return '';

        default:
          return text;
      }
    }
  }
}
