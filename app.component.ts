import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './components/auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './components/shared/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {
    // Initialize authentication
    authService.initializeAuthState();
    
    // Initialize translation
    translateService.addLangs(['en', 'ar']);
    const currentLang = this.languageService.getCurrentLanguage();
    translateService.setDefaultLang(currentLang);
    translateService.use(currentLang);
  }

  ngOnInit(): void {
    this.authService.initializeAuthState();
  }
}