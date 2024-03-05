import { inject } from '@angular/core';
import { catchError, forkJoin, mergeMap, tap } from 'rxjs';
import { ProductsService } from './services/products.service';

export const initialDataResolver = () =>
{
    const productsService = inject(ProductsService);
    // Fork join multiple API endpoint calls to wait all of them to finish
    return productsService.getProducts().pipe(
        tap(data => console.log('data:', data)),
        catchError(error => {
            console.error('Error in initialDataResolver:', error);
            // Handle the error as needed, you can also throw an error to prevent the route from resolving
            throw error;
        })
    );
};
