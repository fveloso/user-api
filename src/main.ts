import {migrate} from 'drizzle-orm/node-postgres/migrator'
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { createServer } from "./utils/server"
import { db } from './db';

console.log("Hello World!")


async function gracefulShutdown ({app}: {app: Awaited<ReturnType<typeof createServer>>}) {
    logger.info("Graceful shutdown");

    await app.close();
}

    

async function main () {

    const app = await createServer();
    
    app.listen({
        port: env.PORT,
        host: env.HOST
    });

    await migrate(db, {
        migrationsFolder: "./migrations",
    });
    
    const signals = ['SIGINT', 'SIGTERM'];

    for(const signal of signals) {
        process.on(signal, () => gracefulShutdown({app}));
    }

}

main();