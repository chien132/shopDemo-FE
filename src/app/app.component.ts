import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private translation: TranslateService) {
    translation.addLangs(['en', 'vi']);
    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      translation.use(browserLang.match(/en|vi/) ? browserLang : 'en');
    } else {
      localStorage.setItem('locale', 'en');
      translation.setDefaultLang('en');
    }

    UtilService.setTranslationService(translation);
  }
  title = 'shopDemoUI';
}
