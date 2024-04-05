import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { enviroment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orderForm: FormGroup;
  cartItems: { product: Product, quantity: number}[] = [];
  couponCode: string = ''; // mã giảm giá
  totalAmount: number = 0; // tổng tiền
  orderData: OrderDTO = {
    user_id: 1, // thay bằng user_id thích hợp
    fullname: '', // khởi tạo rỗng, sẽ được điền khi user đặt hàng
    email: '', // khởi tạo rỗng, sẽ được điền khi user đặt hàng
    phone_number: '', // khởi tạo rỗng, sẽ được điền khi user đặt hàng
    address: '', // khởi tạo rỗng, sẽ được điền khi user đặt hàng
    note: '', // khởi tạo rỗng, sẽ được điền khi user đặt hàng
    total_money: 0, // sẽ được tính dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // mặc định là thanh toán khi nhận hàng
    shipping_method: 'express', // mặc định là vận chuyển nhanh
    coupon_code: '', // khởi tạo rỗng, sẽ được điền khi user nhập mã giảm giá
    cart_items: []
  };

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService
  ) {
    // tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc
      email: ['', [Validators.email]], // kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(10)]], // số điện thoại phải có ít nhất 10 kí tự
      address: ['', [Validators.required, Validators.minLength(5)]], // địa chỉ phải có ít nhất 5 kí tự
      note: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

  ngOnInit(): void {
    // lấy danh sách sản phẩm từ giỏ hàng
    debugger
    this.orderData.user_id = this.tokenService.getUserId();
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
        this.calculateTotal();
      },
      error: (error: any) => {
        debugger
        console.error('Error fetching detail: ', error);
      }
    });
  }

  placeOrder() {
    debugger
    if(this.orderForm.valid) {
      // gán giá trị từ form vào đối tượng orderData
      // sử dụng toán tử pread (...) để sao chép giá trị từ form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };

      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));

      // dữ liệu hợp lệ -> tiếp tục xử lý đặt hàng
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response) => {
          debugger
          console.log('Đặt hàng thành công');
        },
        complete: () => {
          debugger
          this.calculateTotal();
        },
        error: (error: any) => {
          debugger
          console.error('Lỗi khi đặt hàng: ', error);
        }
      });
    }
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
