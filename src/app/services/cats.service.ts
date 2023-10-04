import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatsService {

  private apiUrl = environment.API_URL;
  private apiKey = environment.API_KEY;

  constructor(private http: HttpClient) { }

  getCatBreeds(): Observable<any[]> {
    const url = this.apiUrl + 'breeds?limit=20';
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });
    return this.http.get<any[]>(url, { headers });
  }

  getCatImage(breedId: any): Observable<any[]> {
    const url = this.apiUrl + 'images/' + breedId;
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });
    return this.http.get<any[]>(url, { headers });
  }

}
