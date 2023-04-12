import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StorageService } from '../services/auth/storage.service';
import { LoginService } from '../services/auth/login.service';
import { JwtService } from '../services/auth/jwt.service';
import { filter } from 'rxjs/operators';
import { ItemService } from '../services/item.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  username = this.jwtService.getUsername();
  role = this.jwtService.getRole();
  currentRoute: string;
  search: string;
  searchTimer;
  currentLang = this.translate.currentLang;

  constructor(
    private translate: TranslateService,
    private loginService: LoginService,
    private router: Router,
    private storageService: StorageService,
    private jwtService: JwtService,
    private itemService: ItemService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }
  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
  }

  getLangs() {
    return this.translate.getLangs();
  }

  onInput(event) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const searchStr =
        '%' + event.replace(/[^\w\s]/gi, '_').replace(/ /g, '%') + '%';
      this.itemService.itemFilter.next(searchStr);
    }, 300);
  }

  ngOnInit() {
    this.storageService.watchStorage().subscribe((data) => {
      this.username = this.jwtService.getUsername();
      this.role = this.jwtService.getRole();
    });
  }

  logOut() {
    this.loginService.logOut();
    if (
      this.router.url.includes('/cart') ||
      this.router.url.includes('/orders') ||
      this.router.url.includes('/adminpanel')
    ) {
      this.router.navigate(['/login']);
    }
  }
}
