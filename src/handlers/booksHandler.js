const {
    nanoid
} = require('nanoid'); // Menghasilkan ID unik
const books = []; // Array untuk menyimpan data buku

// Handler untuk menambahkan buku
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

    // Validasi input
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    // Tambahkan properti tambahan
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
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

    books.push(newBook);

    const isSuccess = books.some((book) => book.id === id);

    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500);
};

// Handler untuk menampilkan semua buku
const getAllBooksHandler = (request, h) => {

    const {
        reading,
        finished,
        name
    } = request.query;
    let filteredBooks = books;

    if (reading !== undefined) {
        const isReading = reading === '1'; // '1' artinya true, '0' artinya false
        filteredBooks = books.filter((book) => book.reading === isReading);
    }

    if (finished !== undefined) {
        const isFinished = finished === '1'; // '1' artinya true, '0' artinya false
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    const responseBooks = filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    return h.response({
        status: 'success',
        data: {
            books: responseBooks,
        },
    }).code(200);
};

const getBookByIdHandler = (request, h) => {
    const {
        bookId
    } = request.params;

    const book = books.find((b) => b.id === bookId);

    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: {
            book,
        },
    }).code(200);
};

const editBookByIdHandler = (request, h) => {
    const {
        bookId
    } = request.params;
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

    // Validasi input
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    const updatedAt = new Date().toISOString();
    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished: pageCount === readPage,
        updatedAt,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

const deleteBookByIdHandler = (request, h) => {
    const {
        bookId
    } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1); // Hapus buku dari array

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};