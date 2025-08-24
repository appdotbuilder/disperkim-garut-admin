import { z } from 'zod';

// User role enum
export const UserRoleEnum = z.enum(['ADMIN', 'MANAGER', 'STAFF', 'OFFICER']);
export type UserRole = z.infer<typeof UserRoleEnum>;

// Complaint status enum
export const ComplaintStatusEnum = z.enum(['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']);
export type ComplaintStatus = z.infer<typeof ComplaintStatusEnum>;

// Work order status enum
export const WorkOrderStatusEnum = z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
export type WorkOrderStatus = z.infer<typeof WorkOrderStatusEnum>;

// Infrastructure report status enum
export const InfrastructureStatusEnum = z.enum(['GOOD', 'NEEDS_MAINTENANCE', 'DAMAGED', 'CRITICAL']);
export type InfrastructureStatus = z.infer<typeof InfrastructureStatusEnum>;

// News/announcement status enum
export const PublicationStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type PublicationStatus = z.infer<typeof PublicationStatusEnum>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  role: UserRoleEnum,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;

// Create user input schema
export const createUserInputSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2).max(100),
  role: UserRoleEnum,
  is_active: z.boolean().default(true),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Update user input schema
export const updateUserInputSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  full_name: z.string().min(2).max(100).optional(),
  role: UserRoleEnum.optional(),
  is_active: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Complaint schema
export const complaintSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  citizen_name: z.string(),
  citizen_email: z.string().email(),
  citizen_phone: z.string().nullable(),
  address: z.string(),
  status: ComplaintStatusEnum,
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assigned_to: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  resolved_at: z.coerce.date().nullable(),
});

export type Complaint = z.infer<typeof complaintSchema>;

// Create complaint input schema
export const createComplaintInputSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  citizen_name: z.string().min(2).max(100),
  citizen_email: z.string().email(),
  citizen_phone: z.string().nullable(),
  address: z.string().min(5),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

export type CreateComplaintInput = z.infer<typeof createComplaintInputSchema>;

// Update complaint input schema
export const updateComplaintInputSchema = z.object({
  id: z.number(),
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).optional(),
  status: ComplaintStatusEnum.optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigned_to: z.number().nullable().optional(),
});

export type UpdateComplaintInput = z.infer<typeof updateComplaintInputSchema>;

// Infrastructure report schema
export const infrastructureReportSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  coordinates: z.string().nullable(),
  status: InfrastructureStatusEnum,
  maintenance_required: z.boolean(),
  estimated_cost: z.number().nullable(),
  reported_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type InfrastructureReport = z.infer<typeof infrastructureReportSchema>;

// Create infrastructure report input schema
export const createInfrastructureReportInputSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  location: z.string().min(5),
  coordinates: z.string().nullable(),
  status: InfrastructureStatusEnum,
  maintenance_required: z.boolean().default(false),
  estimated_cost: z.number().positive().nullable(),
});

export type CreateInfrastructureReportInput = z.infer<typeof createInfrastructureReportInputSchema>;

// Housing unit schema
export const housingUnitSchema = z.object({
  id: z.number(),
  unit_number: z.string(),
  address: z.string(),
  unit_type: z.string(),
  size_sqm: z.number(),
  bedrooms: z.number().int(),
  bathrooms: z.number().int(),
  occupancy_status: z.enum(['OCCUPIED', 'VACANT', 'MAINTENANCE', 'RESERVED']),
  monthly_rent: z.number().nullable(),
  owner_name: z.string().nullable(),
  owner_contact: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type HousingUnit = z.infer<typeof housingUnitSchema>;

// Create housing unit input schema
export const createHousingUnitInputSchema = z.object({
  unit_number: z.string().min(1).max(50),
  address: z.string().min(5),
  unit_type: z.string().min(2).max(50),
  size_sqm: z.number().positive(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  occupancy_status: z.enum(['OCCUPIED', 'VACANT', 'MAINTENANCE', 'RESERVED']).default('VACANT'),
  monthly_rent: z.number().positive().nullable(),
  owner_name: z.string().nullable(),
  owner_contact: z.string().nullable(),
});

export type CreateHousingUnitInput = z.infer<typeof createHousingUnitInputSchema>;

// News/announcement schema
export const publicationSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  type: z.enum(['NEWS', 'ANNOUNCEMENT', 'EVENT']),
  status: PublicationStatusEnum,
  featured: z.boolean(),
  author_id: z.number(),
  published_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Publication = z.infer<typeof publicationSchema>;

// Create publication input schema
export const createPublicationInputSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10),
  type: z.enum(['NEWS', 'ANNOUNCEMENT', 'EVENT']),
  status: PublicationStatusEnum.default('DRAFT'),
  featured: z.boolean().default(false),
});

export type CreatePublicationInput = z.infer<typeof createPublicationInputSchema>;

// Media file schema
export const mediaFileSchema = z.object({
  id: z.number(),
  filename: z.string(),
  original_name: z.string(),
  mime_type: z.string(),
  file_size: z.number().int(),
  file_path: z.string(),
  uploaded_by: z.number(),
  created_at: z.coerce.date(),
});

export type MediaFile = z.infer<typeof mediaFileSchema>;

// Work order schema
export const workOrderSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  complaint_id: z.number().nullable(),
  assigned_to: z.number().nullable(),
  status: WorkOrderStatusEnum,
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  estimated_cost: z.number().nullable(),
  actual_cost: z.number().nullable(),
  scheduled_date: z.coerce.date().nullable(),
  completed_date: z.coerce.date().nullable(),
  created_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type WorkOrder = z.infer<typeof workOrderSchema>;

// Create work order input schema
export const createWorkOrderInputSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  complaint_id: z.number().nullable(),
  assigned_to: z.number().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  estimated_cost: z.number().positive().nullable(),
  scheduled_date: z.coerce.date().nullable(),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderInputSchema>;

// Audit log schema
export const auditLogSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.number().nullable(),
  old_values: z.string().nullable(), // JSON string
  new_values: z.string().nullable(), // JSON string
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
  created_at: z.coerce.date(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;

// System settings schema
export const systemSettingSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string(),
  description: z.string().nullable(),
  updated_by: z.number(),
  updated_at: z.coerce.date(),
});

export type SystemSetting = z.infer<typeof systemSettingSchema>;

// Update system setting input schema
export const updateSystemSettingInputSchema = z.object({
  key: z.string(),
  value: z.string(),
  description: z.string().nullable().optional(),
});

export type UpdateSystemSettingInput = z.infer<typeof updateSystemSettingInputSchema>;