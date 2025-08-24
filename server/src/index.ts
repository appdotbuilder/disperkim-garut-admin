import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  updateUserInputSchema,
  createComplaintInputSchema,
  updateComplaintInputSchema,
  createInfrastructureReportInputSchema,
  createHousingUnitInputSchema,
  createPublicationInputSchema,
  createWorkOrderInputSchema,
  updateSystemSettingInputSchema,
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { updateUser } from './handlers/update_user';
import { createComplaint } from './handlers/create_complaint';
import { getComplaints } from './handlers/get_complaints';
import { updateComplaint } from './handlers/update_complaint';
import { createInfrastructureReport } from './handlers/create_infrastructure_report';
import { getInfrastructureReports } from './handlers/get_infrastructure_reports';
import { createHousingUnit } from './handlers/create_housing_unit';
import { getHousingUnits } from './handlers/get_housing_units';
import { createPublication } from './handlers/create_publication';
import { getPublications } from './handlers/get_publications';
import { createWorkOrder } from './handlers/create_work_order';
import { getWorkOrders } from './handlers/get_work_orders';
import { getAuditLogs } from './handlers/get_audit_logs';
import { getSystemSettings } from './handlers/get_system_settings';
import { updateSystemSetting } from './handlers/update_system_setting';
import { getDashboardStats } from './handlers/get_dashboard_stats';
import { uploadMediaFile, uploadMediaFileInputSchema } from './handlers/upload_media_file';
import { getMediaFiles } from './handlers/get_media_files';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Dashboard
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .query(() => getUsers()),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  // Complaint management
  createComplaint: publicProcedure
    .input(createComplaintInputSchema)
    .mutation(({ input }) => createComplaint(input)),
  
  getComplaints: publicProcedure
    .query(() => getComplaints()),
  
  updateComplaint: publicProcedure
    .input(updateComplaintInputSchema)
    .mutation(({ input }) => updateComplaint(input)),

  // Infrastructure reports
  createInfrastructureReport: publicProcedure
    .input(createInfrastructureReportInputSchema.extend({
      reported_by: z.number() // Add reported_by to input
    }))
    .mutation(({ input }) => createInfrastructureReport(input, input.reported_by)),
  
  getInfrastructureReports: publicProcedure
    .query(() => getInfrastructureReports()),

  // Housing units
  createHousingUnit: publicProcedure
    .input(createHousingUnitInputSchema)
    .mutation(({ input }) => createHousingUnit(input)),
  
  getHousingUnits: publicProcedure
    .query(() => getHousingUnits()),

  // Publications (News & Announcements)
  createPublication: publicProcedure
    .input(createPublicationInputSchema.extend({
      author_id: z.number() // Add author_id to input
    }))
    .mutation(({ input }) => createPublication(input, input.author_id)),
  
  getPublications: publicProcedure
    .query(() => getPublications()),

  // Work orders
  createWorkOrder: publicProcedure
    .input(createWorkOrderInputSchema.extend({
      created_by: z.number() // Add created_by to input
    }))
    .mutation(({ input }) => createWorkOrder(input, input.created_by)),
  
  getWorkOrders: publicProcedure
    .query(() => getWorkOrders()),

  // Media files
  uploadMediaFile: publicProcedure
    .input(uploadMediaFileInputSchema.extend({
      uploaded_by: z.number() // Add uploaded_by to input
    }))
    .mutation(({ input }) => uploadMediaFile(input, input.uploaded_by)),
  
  getMediaFiles: publicProcedure
    .query(() => getMediaFiles()),

  // System administration
  getAuditLogs: publicProcedure
    .query(() => getAuditLogs()),
  
  getSystemSettings: publicProcedure
    .query(() => getSystemSettings()),
  
  updateSystemSetting: publicProcedure
    .input(updateSystemSettingInputSchema.extend({
      updated_by: z.number() // Add updated_by to input
    }))
    .mutation(({ input }) => updateSystemSetting(input, input.updated_by)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
  console.log('Disperkim Garut Administration Portal API ready');
}

start();