const cluster = require('cluster');
import { cpus } from 'os';
import { Injectable, Logger } from '@nestjs/common';

const numCPUs = cpus().length;

@Injectable()
export class AppClusterService {

    static clusterize(STAGE:string, callback: Function): void {
        const logger = new Logger();
        const port = process.env.PORT || 3000;
        if (cluster.isPrimary) {
            logger.log(`Master server started on ${process.pid}`);
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            cluster.on('exit', (worker, code, signal) => {
                logger.log(`Worker ${worker.process.pid} died. Restarting`);
                cluster.fork();
            })
        } else {
            logger.log(`Cluster server started on ${process.pid}`)
            callback();
        }
    }
}