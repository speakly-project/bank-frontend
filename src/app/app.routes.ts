import { Routes } from '@angular/router';
import { Cursos } from './components/pages/cursos/cursos';
import { Home } from './components/pages/inicio/home';
import { loginGuard } from './guards/login-guard';
import { Error } from './components/pages/error/error';
import { Login } from './components/pages/login/login';
import { Logout } from './components/pages/logout/logout';
import { Users } from './components/pages/users/users';

export const routes: Routes = [
    // { path: '', component: Home, canActivate: [loginGuard] },
    // { path: 'cursos', component: Cursos, canActivate: [loginGuard] },
    // { path: 'users', component: Users, canActivate: [loginGuard] },
    { path: '', component: Home},
    { path: 'cursos', component: Cursos},
    { path: 'users', component: Users},
    { path: 'login', component: Login},
    { path: 'logout', component: Logout },
    { path: '**', redirectTo: '' },
];