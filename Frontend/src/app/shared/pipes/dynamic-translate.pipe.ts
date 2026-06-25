import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DynamicTranslationService } from '../../services/dynamic-translation.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'dynamicTranslate',
  pure: false,
  standalone: true
})
export class DynamicTranslatePipe implements PipeTransform, OnDestroy {
  private currentText = '';
  private currentTranslatedText = '';
  private currentLang = '';
  private subscription?: Subscription;
  private langSubscription?: Subscription;

  constructor(
    private translationService: DynamicTranslationService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) {
    this.langSubscription = this.translateService.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.translateText(this.currentText);
    });
  }

  transform(value: string | null | undefined): string {
    if (!value) return '';

    if (this.currentText !== value || this.currentLang !== this.translateService.currentLang) {
      this.currentText = value;
      this.currentLang = this.translateService.currentLang;
      this.currentTranslatedText = value; 
      this.translateText(value);
    }

    return this.currentTranslatedText;
  }

  private translateText(text: string) {
    if (!text) return;
    
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.translationService.translate(text).subscribe(translated => {
      if (this.currentTranslatedText !== translated) {
        this.currentTranslatedText = translated;
        this.ref.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
