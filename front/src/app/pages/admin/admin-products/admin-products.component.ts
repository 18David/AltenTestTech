import { CommonModule } from '@angular/common';
import { ProductsService } from './../../../services/products.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from 'app/types/product.types';
import { ConfirmationService, FilterMatchMode, FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonConvert } from 'json2typescript';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';


@Component({
    selector     : 'admin-products',
    templateUrl  : './admin-products.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    providers: [ConfirmationService],
    imports: [ TableModule, MultiSelectModule, CheckboxModule, ButtonModule, PanelModule, DialogModule, CommonModule, RatingModule, FormsModule, ReactiveFormsModule, ConfirmDialogModule, InputTextModule ],
})
export class AdminProductsComponent implements OnInit, OnDestroy
{

    products: Product[];

    totalRecords: number;

    cols: any[];

    loading: boolean;

    selectAll: boolean = false;

    selectedProducts: Product[] = [];

    unsubcribeAll: Subject<any> = new Subject();

    filterMatchMode = FilterMatchMode.CONTAINS;

    editProductDialog: boolean = false;

    edit: boolean = false;

    jsonConvert: JsonConvert = new JsonConvert();

    editProductId = null;

    form: FormGroup = new FormGroup({
        name: new FormControl('',[Validators.required]),
        description: new FormControl('',[Validators.required]),
        price: new FormControl(0,[Validators.required]),
        rating: new FormControl(0,[Validators.required]),
        code: new FormControl('',[Validators.required]),
        quantity: new FormControl(0,[Validators.required]),
        inventoryStatus: new FormControl('OUTOFSTOCK',[Validators.required]),
        category: new FormControl('',[Validators.required]),
    });

    constructor(private productsService: ProductsService, private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.loading = true;
        //this.loadProducts();

    }

    ngOnDestroy(): void {
        this.unsubcribeAll.next(null);
        this.unsubcribeAll.complete();
    }

    loadProducts(event?: LazyLoadEvent) {
      console.log('event', event);
      const params: any = {
        first: event?.first,
        rows: event?.rows,
        sortField: event?.sortField,
        sortOrder: event?.sortOrder,
        filters: JSON.stringify(event?.filters)
      };

      this.productsService.getProducts(params).pipe(takeUntil(this.unsubcribeAll)).subscribe(res => {
        console.log('res', res);
        this.products = res.data;
        this.totalRecords = res.totalRecords??this.products.length;
        this.loading = false;
      });

    }

    onSelectionChange(value = []) {
        this.selectAll = value.length === this.totalRecords;
        this.selectedProducts = value;
    }

    onSelectAllChange(event) {
        const checked = event.checked;

        if (checked) {
                this.selectedProducts = this.products;
                this.selectAll = true;
        }
        else {
            this.selectedProducts = [];
            this.selectAll = false;
        }
    }

    btnProduct(product : Product = undefined){
        console.log('New Product');

        this.edit = product !== undefined;

        if(!this.edit){
        	  console.log('New Product');
            this.editProductId = null;
            this.form = new FormGroup({
                name: new FormControl('',[Validators.required]),
                description: new FormControl('',[Validators.required]),
                price: new FormControl(0,[Validators.required]),
                rating: new FormControl(0,[Validators.required]),
                code: new FormControl('',[Validators.required]),
                quantity: new FormControl(0,[Validators.required]),
                inventoryStatus: new FormControl('OUTOFSTOCK',[Validators.required]),
                category: new FormControl('',[Validators.required]),
            });

        }
        else
        {
            this.editProductId = product.id;
            this.form = new FormGroup({
                name: new FormControl(product.name,[Validators.required]),
                description: new FormControl(product.description,[Validators.required]),
                price: new FormControl(product.price,[Validators.required]),
                rating: new FormControl(product.rating,[Validators.required]),
                code: new FormControl(product.code,[Validators.required]),
                quantity: new FormControl(product.quantity,[Validators.required]),
                inventoryStatus: new FormControl(product.inventoryStatus,[Validators.required]),
                category: new FormControl(product.category,[Validators.required]),
            });
        }
        this.editProductDialog = true;

    }

    addProduct(){
        let editProduct = {
            id: this.editProductId,
            name: this.form.get('name').value,
            description: this.form.get('description').value,
            price: this.form.get('price').value,
            rating: this.form.get('rating').value,
            code: this.form.get('code').value,
            quantity: this.form.get('quantity').value,
            inventoryStatus: this.form.get('inventoryStatus').value,
            category: this.form.get('category').value,
        };

        editProduct.inventoryStatus = (editProduct.quantity == 0 )? 'OUTOFSTOCK' : (editProduct.quantity <= 10 )? 'LOWSTOCK' : 'INSTOCK';
        if(this.edit){
            this.productsService.updateProduct(editProduct);
        }
        else{
            this.productsService.addProcuct(editProduct);
        }
        this.editProductDialog = false;
    }

    deleteProduct(id: number){
        console.log('Delete Product');
        this.confirmationService.confirm({
            message: 'Do you want to delete this product?',
            header: 'Delete Confirmation',
            acceptButtonStyleClass: 'p-button-danger',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.productsService.deleteProduct(id);
            },
            reject: (type) => {

            }
        });

    }

    deleteSelectedProduct(){

        this.confirmationService.confirm({
            message: 'Do you want to delete '+this.selectedProducts.length+' products?',
            header: 'Delete Confirmation',
            acceptButtonStyleClass: 'p-button-danger',
            icon: 'pi pi-info-circle',
            accept: () => {
                for(let product of this.selectedProducts){
                    this.productsService.deleteProduct(product.id);
                }
            },
            reject: (type) => {

            }
        });

    }

    cancel(){
        this.editProductId = null;
        this.editProductDialog = false;
    }

}
