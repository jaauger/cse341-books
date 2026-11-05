
import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks
} from '../models/authors.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve authors.'
    });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorByIdFromDb(id);

    if (!author) {
      return res.status(404).json({
        message: 'Author not found.'
      });
    }

    return res.status(200).json(author);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve author.'
    });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { id, authorName, birthYear } = req.body;

    if (
      typeof id !== 'string' ||
      typeof authorName !== 'string' ||
      typeof birthYear !== 'string' ||
      !id.trim() ||
      !authorName.trim() ||
      !birthYear.trim()
    ) {
      return res.status(400).json({
        message: 'All author fields must be non-empty strings.'
      });
    }

  const existingAuthor = await getAuthorByIdFromDb(id.trim());

  if (existingAuthor) {
    return res.status(400).json({
      message: 'An author with this ID already exists.'
    });
  }
  const authorData = {
    id: id.trim(),
    authorName: authorName.trim(),
    birthYear: birthYear.trim()
  };
  
  const result = await createAuthorInDb(authorData);
  
  return res.status(201).json({
    ...authorData,
    _id: result.insertedId
  });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'An author with this ID already exists.'
      });
    }
  
    return res.status(500).json({
      message: 'Unable to create author.'
    });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorName, birthYear } = req.body;

    if (
      typeof authorName !== 'string' ||
      typeof birthYear !== 'string' ||
      !authorName.trim() ||
      !birthYear.trim()
    ) {
      return res.status(400).json({
        message: 'All author fields must be non-empty strings.'
      });
    }

    const authorData = {
      authorName: authorName.trim(),
      birthYear: birthYear.trim()
    };

    const result = await updateAuthorInDb(id, authorData);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Author not found.'
      });
    }

    return res.status(200).json({
      id,
      ...authorData
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Unable to update author.'
    });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAuthor = await getAuthorByIdFromDb(id);

    if (!existingAuthor) {
      return res.status(404).json({
        message: 'Author not found.'
      });
    }

    const hasBooks = await authorHasBooks(id);

    if (hasBooks) {
      return res.status(409).json({
        message: 'Cannot delete author while books reference this author.'
      });
    }

    const result = await deleteAuthorFromDb(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Author not found.'
      });
    }

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({
      message: 'Unable to delete author.'
    });
  }
  
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };