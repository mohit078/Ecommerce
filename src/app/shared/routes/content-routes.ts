import { Routes } from "node_modules/@angular/router/router"

export const ContentRoute: Routes = [
   //All feature modules path 
    { path:'dashboard', loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path:'products', loadChildren: () => import('../../components/products/products.module').then(m => m.ProductsModule) },
    { path:'sales', loadChildren: () => import('../../components/sales/sales.module').then(m => m.SalesModule) },
    { path:'masters', loadChildren: () => import('../../components/masters/masters.module').then(m => m.MastersModule) },
    { path:'users', loadChildren: () => import('../../components/users/user.module').then(m => m.UserModule) },
    { path:'reports', loadChildren: () => import('../../components/reports/reports.module').then(m => m.ReportsModule) },
    { path:'settings', loadChildren: () => import('../../components/settings/settings.module').then(m => m.SettingsModule) },
    { path:'invoice', loadChildren: () => import('../../components/invoice/invoice.module').then(m => m.InvoiceModule) },
] 