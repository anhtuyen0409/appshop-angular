import { HttpClient, HttpParams } from "@angular/common/http";
import { enviroment } from "../environments/environment";
import { Observable } from "rxjs";
import { Category } from "../models/category";

export class CategoryService {

  private apiGetCategories = `${enviroment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(page: number, limit: number): Observable<Category[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Category[]>(this.apiGetCategories, { params });
  }

}
