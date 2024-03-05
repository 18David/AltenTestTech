import { filter } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Product, Products } from "app/types/product.types";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { JsonConvert } from "json2typescript";
import { environment } from 'app/environments/environments';


@Injectable({ providedIn: "root" })
export class ProductsService {

    products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

    jsonConvert: JsonConvert = new JsonConvert();


    /**
     * Constructor
     */
    constructor(private http: HttpClient) {}

    getProducts(httpParams: any = {}): Observable<Products> {
        return new Observable<Products>((observer) => {
            console.log(httpParams.filters);
            this.http.get((environment.useApi)?environment.apiUrl + "products" : "assets/products.json",  { params: httpParams }).subscribe((data) => {
                let products = this.jsonConvert.deserializeObject(data, Products);
                console.log(products);
                this.products.next(products.data);
                observer.next(products);
                observer.complete();
            });

        });
    }

    updateProduct(editProduct: Product) {
        let products = this.products.getValue();
        let index = products.findIndex((product) => product.id === editProduct.id);
        products[index] = editProduct;
        if(environment.useApi) {
            this.http.patch(environment.apiUrl + "products/" + editProduct.id, editProduct).subscribe(() => {
                this.products.next(products);
            });

        }else{
            this.products.next(products);
        }
    }

    addProcuct(product: Product) {
        let products = this.products.getValue();
        if(environment.useApi) {
            products.push(product);
            /*let json = this.jsonConvert.serializeObject(product);
            console.log(product);
            console.log(json);*/
            this.http.post(environment.apiUrl + "products", product).subscribe(() => {
                this.products.next(products);
            });
        }else{
            this.products.next(products);
        }
    }

    deleteProduct(id: number) {
        let products = this.products.getValue();
        let index = products.findIndex((p) => p.id === id);
        products.splice(index, 1);
        if(environment.useApi) {
            this.http.delete(environment.apiUrl + "products/" + id).subscribe(() => {
                this.products.next(products);
            });
        }else{
          this.products.next(products);
        }
    }

    getProduct(id: number): Observable<Product> {
        return new Observable<Product>((observer) => {
            let products = this.products.getValue();
            let product = products.find((p) => p.id === id);
            if(environment.useApi) {
                this.http.get(environment.apiUrl + "products/" + id).subscribe((prod) => {
                    product = this.jsonConvert.deserializeObject(prod, Product);
                    products[products.findIndex((p) => p.id === id)] = product;
                    this.products.next(products);
                    observer.next(product);
                    observer.complete();
                });
            }else{
                observer.next(product);
                observer.complete();
            }
        });
    }
}
