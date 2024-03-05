import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from 'app/services/products.service';
import { Product } from 'app/types/product.types';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataView, DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector     : 'products',
    templateUrl  : './products.component.html',
    styles       : [`
    #products{
        .p-grid.p-nogutter.grid.grid-nogutter:has(div.col-4){
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        }
    }
    `],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [ DataViewModule, ButtonModule, DropdownModule, RatingModule, FormsModule, InputTextModule ],
})
export class ProductsComponent implements OnInit, OnDestroy
{
    products: Product[];

    totalRecords: number;

    sortOptions: SelectItem[];

    sortOrder: number;

    sortField: string;

    sortKey: string;

    unsubcribeAll: Subject<any> = new Subject();

    loading = false;

    /**
     * Constructor
     */
    constructor(private productsService: ProductsService)
    {

    }

    ngOnInit(): void {


        this.sortOptions = [
            {label: 'Price High to Low', value: '!price'},
            {label: 'Price Low to High', value: 'price'}
        ];
    }

    loadProducts(event?: LazyLoadEvent) {
      this.loading = true;
      console.log('event', event);
      const params: any = {
        first: event?.first,
        rows: event?.rows,
        sortField: event?.sortField??this.sortField,
        sortOrder: event?.sortOrder??this.sortOrder,
      };

      this.productsService.getProducts(params).pipe(takeUntil(this.unsubcribeAll)).subscribe(res => {
        console.log('res', res);
        this.products = res.data;
        this.totalRecords = res.totalRecords??this.products.length;
        this.loading = false;
      });

    }

    ngOnDestroy(): void {
      this.unsubcribeAll.next(null);
      this.unsubcribeAll.complete();
    }

    onSortChange(event) {
        let value : string = event.value??'';
        this.sortOrder = value.startsWith('!')?-1:1;
        this.sortField = value.startsWith('!')? value.substring(1):value;
        this.loadProducts({
          first: 0, // Reset first to 0 when sorting to fetch from the beginning
          rows: 10, // or any default value you want to set for rows
          sortField: this.sortField, // Use the selected sort key
          sortOrder: this.sortOrder, // or -1, depending on your sorting logic
        });
    }

    applyFilterGlobal($event: any, dt: DataView) {
        dt.filter($event.target.value);
    }




}
