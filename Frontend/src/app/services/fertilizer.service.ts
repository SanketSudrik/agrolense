import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FertilizerRecommendation,
  CreateFertilizerRecommendation,
  UpdateFertilizerRecommendation
} from '../models/fertilizer.model';

@Injectable({ providedIn: 'root' })
export class FertilizerService {
  private readonly API = `${environment.apiUrl}/FertilizerRecommendations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FertilizerRecommendation[]> {
    return this.http.get<FertilizerRecommendation[]>(this.API);
  }

  getById(id: number): Observable<FertilizerRecommendation> {
    return this.http.get<FertilizerRecommendation>(`${this.API}/${id}`);
  }

  getByDisease(diseaseName: string): Observable<FertilizerRecommendation[]> {
    return this.http.get<FertilizerRecommendation[]>(`${this.API}/disease/${diseaseName}`);
  }

  create(dto: CreateFertilizerRecommendation): Observable<FertilizerRecommendation> {
    return this.http.post<FertilizerRecommendation>(this.API, dto);
  }

  update(id: number, dto: UpdateFertilizerRecommendation): Observable<FertilizerRecommendation> {
    return this.http.put<FertilizerRecommendation>(`${this.API}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
