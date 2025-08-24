import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  numeric, 
  integer, 
  boolean, 
  pgEnum,
  varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'MANAGER', 'STAFF', 'OFFICER']);
export const complaintStatusEnum = pgEnum('complaint_status', [
  'PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'
]);
export const workOrderStatusEnum = pgEnum('work_order_status', [
  'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
]);
export const infrastructureStatusEnum = pgEnum('infrastructure_status', [
  'GOOD', 'NEEDS_MAINTENANCE', 'DAMAGED', 'CRITICAL'
]);
export const publicationStatusEnum = pgEnum('publication_status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export const occupancyStatusEnum = pgEnum('occupancy_status', ['OCCUPIED', 'VACANT', 'MAINTENANCE', 'RESERVED']);
export const publicationTypeEnum = pgEnum('publication_type', ['NEWS', 'ANNOUNCEMENT', 'EVENT']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  full_name: varchar('full_name', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Complaints table
export const complaintsTable = pgTable('complaints', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  citizen_name: varchar('citizen_name', { length: 100 }).notNull(),
  citizen_email: varchar('citizen_email', { length: 255 }).notNull(),
  citizen_phone: varchar('citizen_phone', { length: 20 }),
  address: text('address').notNull(),
  status: complaintStatusEnum('status').notNull().default('PENDING'),
  priority: priorityEnum('priority').notNull().default('MEDIUM'),
  assigned_to: integer('assigned_to'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  resolved_at: timestamp('resolved_at'),
});

// Infrastructure reports table
export const infrastructureReportsTable = pgTable('infrastructure_reports', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  coordinates: text('coordinates'),
  status: infrastructureStatusEnum('status').notNull(),
  maintenance_required: boolean('maintenance_required').notNull().default(false),
  estimated_cost: numeric('estimated_cost', { precision: 12, scale: 2 }),
  reported_by: integer('reported_by').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Housing units table
export const housingUnitsTable = pgTable('housing_units', {
  id: serial('id').primaryKey(),
  unit_number: varchar('unit_number', { length: 50 }).notNull().unique(),
  address: text('address').notNull(),
  unit_type: varchar('unit_type', { length: 50 }).notNull(),
  size_sqm: numeric('size_sqm', { precision: 8, scale: 2 }).notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  occupancy_status: occupancyStatusEnum('occupancy_status').notNull().default('VACANT'),
  monthly_rent: numeric('monthly_rent', { precision: 10, scale: 2 }),
  owner_name: varchar('owner_name', { length: 100 }),
  owner_contact: varchar('owner_contact', { length: 100 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Publications table (news and announcements)
export const publicationsTable = pgTable('publications', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  type: publicationTypeEnum('type').notNull(),
  status: publicationStatusEnum('status').notNull().default('DRAFT'),
  featured: boolean('featured').notNull().default(false),
  author_id: integer('author_id').notNull(),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Media files table
export const mediaFilesTable = pgTable('media_files', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  original_name: varchar('original_name', { length: 255 }).notNull(),
  mime_type: varchar('mime_type', { length: 100 }).notNull(),
  file_size: integer('file_size').notNull(),
  file_path: text('file_path').notNull(),
  uploaded_by: integer('uploaded_by').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Work orders table
export const workOrdersTable = pgTable('work_orders', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  complaint_id: integer('complaint_id'),
  assigned_to: integer('assigned_to'),
  status: workOrderStatusEnum('status').notNull().default('PENDING'),
  priority: priorityEnum('priority').notNull().default('MEDIUM'),
  estimated_cost: numeric('estimated_cost', { precision: 12, scale: 2 }),
  actual_cost: numeric('actual_cost', { precision: 12, scale: 2 }),
  scheduled_date: timestamp('scheduled_date'),
  completed_date: timestamp('completed_date'),
  created_by: integer('created_by').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Audit logs table
export const auditLogsTable = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  entity_type: varchar('entity_type', { length: 50 }).notNull(),
  entity_id: integer('entity_id'),
  old_values: text('old_values'), // JSON string
  new_values: text('new_values'), // JSON string
  ip_address: varchar('ip_address', { length: 45 }),
  user_agent: text('user_agent'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// System settings table
export const systemSettingsTable = pgTable('system_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updated_by: integer('updated_by').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  assignedComplaints: many(complaintsTable),
  infrastructureReports: many(infrastructureReportsTable),
  publications: many(publicationsTable),
  uploadedFiles: many(mediaFilesTable),
  createdWorkOrders: many(workOrdersTable),
  assignedWorkOrders: many(workOrdersTable),
  auditLogs: many(auditLogsTable),
  systemSettingsUpdates: many(systemSettingsTable),
}));

export const complaintsRelations = relations(complaintsTable, ({ one, many }) => ({
  assignedUser: one(usersTable, {
    fields: [complaintsTable.assigned_to],
    references: [usersTable.id],
  }),
  workOrders: many(workOrdersTable),
}));

export const infrastructureReportsRelations = relations(infrastructureReportsTable, ({ one }) => ({
  reporter: one(usersTable, {
    fields: [infrastructureReportsTable.reported_by],
    references: [usersTable.id],
  }),
}));

export const publicationsRelations = relations(publicationsTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [publicationsTable.author_id],
    references: [usersTable.id],
  }),
}));

export const mediaFilesRelations = relations(mediaFilesTable, ({ one }) => ({
  uploader: one(usersTable, {
    fields: [mediaFilesTable.uploaded_by],
    references: [usersTable.id],
  }),
}));

export const workOrdersRelations = relations(workOrdersTable, ({ one }) => ({
  complaint: one(complaintsTable, {
    fields: [workOrdersTable.complaint_id],
    references: [complaintsTable.id],
  }),
  assignedUser: one(usersTable, {
    fields: [workOrdersTable.assigned_to],
    references: [usersTable.id],
  }),
  creator: one(usersTable, {
    fields: [workOrdersTable.created_by],
    references: [usersTable.id],
  }),
}));

export const auditLogsRelations = relations(auditLogsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [auditLogsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const systemSettingsRelations = relations(systemSettingsTable, ({ one }) => ({
  updater: one(usersTable, {
    fields: [systemSettingsTable.updated_by],
    references: [usersTable.id],
  }),
}));

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  complaints: complaintsTable,
  infrastructureReports: infrastructureReportsTable,
  housingUnits: housingUnitsTable,
  publications: publicationsTable,
  mediaFiles: mediaFilesTable,
  workOrders: workOrdersTable,
  auditLogs: auditLogsTable,
  systemSettings: systemSettingsTable,
};

// TypeScript types for the tables
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Complaint = typeof complaintsTable.$inferSelect;
export type NewComplaint = typeof complaintsTable.$inferInsert;

export type InfrastructureReport = typeof infrastructureReportsTable.$inferSelect;
export type NewInfrastructureReport = typeof infrastructureReportsTable.$inferInsert;

export type HousingUnit = typeof housingUnitsTable.$inferSelect;
export type NewHousingUnit = typeof housingUnitsTable.$inferInsert;

export type Publication = typeof publicationsTable.$inferSelect;
export type NewPublication = typeof publicationsTable.$inferInsert;

export type MediaFile = typeof mediaFilesTable.$inferSelect;
export type NewMediaFile = typeof mediaFilesTable.$inferInsert;

export type WorkOrder = typeof workOrdersTable.$inferSelect;
export type NewWorkOrder = typeof workOrdersTable.$inferInsert;

export type AuditLog = typeof auditLogsTable.$inferSelect;
export type NewAuditLog = typeof auditLogsTable.$inferInsert;

export type SystemSetting = typeof systemSettingsTable.$inferSelect;
export type NewSystemSetting = typeof systemSettingsTable.$inferInsert;