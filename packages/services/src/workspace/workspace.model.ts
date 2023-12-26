import { z } from 'zod';

export const SelfHostWorkspacePropertiesSchema = z.object({
  name: z.string().max(30).nonempty(),
  defaultLanguage: z.enum(['en', 'fr']),
});

export const HostedWorkspacePropertiesSchema = z.object({
  contactEmail: z.string().email().nullable(),
  contactName: z.string().max(128).nullable(),
  currentMaintenanceWindow: z.string().nullable(),
  maintenanceWindow: z.string().nullable(),
});

export const WorkspacePropertiesSchema = SelfHostWorkspacePropertiesSchema.merge(
  HostedWorkspacePropertiesSchema,
);
export type WorkspaceProperties = z.infer<typeof WorkspacePropertiesSchema>;
