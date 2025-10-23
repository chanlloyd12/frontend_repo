// src/app/_models/department.ts
import { Employee } from './employee';

export class Department {
  id!: number;
  name!: string;
  description?: string;
  employees?: Employee[];   // ✅ added
}
