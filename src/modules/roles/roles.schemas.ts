import { z } from "zod";
import { ALL_PERMISSIONS } from "../../config/permissions";
import { application } from '../../db/schema';
import zodToJsonSchema from "zod-to-json-schema";

export const createRoleBodySchema = z.object({
    name: z.string(),
    permissions: z.array(z.enum(ALL_PERMISSIONS)),
   // applicationId: z.string().uuid(),
});

export type CreateRoleBody = z.infer<typeof createRoleBodySchema>;

export const createrRoleJsonSchema = {
    body: zodToJsonSchema(createRoleBodySchema, 'createRoleBodySchema'),
}