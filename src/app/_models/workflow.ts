// src/app/_models/workflow.ts (RECOMMENDED)

interface RequestItem {
  qty: number;
  name: string;
}

interface Request {
  requestId: number;
  type: string; // e.g., "Equipment"
  employeeId: string;
  items: RequestItem[];
  status: string;
}

interface Transfer {
  transferId: number;
  fromDept: string;
  toDept: string;
  status: string;
}

interface Employee {
  employeeId: string;
  position: string;
  departmentId: number;
}

// The main Workflow interface
export interface Workflow {
  id: number;
  type: 'Request Approval' | 'Department Transfer'; // Main workflow type
  status: 'Pending' | 'Approved' | 'Rejected';
  details: string;
  employeeId: string;
  transferId: number | null;
  requestId: number | null;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
  request: Request | null; // Nested Request object (for Request Approval)
  transfer: Transfer | null; // Nested Transfer object (for Department Transfer)
}