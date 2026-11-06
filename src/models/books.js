import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne({ id: bookId });
    return book;
}

const createBook = async (bookData) => {
  const db = getDb();
  const collection = db.collection('books');

  const result = await collection.insertOne(bookData);

  return result;
};

const updateBook = async (id, bookData) => {
  const db = getDb();
  const collection = db.collection('books');

  const result = await collection.updateOne(
    { id },
    { $set: bookData }
  );

  return result;
};

const deleteBook = async (id) => {
  const db = getDb();
  const collection = db.collection('books');

  const result = await collection.deleteOne({ id });

  return result;
};

const bookHasAuthor = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');

  const author = await collection.findOne({ id: authorId });

  return author !== null;
};


export { getAllBooks, getBookById,
         createBook, updateBook,
         deleteBook, bookHasAuthor
  };