import { Routes } from '@angular/router';
import { Home } from './components/pages/inicio/home';
import { loginGuard } from './guards/login-guard';
import { Error } from './components/pages/error/error';
import { Login } from './components/pages/login/login';
import { Logout } from './components/pages/logout/logout';

export const routes: Routes = [
    // { path: '', component: Home, canActivate: [loginGuard] },
    // { path: 'cursos', component: Cursos, canActivate: [loginGuard] },
    // { path: 'users', component: Users, canActivate: [loginGuard] },
    { path: '', component: Home},
    { path: 'login', component: Login},
    { path: 'logout', component: Logout },
    { path: '**', redirectTo: '' },
];