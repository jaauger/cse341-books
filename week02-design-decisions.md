# Books API – Design Decisions and Future Considerations

This document preserves design discussions from planning Week 02. It is **not** a list of additional Week 02 assignment requirements. Use `spec-week02.md` as the implementation checklist for the assignment.

## Agreed architecture
- **Routes:** Map endpoints to controller handlers.
- **Controllers:** Validate incoming required fields/types and return HTTP status codes and JSON responses. Reject missing or whitespace-only required values before database work.
- **Models:** Perform database operations and check relationships, such as whether a book's `authorId` exists.
- **MongoDB:** Store documents and enforce uniqueness through unique indexes on `books.id` and `authors.id`.
- Keep application-defined `id` values separate from MongoDB `_id` values. Author records use `id`; books use `authorId` to reference that `id`.
- Treat IDs as immutable: PUT updates editable fields but does not rename a book or author ID.

## Data integrity
- An author cannot be deleted while any books reference that author. Books must be deleted or reassigned first.
- Prefer `409 Conflict` when an author deletion is blocked by references; `404` when the requested author does not exist; `204` for a successful deletion.
- A missing author reference during book creation/update is a client validation failure (`400`).
- Database-level unique indexes are safer than a pre-insert existence check, because simultaneous requests can otherwise both pass a check. Handle MongoDB duplicate-key error code `11000`.
- A standard index on `books.authorId` helps find books referencing an author.
- A model-level check for related books followed by deletion is **not fully race-safe** if concurrent book creation is possible. Stronger integrity guarantees are a future consideration.

## Error handling
- `200` successful reads/updates; `201` successful creates; `204` successful deletions (no body); `400` invalid input/references; `404` missing resource; `500` unexpected server/database failure.
- The instructor's provided Week 02 book issue uses `400` for duplicate IDs. The streamlined spec follows that convention. In a future API, `409 Conflict` could be used for duplicate IDs; do not change assignment expectations without checking.
- Prefer consistent error JSON, such as `{ "message": "Book not found" }`.
- Log unexpected errors on the server but return a generic message to clients. Do not expose credentials, internal paths, or database error details.
- A `404` on deletion can help a UI refresh a stale author list. Returning `204` for an already-missing resource is an alternative API convention, but the assignment spec uses `404`.

## Validation and API contracts
- Check field presence, types, empty/whitespace-only values, and ideally unexpected fields and length limits.
- Consider specifying `publicationDate` as a valid `YYYY-MM-DD` date and `birthYear` as a four-digit string; merely declaring a string does not validate its meaning.
- Prefer full editable-field replacement with PUT, with no ID change. PATCH could support partial updates later.
- Decide consistently whether API responses expose MongoDB `_id`; application-defined fields are sufficient for the assignment.
- Swagger examples and documented error responses should match actual controller behavior.

## Security
- Keep `MONGODB_URI` in environment variables. Exclude `.env` from Git; configure deployment secrets in Render.
- Explicitly select permitted insert/update fields instead of writing arbitrary request bodies to MongoDB.
- Authentication and authorization for write endpoints are **not part of the provided Week 02 assignment**. Public write endpoints are unsafe for real data; use only non-sensitive educational test data.
- Consider rate limiting and least-privilege database credentials for a production deployment.

## Existing Week 01 data
- Week 01 books have an `author` string rather than `authorId`. Week 02 requires book responses to include valid author references.
- Preserve existing book IDs and other information. Establish author documents and convert old book references as needed.
- Do **not** assume the migration must be manual. A migration script or another implementation approach can be selected when coding begins.
- Implementing authors before dependent book validation may make testing easier, even though the assignment instructs creating the book GitHub issue first.

## Efficiency and future improvements
- GET collection endpoints return all documents for the small assignment dataset; pagination can be added later.
- Index author IDs and book author references for efficient lookups.
- **Optimistic concurrency control:** version fields and atomic conditional updates can prevent one user's stale PUT from overwriting another user's changes. Defer to a later iteration.
- Consider audit logging, filtering/search, role-based authorization, and stronger cross-collection concurrency guarantees later.

## Assignment workflow
1. Finalize `spec-week02.md`.
2. Create the two required GitHub issues with Description, Spec, and Test Plan.
3. Include Swagger and local/Render testing in both issues.
4. Implement and resolve issues through corresponding pull requests when instructed.
