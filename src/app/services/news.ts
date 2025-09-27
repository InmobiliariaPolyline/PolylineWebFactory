import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface NewsResponse {
  articles: NewsArticle[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiKey = 'TU_API_KEY_AQUI'; // Reemplaza con tu API key de NewsAPI
  private baseUrl = 'https://newsapi.org/v2';

  constructor(private http: HttpClient) { }

  getTechNews(): Observable<NewsResponse> {
    const url = `${this.baseUrl}/everything?q=tecnologia+OR+inteligencia+artificial+OR+IA&language=es&sortBy=publishedAt&apiKey=${this.apiKey}`;
    return this.http.get<NewsResponse>(url);
  }

  getBitcoinNews(): Observable<NewsResponse> {
    const url = `${this.baseUrl}/everything?q=bitcoin+OR+cryptocurrency+OR+criptomonedas&language=es&sortBy=publishedAt&apiKey=${this.apiKey}`;
    return this.http.get<NewsResponse>(url);
  }

  getBusinessNews(): Observable<NewsResponse> {
    const url = `${this.baseUrl}/everything?q=negocios+OR+economia+OR+empresa&language=es&sortBy=publishedAt&apiKey=${this.apiKey}`;
    return this.http.get<NewsResponse>(url);
  }
}
