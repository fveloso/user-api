import { FastifyReply, FastifyRequest } from "fastify";
import { AssignRoleToUserBody, CreateUserBody, LoginBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import { application, users } from '../../db/schema';
import { assignRoleToUser, createUser, getUserByApplication, getUserByEmail } from "./users.services";
import jwt from 'jsonwebtoken';
import { logger } from "../../utils/logger";


export async function createUserHandler(req: FastifyRequest<{Body: CreateUserBody}>, reply: FastifyReply) {
  const {initialUser, ...data} = req.body;

  const roleName = initialUser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER;



  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
   const appUsers = await getUserByApplication(data.applicationId);

   if (appUsers.length > 0) {
     return reply.code(400).send({message: 'Application already has a super admin', extensions: {
        code: 'APPLICATION_ALREADY_HAS_SUPER_ADMIN',
        applicationId: data.applicationId
     }});
   }
  }

  const role = await getRoleByName(roleName, data.applicationId);

  if (!role) {
    return reply.code(400).send({message: 'Role not found', extensions: {
        code: 'ROLE_NOT_FOUND',
        roleName
      }});
  }

  try {
      const user = await createUser(data);
    
      //assign role to user
      await assignRoleToUser({userId: user.id, roleId: role.id, applicationId: data.applicationId});

      return user;
  } catch (error) {
    
  }
}


export async function loginHandler(req: FastifyRequest<{Body: LoginBody}>, reply: FastifyReply) {
  const {applicationId, email, password} = req.body;

  const user = await getUserByEmail({email, applicationId});

  if (!user) {
    return reply.code(400).send({message: 'Invalid email or password', extensions: {
      code: 'INVALID_USERNAME_OR_PASSWORD',
      email
    }});
  }

  const token = jwt.sign({id : user.id, email, applicationId, scopes: user.permissions}, 'secret'); //TODO: change secret

  return {
    token
  };
}


export async function assignRoleToUserHandler(req: FastifyRequest<{Body: AssignRoleToUserBody}>, rep: FastifyReply) {
    const {userId, roleId} = req.body;

    const applicationId = req.user.applicationId;

    try {
        const result = await assignRoleToUser({userId, roleId, applicationId});
        
        return result;
    } catch (e) {
       logger.error(e, 'Error assigning role to user');   

       return rep.code(500).send({message: 'Error assigning role to user', extensions: {
            code: 'ERROR_ASSIGNING_ROLE_TO_USER'
        }});
    }
}