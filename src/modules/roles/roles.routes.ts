import { FastifyInstance } from "fastify";
import { createRole } from "./roles.services";
import { CreateRoleBody, createRoleBodySchema, createrRoleJsonSchema } from "./roles.schemas";
import { createRoleHandler } from "./roles.controllers";
import { PERMISSIONS } from "../../config/permissions";

export async function roleRoutes(app: FastifyInstance) {

    app.post<{Body: CreateRoleBody}>('/', {schema: createrRoleJsonSchema, preHandler: [app.guard.scope([PERMISSIONS["roles:write"]])]}, createRoleHandler)
}