import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { GridApi, GridOptionsWrapper } from 'ag-grid-community';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './../_components/confirmation-dialog/confirmation-dialog.component';

@Component({ templateUrl: 'list.component.html' })

export class ListComponent implements OnInit {
    users = null;
    isAdmin = false;
    loggedUser = null;
    rowData: any = [];
    columnDefs = [];

    constructor(private accountService: AccountService,
        private route: Router,
        private gridApi: GridApi,
        public dialog: MatDialog) { }

    ngOnInit() {
        this.loggedUser = JSON.parse(localStorage.getItem('user'));
        if (this.loggedUser.username == 'admin') {
            this.isAdmin = true;
        }

        this.accountService.getAll().subscribe(res => {
            this.users = res;
            this.columnDefs = [
                { field: 'firstName', sortable: true, filter: true },
                { field: 'lastName', sortable: true, filter: true },
                { field: 'username', sortable: true, filter: true },
                {
                    headerName: "Action",
                    maxWidth: 130,
                    cellRenderer: this.actionCellRenderer,
                    editable: false,
                    colId: "action"
                }
            ];
            for (let user of this.users) {
                let row = { firstName: user.firstName, lastName: user.lastName, username: user.username };
                this.rowData.push(row);
            }
            this.gridApi.setRowData(this.rowData);
            this.gridApi.setColumnDefs(this.columnDefs);
            this.gridApi.sizeColumnsToFit();
            this.gridApi.resetRowHeights();
            this.gridApi.setDomLayout('autoHeight');
            // document.querySelector('#myGrid').style.height = '';
        })

    }

    onGridReady(event) {
        this.gridApi = event.api;
    }

    actionCellRenderer(params) {
        let eGui = document.createElement("div");
        let currentuser = JSON.parse(localStorage.getItem('user'));
        if (currentuser.username == 'admin' || params.node.data.username == currentuser.username) {
            eGui.innerHTML = `
                  <button class="btn btn-sm btn-primary mr-1"  data-action="edit" > Edit  </button>`;
        }
        if (currentuser.username == 'admin' && params.node.data.username != currentuser.username) {
            eGui.innerHTML += `
                  <button class="btn btn-sm btn-danger btn-delete-user" data-action="delete" > Delete </button>`;
        }

        return eGui;
    }

    // deleteUser(id: string) {
    //     const user = this.users.find(x => x.id === id);
    //     user.isDeleting = true;
    //     this.accountService.delete(id)
    //         // .pipe(first())
    //         .subscribe(() => {
    //             this.users = this.users.filter(x => x.id !== id) 
    //         });
    // }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            // .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id);
                this.rowData = [];
                for (let user of this.users) {
                    let row = { firstName: user.firstName, lastName: user.lastName, username: user.username };
                    this.rowData.push(row);
                }
                this.gridApi.setRowData(this.rowData);
            });
    }

    onCellClicked(params) {
        // Handle click event for action cells
        if (params.column.colId === "action" && params.event.target.dataset.action) {
            let action = params.event.target.dataset.action;

            if (action === "edit") {
                const user = this.users.find(x => x.username === params.node.data.username);
                this.route.navigate(['/users/edit/' + user.id])
            }

            if (action === "delete") {
                const user = this.users.find(x => x.username === params.node.data.username);
                // this.deleteUser(user.id);
                this.openDialog(user);
            }
        }
    }

    openDialog(user): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '500px',
          data: "Do you confirm the deletion of this user?"
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            console.log('Yes clicked');
            this.deleteUser(user.id);
          }
        });
      }

    // columnDefs = [
    //     { field: 'firstName', sortable: true, filter: true },
    //     { field: 'lastName', sortable: true, filter: true },
    //     { field: 'username', sortable: true, filter: true  }
    // ];

    // rowData = [
    //     { firstName: 'Toyota', lastName: 'Celica', username: 35000 },
    //     { firstName: 'Ford', lastName: 'Mondeo', username: 32000 },
    //     { firstName: 'Porsche', lastName: 'Boxter', username: 72000 }
    // ];

}