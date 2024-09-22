import { APP_NAME } from './configs.js';
import { nanoid } from 'nanoid';
import db from './db.js';

export default {
    getAllData: (req, h) => {
        const {
            name,
            reading,
            finished,
        } = req.query;

        const filteredData = [...db]
            .filter((i) =>
                (name ? i.name.toLowerCase().includes(name.toLowerCase()) : true) &&
                (reading ? i.reading == reading : true) &&
                (finished ? i.finished == finished : true)
            )
            .map(({ id, name, publisher }) => ({
                id,
                name,
                publisher,
            }));

        return h.response({
            application: APP_NAME,
            status: 'success',
            data: {
                books: filteredData,
            },
        }).code(200);
    },
    getData: (req, h) => {
        const { id } = req.params;
        const index = id ? db.findIndex(i => i.id === id) : -1;

        if (index < 0) {
            return h.response({
                application: APP_NAME,
                status: 'failed',
                message: 'Book not found!',
            }).code(404);
        }

        return h.response({
            application: APP_NAME,
            status: 'success',
            data: {
                book: db[index],
            },
        }).code(200);
    },
    createData: (req, h) => {
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = req.payload;

        if (!name) {
            return h.response({
                application: APP_NAME,
                status: 'failed',
                message: 'Error when adding book, please input book\'s name!',
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                application: APP_NAME,
                status: 'failed',
                message: 'Error when adding book, \'readPage\' cannot bigger than \'pageCount\'!',
            }).code(400);
        }

        const id = nanoid(16);
        const finished = (pageCount === readPage);
        const timestamp = new Date().toISOString();

        db.push({
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt: timestamp,
            updatedAt: timestamp,
        });

        return h.response({
            application: APP_NAME,
            status: 'success',
            message: 'Book added successfully.',
            data: {
                bookId: id,
            },
        }).code(201);
    },
    editData: (req, h) => {
        const { id } = req.params;
        const index = id ? db.findIndex(i => i.id === id) : -1;
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = req.payload;

        if (index < 0) {
            return h.response({
                application: APP_NAME,
                status: 'failed',
                message: 'Error when updating book, ID not found!',
            }).code(404);
        }

        if (!name) {
            return h.response({
                application: APP_NAME,
                status: 'failed',
                message: 'Error when updating book, please input book\'s name!',
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                application: APP_NAME,
                status: 'failed',
                message: 'Error when updating book, \'readPage\' cannot bigger than \'pageCount\'!',
            }).code(400);
        }

        const updatedBook = {
            ...db[index],
            name,
            year: year || db[index].year,
            author: author || db[index].author,
            summary: summary || db[index].summary,
            publisher: publisher || db[index].publisher,
            pageCount: pageCount || db[index].pageCount,
            readPage: readPage || db[index].readPage,
            reading: reading !== undefined ? reading : db[index].reading,
            finished: pageCount === readPage,
            updatedAt: new Date().toISOString(),
        };

        db[index] = updatedBook;

        return h.response({
            application: APP_NAME,
            status: 'success',
            message: 'Book updated successfully.',
        }).code(200);
    },
    deleteData: (req, h) => {
        const { id } = req.params;
        const index = id ? db.findIndex(i => i.id === id) : -1;

        if (index < 0) {
            return h.response({
                application: APP_NAME,
                status: 'failed',
                message: 'Error when deleting book, ID not found!',
            }).code(404);
        }

        db.splice(index, 1);

        return h.response({
            application: APP_NAME,
            status: 'success',
            message: 'Book deleted successfully.',
        }).code(200);
    },
}
