import { getAllBooks as getAllBooksFromDb,
         getBookById as getBookByIdFromDb,
         createBook as createBookInDb,
         updateBook as updateBookInDb,
         deleteBook as deleteBookFromDb,
         bookHasAuthor
 } from "../models/books.js";

const getBooksHandler = async (req, res) => {
    try {
      const books = await getAllBooksFromDb();
      return res.status(200).json(books);
    } catch (error) {
      console.error('GET /books failed:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    try {
      const book = await getBookByIdFromDb(req.params.id);

      if (!book) {
      return res.status(404).json({ message: 'Book not found' });
      }

      return res.status(200).json(book);
    } catch (error) {
      console.error('GET /book failed:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
}

const createBook = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    if (
      typeof id !== 'string' ||
      typeof authorId !== 'string' ||
      typeof title !== 'string' ||
      typeof publicationDate !== 'string' ||
      !id.trim() ||
      !authorId.trim() ||
      !title.trim() ||
      !publicationDate.trim()
    ) {
      return res.status(400).json({
        message: 'All book fields must be non-empty strings.'
      });
    }

  const existingBook = await getBookByIdFromDb(id.trim());

  if (existingBook) {
    return res.status(400).json({
      message: 'A book with this ID already exists.'
    });
  }
  const bookData = {
    id: id.trim(),
    authorId: authorId.trim(),
    title: title.trim(),
    publicationDate: publicationDate.trim()
  };

  const hasAuthor = await bookHasAuthor(bookData.authorId);

  if (!hasAuthor) {
    return res.status(400).json({
      message: 'The specified author does not exist.'
    });
  }

  const result = await createBookInDb(bookData);

  return res.status(201).json({
    ...bookData,
    _id: result.insertedId
  });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A book with this ID already exists.'
      });
    }

    return res.status(500).json({
      message: 'Unable to create book.'
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body;

    if (
      typeof authorId !== 'string' ||
      typeof title !== 'string' ||
      typeof publicationDate !== 'string' ||
      !authorId.trim() ||
      !title.trim() ||
      !publicationDate.trim()
    ) {
      return res.status(400).json({
        message: 'All book fields must be non-empty strings.'
      });
    }

    const bookData = {
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate: publicationDate.trim()
    };

    const hasAuthor = await bookHasAuthor(bookData.authorId);

    if (!hasAuthor) {
      return res.status(400).json({
        message: 'The specified author does not exist.'
      });
    }

    const result = await updateBookInDb(id, bookData);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Book not found.'
      });
    }

    return res.status(200).json({
      id,
      ...bookData
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Unable to update book.'
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await getBookByIdFromDb(id);

    if (!existingBook) {
      return res.status(404).json({
        message: 'Book not found.'
      });
    }

    const result = await deleteBookFromDb(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Book not found.'
      });
    }

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({
      message: 'Unable to delete book.'
    });
  }

};

export { getBooksHandler, getBookByIdHandler,
         createBook, updateBook,
         deleteBook
 };