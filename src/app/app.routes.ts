import { Routes } from '@angular/router';
import { Home } from './components/pages/inicio/home';
import { loginGuard } from './guards/login-guard';
import { Error } from './components/pages/error/error';
import { Login } from './components/pages/login/login';
import { Logout } from './components/pages/logout/logout';
import { Bank } from './components/pages/bank/bank';

export const routes: Routes = [
    { path: '', component: Home, canActivate: [loginGuard] },
    { path: 'cursos', component: Bank, canActivate: [loginGuard] },
    //{ path: 'users', component: Account, canActivate: [loginGuard] },
    { path: 'login', component: Login},
    { path: 'logout', component: Logout },
    { path: '**', redirectTo: '' },
];