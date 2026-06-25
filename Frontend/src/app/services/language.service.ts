import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface AppLanguage {
  code: string;
  name: string;
  nativeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public readonly availableLanguages: AppLanguage[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
    { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'ks', name: 'Kashmiri', nativeName: 'كأشُر' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
    { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
    { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
    { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी' },
    { code: 'brx', name: 'Bodo', nativeName: 'बड़ो' },
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
    { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ' },
    { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
    { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी' },
    { code: 'mag', name: 'Magahi', nativeName: 'मगही' },
    { code: 'awa', name: 'Awadhi', nativeName: 'अवधी' },
    { code: 'hne', name: 'Chhattisgarhi', nativeName: 'छत्तीसगढ़ी' }
  ];

  private currentLanguageSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translateService: TranslateService) {
    const savedLang = localStorage.getItem('app_language') || 'en';
    this.setLanguage(savedLang);
  }

  setLanguage(code: string) {
    this.translateService.use(code);
    this.currentLanguageSubject.next(code);
    localStorage.setItem('app_language', code);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  getCurrentLanguageName(): string {
    const code = this.getCurrentLanguage();
    return this.availableLanguages.find(l => l.code === code)?.name || 'English';
  }
}
