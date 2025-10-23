export interface Item {
  name: string;
  qty: number;
}

export interface Request {
  requestId: number;
  type: 'Equipment' | 'Leave' | 'Resources';
  employeeId: string; // e.g., 'EMP002'
  email?: string; // e.g., 'user@example.com' - added from backend
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fulfilled';
  items?: Item[];
  createdAt?: string; // from backend (though not used in components, it's available)
}