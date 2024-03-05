import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { AdminProductsComponent } from './pages/admin/admin-products/admin-products.component';
import { initialDataResolver } from './app.resolvers';

const routes: Routes = [
  {
    path: '',
    resolve: {
      initialData: initialDataResolver
    },
    children: [
      {path: 'products', component: ProductsComponent},
      {path: 'admin', component: AdminProductsComponent},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})

export class AppRoutingModule {}
