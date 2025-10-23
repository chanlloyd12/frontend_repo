import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const requestsModule = () => import('./admin/requests/requests.module').then(x => x.RequestsModule);
// const transfersModule = () => import('./admin/transfers/transfers.module').then(x => x.TransfersModule);
const workflowsModule = () => import('./admin/workflows/workflows.module').then(x => x.WorkflowsModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'requests', loadChildren: requestsModule , canActivate: [AuthGuard] },
    // { path: 'transfers', loadChildren: transfersModule, canActivate: [AuthGuard] },
    { path: 'workflows', loadChildren: workflowsModule, canActivate: [AuthGuard] },
    
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
