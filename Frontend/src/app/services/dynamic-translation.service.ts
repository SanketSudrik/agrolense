import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DynamicTranslationService {
  private cache: Map<string, string> = new Map();
  private http: HttpClient;

  constructor(
    private handler: HttpBackend,
    private translateService: TranslateService
  ) {
    this.http = new HttpClient(handler);
  }

  translate(text: string): Observable<string> {
    if (!text || typeof text !== 'string') return of(text);
    
    const targetLang = this.translateService.currentLang || this.translateService.getDefaultLang() || 'en';
    
    if (targetLang === 'en') {
      return of(text);
    }

    const cacheKey = `${targetLang}:${text}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    return this.http.get(url).pipe(
      map((response: any) => {
        if (response && response[0]) {
          const translatedText = response[0].map((segment: any) => segment[0]).join('');
          this.cache.set(cacheKey, translatedText);
          return translatedText;
        }
        return text;
      }),
      catchError((err) => {
        console.error('Translation error:', err);
        return of(text);
      })
    );
  }
}
