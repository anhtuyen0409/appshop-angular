import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cart: Map<number, number> = new Map(); // dùng Map để lưu trữ giỏ hàng, key là id sản phẩm, value là số lượng sản phẩm

  constructor(private productService: ProductService) {
    // lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo service
    const storedCart = localStorage.getItem('cart');
    if(storedCart) {
      this.cart = new Map(JSON.parse(storedCart));
    }
  }

  addToCart(productId: number, quantity: number = 1): void {
    debugger
    if(this.cart.has(productId)) {
      // nếu sản phẩm đã có trong giỏ hàng -> tăng số lượng sp đó
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      // nếu sản phẩm chưa có trong giỏ hàng
      this.cart.set(productId, quantity);
    }
    // sau khi thay đổi giỏ hàng, lưu trữ nó vào localStorage
    this.saveCartToLocalStorage();
  }

  getCart(): Map<number, number> {
    return this.cart;
  }

  // lưu trữ giỏ hàng vào localStorage
  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
  }

  // xoá dữ liệu giỏ hàng và cập nhật localStorage
  clearCart(): void {
    this.cart.clear(); // xoá toàn bộ dữ liệu trong giỏ hàng
    this.saveCartToLocalStorage(); // cập nhật lại giỏ hàng rỗng
  }

}
