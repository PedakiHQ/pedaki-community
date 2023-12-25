import { z } from 'zod';

export const SelfHostWorkspacePropertiesSchema = z.object({
  name: z.string().max(50),
  logoUrl: z.string().url().max(1024),
  defaultLanguage: z.enum(['en', 'fr']),
});

export const HostedWorkspacePropertiesSchema = z.object({});

export const WorkspacePropertiesSchema = SelfHostWorkspacePropertiesSchema.merge(
  HostedWorkspacePropertiesSchema,
);
export type WorkspaceProperties = z.infer<typeof WorkspacePropertiesSchema>;
