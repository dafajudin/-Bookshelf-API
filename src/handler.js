// handler.js
const { nanoid } = require('nanoid');
const buku = require('./items');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
            const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            })
            .code(400);
            return response;
        }

        if (readPage > pageCount) {
            const response = h
            .response({
                status: 'fail',
                message:
                'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
            return response;
        }

        const id = nanoid(16);
        const finished = pageCount === readPage;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const newItem = {
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
            insertedAt,
            updatedAt,
        };

        buku.push(newItem);

        const isSuccess = buku.filter((book) => book.id === id).length > 0;

        if (isSuccess) {
            const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            })
            .code(201);
            return response;
        }

        const response = h
            .response({
                status: 'fail',
                message: 'Buku gagal ditambahkan',
            })
            .code(500);
        return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    // Terdapat query name
    if (name) {
            const filteredBooksName = buku.filter((book) => {
            const nameRegex = new RegExp(name, 'gi');
            return nameRegex.test(book.name);
        });

        const response = h
        .response({
            status: 'success',
            data: {
                books: filteredBooksName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        .code(200);

        return response;
    }

    // Terdapat query reading
    if (reading) {
        const filteredBooksReading = buku.filter(
            (book) => Number(book.reading) === Number(reading),
        );

        const response = h
        .response({
            status: 'success',
            data: {
                book: filteredBooksReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        .code(200);

        return response;
    }

    // Terdapat query finished
    if (finished) {
        const filteredBooksFinished = buku.filter(
        (book) => Number(book.finished) === Number(finished),
        );

        const response = h
        .response({
            status: 'success',
            data: {
            books: filteredBooksFinished.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
            },
        })
        .code(200);

        return response;
    }

    // Tidak terdapat query apapun
    const response = h
        .response({
        status: 'success',
        data: {
                books: buku.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
        })
        .code(200);

    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = buku.filter((note) => note.id === bookId)[0];

    // Jika buku dengan id yang dicari ditemukan
    if (book) {
        const response = h
        .response({
            status: 'success',
            data: {
                book,
            },
        })
        .code(200);
        return response;
    }

    // Jika buku dengan id yang dicari tidak ditemukan
    const response = h
        .response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        })
        .code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    // Tidak terdapat properti name pada request body
    if (!name) {
        const response = h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
        return response;
    }

    // Nilai properti readPage lebih besar dari pageCount pada request body
    if (readPage > pageCount) {
        const response = h
        .response({
            status: 'fail',
            message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    const index = buku.findIndex((book) => book.id === bookId);

    // Jika book dengan id yang dicari ditemukan
    if (index !== -1) {
        buku[index] = {
        ...buku[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
        };

        const response = h
        .response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        })
        .code(200);
        return response;
    }

    // Jika book dengan id yang dicari tidak ditemukan
    const response = h
        .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = buku.findIndex((book) => book.id === bookId);

    // Jika book dengan id yang dicari ditemukan
    if (index !== -1) {
        buku.splice(index, 1);

        const response = h
        .response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        })
        .code(200);
        return response;
    }

    // Jika book dengan id yang dicari tidak ditemukan
    const response = h
        .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
