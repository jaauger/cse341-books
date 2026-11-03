import express from 'express';

import { getBookByIdHandler, getBooksHandler } from "./controllers/books.js";

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
 *                   author:
 *                     type: string
 *                     example: J.R.R. Tolkien
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
 *                 author:
 *                   type: string
 *                   example: J.R.R. Tolkien
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

export default router;