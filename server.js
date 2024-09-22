import { APP_HOST, APP_PORT } from './configs.js';
import Hapi from '@hapi/hapi';
import routes from './routes.js';

async function initServer() {
    const server = Hapi.server({
        host: APP_HOST,
        port: APP_PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);
    server.ext('onPreResponse', (req, h) => {
        if (req.response.isBoom && req.response.output.statusCode === 404) {
            return h.response({
                status: 'failed',
                message: 'Route not found!',
            }).code(404);
        }

        return h.continue;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (e) => {
    console.log(e);
    process.exit(1);
});

initServer();
