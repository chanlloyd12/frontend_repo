// requests/list.component.ts (Updated)
import { Component, OnInit } from '@angular/core';
import { RequestService } from '@app/_services/request.service';
import { Request, Item } from '@app/_models/request'; // Assuming Item is in your request model
import { ActivatedRoute } from '@angular/router';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  requests: Request[] = [];
  loading = true;
  // employeeId is no longer strictly required, but removed for clean admin view logic
  // employeeId!: string; 

  constructor(
    private requestService: RequestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    // FIX: Call getAll() for the admin/requests route to show all data
    this.requestService.getAll().subscribe({
      next: (data : Request[]) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err : any) => {
        console.error('Error loading requests:', err);
        this.loading = false;
      }
    });
  }
  
  // Helper function to safely map and join items for display (e.g., Laptop (x1))
  toStringItems(items: Item[] | undefined): string {
    if (!items || items.length === 0) {
      return 'N/A';
    }
    // Assuming Item has 'name' and 'qty' properties
    return items.map(i => `${i.name} (x${i.qty})`).join(', ');
  }
}