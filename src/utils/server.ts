import fastify from 'fastify';
import guard from 'fastify-guard';
import { applicationRoutes } from '../modules/applications/applications.routes';
import { usersRoutes } from '../modules/users/users.routes';
import { roleRoutes } from '../modules/roles/roles.routes';
import jwt from 'jsonwebtoken';
import { application } from '../db/schema';


type User = {
    id: string;
    scopes: string[];
    applicationId:string;
}

declare module 'fastify' {
    interface FastifyRequest {
        user: User;
    }
}

export async function createServer() {
    const app = fastify({
        logger: true,
    });

    app.decorateRequest('user', null);

    app.addHook('onRequest', async (request, reply) => {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return;
        }

        try {
            const token = authHeader.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'secret'); //TODO: change secret

            request.user = decoded as User;

        } catch (error) {
            
        }
            
    });

    //register plugins
    app.register(guard, {
        requestProperty: 'user',
        scopeProperty: 'scopes',
        errorHandler: (result, request, reply) => {
            return reply.status(403).send("you can not access this route");
        },
    });
    
    //register routes
    app.register(applicationRoutes, { prefix: '/api/applications'})
    app.register(usersRoutes, { prefix: '/api/users'})
    app.register(roleRoutes, { prefix: '/api/roles'})

    return app; 
}
