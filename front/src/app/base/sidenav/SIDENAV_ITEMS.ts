import { SidenavItem } from "app/base/sidenav/sidenav.model";

export const SIDENAV_ITEMS: SidenavItem[] = [

  {
    id: 'products',
    icon: 'shopping-cart',
    labels: {
      en: "Products",
      fr: "Produits"
    },
    link: 'products'

  },
  {
    id: 'admin',
    icon: 'users',
    labels: {
      en: "Admin",
      fr: "Administration"
    },
    link: 'admin'

  },

];
