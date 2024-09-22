import { APP_NAME } from './configs.js';
import c from './controller.js';

export default [
    {
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return h.response({
                application: APP_NAME,
                message: 'Application is healthy.',
            }).code(200);
        },
    },
    {
        method: 'GET',
        path: '/books',
        handler: c.getAllData,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: c.getData,
    },
    {
        method: 'POST',
        path: '/books',
        handler: c.createData,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: c.editData,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: c.deleteData,
    },
];
