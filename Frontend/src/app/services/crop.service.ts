import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Crop, CreateCrop } from '../models/crop.model';

@Injectable({ providedIn: 'root' })
export class CropService {
  private readonly API = `${environment.apiUrl}/Crops`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Crop[]> {
    return this.http.get<Crop[]>(this.API);
  }

  getById(id: number): Observable<Crop> {
    return this.http.get<Crop>(`${this.API}/${id}`);
  }

  create(dto: CreateCrop): Observable<Crop> {
    return this.http.post<Crop>(this.API, dto);
  }

  update(id: number, dto: CreateCrop): Observable<any> {
    return this.http.put(`${this.API}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
