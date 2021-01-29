import { Injectable } from '@angular/core';
// import { link } from 'fs';

export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  active?: boolean;
  children?: Menu[]
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  collapsSidebar: boolean = false;

  constructor() { }

  MENUITEMS: Menu[] = [
    {path: '/dashboard/default', title: 'DashBoard', icon: 'home', type:'link', active: true},
    
    {title: 'Products', icon: 'box', type: 'sub', active: false, children: [
      {
        title: 'physical', type: 'sub', children: [
          {path: '/products/physical/product-list', title: 'Products list', type: 'link' },
          {path: '/products/physical/product-add', title: 'Add Product', type: 'link' }
        ]
      }]
    },

    {title: 'Sales', icon: 'dollar-sign', type: 'sub', active: false, children: [
          {path: '/sales/orders', title: 'Orders', type: 'link' },
          {path: '/sales/transactions', title: 'Transactions', type: 'link' }
        ]
    },

    {title: 'Masters', icon: 'clipboard', type: 'sub', active: false, children: [
      {path: '/masters/brandlogo', title: 'brandlogo', type: 'link' },
      {path: '/masters/category', title: 'category', type: 'link' },
      {path: '/masters/color', title: 'color', type: 'link' },
      {path: '/masters/size', title: 'size', type: 'link' },
      {path: '/masters/tag', title: 'tag', type: 'link' },
      {path: '/masters/usertype', title: 'usertype', type: 'link' },
      ]
    },

    {title: 'User', icon: 'user-plus', type: 'sub', active: false, children: [
      {path: '/user/list-user', title: 'User List', type: 'link' },
      {path: '/user/create-user', title: 'Create user', type: 'link' }
      ]
    },

    {path: '/reports', title: 'Reports', icon: 'bar-chart', type:'link', active: false},

    {title: 'Settings', icon: 'settings', type: 'sub', active: false, children: [
      {path: '/settings/profile', title: 'User Profile', type: 'link' }
      ]
    },

    {path: '/invoice', title: 'Innvoice', icon: 'archive', type:'link', active: false},

    {path: '/auth/login', title: 'Log Out', icon: 'log-out', type:'link', active: false},

  ]

}
