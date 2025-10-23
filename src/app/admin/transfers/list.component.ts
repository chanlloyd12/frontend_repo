// import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-transfers-list',
//   templateUrl: './list.component.html',
// })
// export class TransfersListComponent implements OnInit, AfterViewInit {
//   @ViewChild('transferModalTemplate') transferModalTemplate: any;
//   employeeId: string = '';
//   transfers: any[] = [];

//   constructor(
//     private route: ActivatedRoute,
//     private modalService: NgbModal,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.employeeId = this.route.snapshot.paramMap.get('employeeId') || '';
//     this.loadTransfers();
//   }

//   ngAfterViewInit(): void {
//     // open modal automatically
//     setTimeout(() => {
//       if (this.transferModalTemplate) {
//         this.modalService.open(this.transferModalTemplate, { size: 'lg', centered: true });
//       }
//     }, 300);
//   }

//   loadTransfers(): void {
//     this.http.get<any[]>(`http://localhost:4000/api/transfers/employee/${this.employeeId}`)
//       .subscribe({
//         next: (data) => this.transfers = data,
//         error: (err) => {
//           console.error('Error loading transfers:', err);
//           this.transfers = [];
//         }
//       });
//   }

//   // optional: trigger new transfer
//   addTransfer(toDept: string) {
//     const body = {
//       employeeId: this.employeeId,
//       fromDept: 'Unknown',
//       toDept,
//       status: 'Pending'
//     };
//     this.http.post(`http://localhost:4000/api/transfers`, body)
//       .subscribe({
//         next: (res) => {
//           console.log('Transfer added:', res);
//           this.loadTransfers();
//         },
//         error: (err) => console.error('Error adding transfer:', err)
//       });
//   }
// }
