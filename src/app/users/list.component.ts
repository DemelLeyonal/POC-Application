import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;
    isAdmin = false;
    loggedUser = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.loggedUser = JSON.parse(localStorage.getItem('user'));
        if(this.loggedUser.username == 'admin'){
            this.isAdmin = true;
        }

        this.accountService.getAll().subscribe(res => {
            this.users = res;
        })
        
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
                this.users = this.users.filter(x => x.id !== id) 
            });
    }

    columnDefs = [
        { field: 'make', sortable: true, filter: true, checkboxSelection: true },
        { field: 'model', sortable: true, filter: true },
        { field: 'price', sortable: true, filter: true  }
    ];

    rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
    ];
}