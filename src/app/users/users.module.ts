import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridComponent } from './ag-grid/ag-grid.component';
import { GridApi, GridOptionsWrapper } from 'ag-grid-community';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        AgGridModule.withComponents([])
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        AgGridComponent
    ],
    providers: [
        GridApi,
        GridOptionsWrapper
    ]
})
export class UsersModule { }