import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { loginGuard } from './guards/login-guard';
import { Login } from './components/pages/login/login';
import { Logout } from './components/pages/logout/logout';
import { Bank } from './components/pages/bank/bank';
import { AccountDetail } from './components/pages/accounts/account-detail/account-detail';

export const routes: Routes = [
    { path: '', component: Home, canActivate: [loginGuard] },
    { path: 'bank', component: Bank, canActivate: [loginGuard] },
    { path: 'accounts/:iban', component: AccountDetail, canActivate: [loginGuard] },
    //{ path: 'users', component: Account, canActivate: [loginGuard] },
    { path: 'login', component: Login},
    { path: 'logout', component: Logout },
    { path: '**', redirectTo: '' },
];