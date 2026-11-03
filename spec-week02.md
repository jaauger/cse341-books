# Books API Week 02 Spec – Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so books reference authors and support all CRUD operations. Document and test every route in Swagger.

### Data Model
Books are stored in the `books` collection. Required fields:
- `id`: string, required, custom ID such as `b1`
- `authorId`: string, required, references an existing author's `id`
- `title`: string, required
- `publicationDate`: string, required

Route parameters use custom string IDs, not MongoDB `_id` values. Existing Week 01 book records must be updated to include valid `authorId` references while preserving their other information; the implementation method is not prescribed.

### Relationship to Authors
Before creating or updating a book, verify that its `authorId` matches an existing document in `authors`. Return `400` for an invalid author reference.

### Routes

#### GET /books
- `200`: Array of book objects, including `authorId`
- `500`: Unexpected server/database error

#### GET /books/:id
- `200`: Matching book object, including `authorId`
- `404`: Book not found
- `500`: Unexpected server/database error

#### POST /books
Request body:
```json
{
  "id": "b11",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```
- `201`: Newly created book object
- `400`: Missing or invalid required fields, duplicate custom ID, or nonexistent `authorId`
- `500`: Unexpected server/database error

#### PUT /books/:id
Request body:
```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```
- `200`: Updated book object
- `400`: Missing or invalid required fields or nonexistent `authorId`
- `404`: Book not found
- `500`: Unexpected server/database error

The book ID comes from the URL and is not changed by PUT.

#### DELETE /books/:id
- `204`: Book deleted; no response body
- `404`: Book not found
- `500`: Unexpected server/database error

### Swagger Documentation
Document all five book routes, their request bodies, parameters, responses, and status codes in Swagger.

### Deployment Expectations
All book routes must work locally and in the deployed Render application. The `/api-docs` page must allow testing of every book route in both environments.

---

## Feature 2: Author CRUD Operations

### Goal
Create an `authors` collection and implement all author CRUD operations. Prevent deletion of authors referenced by books. Document and test every route in Swagger.

### Data Model
Authors are stored in the `authors` collection. Required fields:
- `id`: string, required, custom ID such as `a1`
- `authorName`: string, required
- `birthYear`: string, required

Route parameters use custom string IDs, not MongoDB `_id` values. An author's `id` is the value referenced by `books.authorId`.

### Relationship to Books
An author cannot be deleted while any book has an `authorId` matching the author's `id`. The associated books must be deleted or reassigned first. Return `409 Conflict` if deletion is blocked by existing book references.

### Routes

#### GET /authors
- `200`: Array of author objects
- `500`: Unexpected server/database error

#### GET /authors/:id
- `200`: Matching author object
- `404`: Author not found
- `500`: Unexpected server/database error

#### POST /authors
Request body:
```json
{
  "id": "a1",
  "authorName": "J.R.R. Tolkien",
  "birthYear": "1892"
}
```
- `201`: Newly created author object
- `400`: Missing or invalid required fields or duplicate custom ID
- `500`: Unexpected server/database error

#### PUT /authors/:id
Request body:
```json
{
  "authorName": "Updated Author Name",
  "birthYear": "1892"
}
```
- `200`: Updated author object
- `400`: Missing or invalid required fields
- `404`: Author not found
- `500`: Unexpected server/database error

The author ID comes from the URL and is not changed by PUT.

#### DELETE /authors/:id
- `204`: Author deleted; no response body
- `404`: Author not found
- `409`: Author cannot be deleted because books reference it
- `500`: Unexpected server/database error

Example `409` response:
```json
{
  "message": "Cannot delete author while books reference this author."
}
```

### Swagger Documentation
Document all five author routes, their request bodies, parameters, responses, and status codes in Swagger.

### Deployment Expectations
All author routes must work locally and in the deployed Render application. The `/api-docs` page must allow testing of every author route in both environments.
