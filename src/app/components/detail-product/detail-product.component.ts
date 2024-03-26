import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { enviroment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product';
import { ProductImage } from 'src/app/models/product.image';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})

export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // lấy productId từ url
    // const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    debugger
    const idParam = 5; //gán tạm 1 giá trị
    if(idParam !== null) {
      this.productId = +idParam;
    }
    if(!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // lấy danh sách ảnh sản phẩm và thay đổi url
          debugger
          if(response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image:ProductImage) => {
              product_image.image_url = `${enviroment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          debugger
          this.product = response
          // bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {
          debugger
          console.error('Error fetching detail: ', error);
        }
      });
    } else {
      console.error('Invalid productId: ', idParam);
    }
  }

  showImage(index: number): void {
    debugger
    if(this.product && this.product.product_images && this.product.product_images.length > 0) {
      // đảm bảo index nằm trong khoảng hợp lệ
      if(index < 0) {
        index = 0;
      } else if(index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      //gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    debugger
    this.currentImageIndex = index; // cập nhật currentImageIndex
  }

  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    debugger
    if(this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
    } else {
      // xử lý khi product là null
      console.error('Cannot add product to cart because product is null');
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if(this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {

  }

}
