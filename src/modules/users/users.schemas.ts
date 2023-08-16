import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { application } from '../../db/schema';

const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string(),
    applicationId: z.string().uuid(),
    password: z.string().min(6),
    initialUser: z.boolean().optional()
})


export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const createUserJsonSchema = {
    body: zodToJsonSchema(createUserBodySchema, 'createUserBodySchema'),
}

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    applicationId: z.string().uuid(),
})

export type LoginBody = z.infer<typeof loginSchema>;

export const loginJsonSchema = {
    body: zodToJsonSchema(loginSchema, 'loginSchema'),
}


const assignRoleToUserBody = z.object({
    userId: z.string().uuid(),
    roleId: z.string().uuid()
})

export type AssignRoleToUserBody = z.infer<typeof assignRoleToUserBody>;

export const assignRoleToUserJsonSchema = {
    body: zodToJsonSchema(assignRoleToUserBody, 'assignRoleToUserBody'),
}