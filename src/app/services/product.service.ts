import { HttpClient, HttpParams } from "@angular/common/http";
import { enviroment } from "../environments/environment";
import { Observable } from "rxjs";
import { Product } from "../models/product";

export class ProductService {

  private apiGetProducts = `${enviroment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(page: number, limit: number): Observable<Product[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Product[]>(this.apiGetProducts, { params });
  }

}
