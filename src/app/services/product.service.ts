import { HttpClient, HttpParams } from "@angular/common/http";
import { enviroment } from "../environments/environment";
import { Observable } from "rxjs";
import { Product } from "../models/product";

export class ProductService {

  private apiGetProducts = `${enviroment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number): Observable<Product[]> {
    const params = new HttpParams()
      .set('keyword', keyword.toString())
      .set('selectedCategoryId', selectedCategoryId.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Product[]>(this.apiGetProducts, { params });
  }

  getDetailProduct(productId: number) {
    return this.http.get(`${enviroment.apiBaseUrl}/products/${productId}`);
  }

}
