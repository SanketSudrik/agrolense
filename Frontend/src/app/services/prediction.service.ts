import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PredictionResponse } from '../models/prediction.model';

@Injectable({ providedIn: 'root' })
export class PredictionService {
  private readonly API = `${environment.apiUrl}/Prediction`;

  constructor(private http: HttpClient) {}

  /**
   * Upload an image file and get disease prediction.
   * Uses FormData to send the file as multipart/form-data
   * matching the .NET controller: PredictFromImage(IFormFile file)
   */
  predictFromImage(file: File, language: string = 'English'): Observable<PredictionResponse> {
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('language', language);
    return this.http.post<PredictionResponse>(`${this.API}/predict`, formData);
  }
}
