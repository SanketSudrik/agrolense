import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService, AppLanguage } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-form-field appearance="outline" class="lang-selector" [class.dark-theme]="darkTheme">
      <mat-icon matPrefix>language</mat-icon>
      <mat-select [value]="currentLang" (selectionChange)="onLanguageChange($event.value)" panelClass="lang-panel">
        
        <!-- Custom Search Input -->
        <div class="search-box">
          <mat-icon>search</mat-icon>
          <input type="text" [formControl]="searchControl" placeholder="Search language..." 
                 (keydown)="$event.stopPropagation()" autocomplete="off">
        </div>

        <mat-option *ngFor="let lang of filteredLanguages" [value]="lang.code">
          <span class="lang-name">{{ lang.name }}</span>
          <span class="native-name">{{ lang.nativeName }}</span>
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    .lang-selector {
      width: 280px;
    }
    
    /* Make the form field look sleek */
    ::ng-deep .lang-selector .mdc-text-field--outlined {
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(4px);
      font-size: 1.1rem;
    }

    ::ng-deep .lang-selector.dark-theme .mdc-text-field--outlined {
      background: rgba(0, 0, 0, 0.2);
    }
    
    ::ng-deep .lang-selector .mdc-notched-outline__leading,
    ::ng-deep .lang-selector .mdc-notched-outline__notch,
    ::ng-deep .lang-selector .mdc-notched-outline__trailing {
      border-color: rgba(0, 0, 0, 0.1) !important;
    }
    
    .lang-name {
      font-weight: 600;
      font-size: 1.1rem;
      margin-right: 8px;
    }
    
    .native-name {
      font-size: 0.95em;
      color: var(--text-secondary, #64748b);
    }
    
    .search-box {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      position: sticky;
      top: 0;
      background: white;
      z-index: 100;
      border-bottom: 1px solid #e2e8f0;
      gap: 8px;
    }
    
    .search-box input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 16px;
      padding: 12px 0;
    }
    
    .search-box mat-icon {
      color: #64748b;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  languages: AppLanguage[] = [];
  filteredLanguages: AppLanguage[] = [];
  currentLang = 'en';
  searchControl: FormControl = new FormControl();

  // Optional Input to change styling if it's on a dark background vs light
  @Input() darkTheme = false;

  constructor(private languageService: LanguageService) { }

  ngOnInit() {
    this.languages = this.languageService.availableLanguages;
    this.filteredLanguages = this.languages;

    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });

    this.searchControl.valueChanges.subscribe(search => {
      if (!search) {
        this.filteredLanguages = this.languages;
        return;
      }
      search = search.toLowerCase();
      this.filteredLanguages = this.languages.filter(l =>
        l.name.toLowerCase().includes(search) ||
        l.nativeName.toLowerCase().includes(search)
      );
    });
  }

  onLanguageChange(code: string) {
    this.languageService.setLanguage(code);
  }
}
