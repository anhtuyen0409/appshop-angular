import { Component, OnInit } from '@angular/core';
import { enviroment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class OrderConfirmComponent implements OnInit {

  cartItems: { product: Product, quantity: number}[] = [];
  couponCode: string = ''; // mã giảm giá
  totalAmount: number = 0; // tổng tiền

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    // lấy danh sách sản phẩm từ giỏi hàng
    debugger
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys()); // chuyển danh sách id từ Map giỏ hàng
    // gọi service để lấy thông tin sản phẩm dựa trên danh sách id
    debugger
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger
        // lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if(product) {
            product.thumbnail = `${enviroment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
        console.log('ok');
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        console.error('Error fetching detail: ', error);
      }
    });
  }

  // tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 0
    );
  }

  applyCoupon(): void {

  }

}
