import { HttpClient } from "@angular/common/http";
import { OrderDTO } from "../dtos/order/order.dto";
import { enviroment } from "../environments/environment";
import { Observable } from "rxjs";

export class OrderService {

  private apiCreateOrder = `${enviroment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: OrderDTO): Observable<any> {
    return this.http.post(this.apiCreateOrder, orderData);
  }

  getOrderById(orderId: number) {
    return this.http.get(`${enviroment.apiBaseUrl}/orders/${orderId}`);
  }

}
