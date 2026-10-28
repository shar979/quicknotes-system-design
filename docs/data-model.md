QuickNotes Data Model

## Entities & Schema

1. **`users`**: Stores user account credentials.
   - `id` (INT, PK), `username` (VARCHAR, UNIQUE), `email` (VARCHAR, UNIQUE), `created_at` (TIMESTAMP).
2. **`notes`**: Stores note content.
   - `id` (INT, PK), `user_id` (INT, FK -> `users.id`), `title` (VARCHAR 100), `body` (TEXT), `created_at` (TIMESTAMP).
3. **`tags`**: Stores category tags.
   - `id` (INT, PK), `name` (VARCHAR 50, UNIQUE).
4. **`note_tags`**: Join table bridging notes and tags.
   - `note_id` (INT, FK -> `notes.id`), `tag_id` (INT, FK -> `tags.id`), PRIMARY KEY (`note_id`, `tag_id`).

## Relationships
- **Users to Notes (One-to-Many):** One user can author many notes, but each note belongs to a single user.
- **Notes and Tags (Many-to-Many):** A note can have multiple tags, and a tag can be applied to many notes. Resolved via the `note_tags` junction table.

## CREATE TABLE Statements
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

##List all notes for a specific user
SELECT id, title, body, created_at FROM notes WHERE user_id = 109 ORDER BY created_at DESC;

##count notes per user
SELECT user_id, COUNT(*) AS note_count FROM notes GROUP BY user_id;

##JOIN QUERY
SELECT n.title, t.name AS tag_name 
FROM notes n
JOIN note_tags nt ON n.id = nt.note_id
JOIN tags t ON t.id = nt.tag_id
WHERE n.user_id = 109;

##SQL vs. NoSQL Justification
A relational database (SQL) is chosen because QuickNotes relies heavily on structured relationships (users, notes, tags), foreign key integrity checks, and precise relational filtering. ACID guarantees are essential when storing user-generated text content and tags to prevent data corruption.