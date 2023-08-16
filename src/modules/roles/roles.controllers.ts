import { FastifyRegister, FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleBody } from "./roles.schemas";
import { createRole } from "./roles.services";

export async function createRoleHandler(req: FastifyRequest<{Body: CreateRoleBody}>, res: FastifyReply) {
  const { name, permissions } = req.body;

  const user = req.user;
    const applicationId = user.applicationId;

  const role = await createRole({ name, permissions, applicationId });

  return role;
}