import express from 'express';

import { getBookByIdHandler, getBooksHandler, createBook, updateBook, deleteBook } from "./controllers/books.js";

import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from './controllers/authors.js';

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Retrieves all books from the MongoDB books collection.
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Successfully retrieved all books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: b1
 *                   authorId:
 *                     type: string
 *                     example: a1
 *                   title:
 *                     type: string
 *                     example: The Hobbit
 *                   publicationDate:
 *                     type: string
 *                     format: date
 *                     example: 1937-09-21
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieves a single book from MongoDB using its custom ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique custom identifier of the book.
 *         schema:
 *           type: string
 *           example: b1
 *     responses:
 *       200:
 *         description: Successfully retrieved the requested book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: b1
 *                 authorId:
 *                   type: string
 *                   example: a1
 *                 title:
 *                   type: string
 *                   example: The Hobbit
 *                 publicationDate:
 *                   type: string
 *                   format: date
 *                   example: 1937-09-21
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create a new author
 *     description: Adds a new author to the database.
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - authorName
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *                 example: a11
 *               authorName:
 *                 type: string
 *                 example: Isaac Asimov
 *               birthYear:
 *                 type: string
 *                 example: "1920"
 *     responses:
 *       201:
 *         description: Author successfully created.
 *       400:
 *         description: Invalid author data or duplicate ID.
 *       500:
 *         description: Unable to create author.
 */
router.post('/authors', createAuthor);
/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Retrieve all authors
 *     description: Returns an array of all authors in the database.
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Successfully retrieved authors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: a1
 *                   authorName:
 *                     type: string
 *                     example: J.R.R. Tolkien
 *                   birthYear:
 *                     type: string
 *                     example: "1892"
 *       500:
 *         description: Unable to retrieve authors.
 */
router.get('/authors', getAllAuthors);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Retrieve an author by ID
 *     description: Returns a single author using their custom ID.
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom author ID.
 *         schema:
 *           type: string
 *           example: a1
 *     responses:
 *       200:
 *         description: Successfully retrieved the author.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: a1
 *                 authorName:
 *                   type: string
 *                   example: J.R.R. Tolkien
 *                 birthYear:
 *                   type: string
 *                   example: "1892"
 *       404:
 *         description: Author not found.
 *       500:
 *         description: Unable to retrieve author.
 */
router.get('/authors/:id', getAuthorById);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an existing author
 *     description: Updates an author's name and birth year.
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom ID of the author to update.
 *         schema:
 *           type: string
 *           example: a11
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authorName
 *               - birthYear
 *             properties:
 *               authorName:
 *                 type: string
 *                 example: Isaac Asimov
 *               birthYear:
 *                 type: string
 *                 example: "1921"
 *     responses:
 *       200:
 *         description: Author successfully updated.
 *       400:
 *         description: Invalid author information.
 *       404:
 *         description: Author not found.
 *       500:
 *         description: Unable to update author.
 */
router.put('/authors/:id', updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author by ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author's unique ID
 *     responses:
 *       204:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 *       409:
 *         description: Author cannot be deleted because books reference them
 *       500:
 *         description: Internal server error
 */
router.delete('/authors/:id', deleteAuthor);


/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 *     description: Adds a new book to the database.
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - authorId
 *               - title
 *               - publicationDate
 *             properties:
 *               id:
 *                 type: string
 *                 example: b11
 *               authorId:
 *                 type: string
 *                 example: a11
 *               title:
 *                 type: string
 *                 example: "Book title"
 *               publicationDate:
 *                 type: string
 *                 example: "1920-10-09"
 *     responses:
 *       201:
 *         description: Book successfully created.
 *       400:
 *         description: Invalid book data or duplicate ID.
 *       500:
 *         description: Unable to create book.
 */
router.post('/books', createBook);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update an existing book
 *     description: Updates a book's authors reference, title, and publication date.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom ID of the book to update.
 *         schema:
 *           type: string
 *           example: b11
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authorId
 *               - title
 *               - publicationDate
 *             properties:
 *               authorId:
 *                 type: string
 *                 example: a11
 *               title:
 *                 type: string
 *                 example: "Book's title"
 *               publicationDate:
 *                 type: string
 *                 example: "1925-09-15"
 *     responses:
 *       200:
 *         description: book successfully updated.
 *       400:
 *         description: Invalid book information.
 *       404:
 *         description: book not found.
 *       500:
 *         description: Unable to update book.
 */
router.put('/books/:id', updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book's unique ID
 *     responses:
 *       204:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found *
 *       500:
 *         description: Internal server error
 */
router.delete('/books/:id', deleteBook);

































export default router;