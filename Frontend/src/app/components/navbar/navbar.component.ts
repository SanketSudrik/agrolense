import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, AppLanguage } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ...MATERIAL_IMPORTS, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  languages: AppLanguage[] = [];
  filteredLanguages: AppLanguage[] = [];
  searchQuery: string = '';
  currentLang = 'en';
  userName: string = '';

  constructor(private languageService: LanguageService, private authService: AuthService) {
    this.languages = this.languageService.availableLanguages;
    this.filteredLanguages = [...this.languages];
  }

  ngOnInit() {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
    
    const user = this.authService.getUser();
    if (user && user.name) {
      this.userName = user.name;
    }
  }

  onToggleSidebar(): void {
    document.dispatchEvent(new CustomEvent('toggle-sidebar'));
  }

  switchLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }

  filterLanguages(): void {
    if (!this.searchQuery) {
      this.filteredLanguages = [...this.languages];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredLanguages = this.languages.filter(l => 
      l.name.toLowerCase().includes(query) || 
      l.nativeName.toLowerCase().includes(query) ||
      l.code.toLowerCase().includes(query)
    );
  }
}
