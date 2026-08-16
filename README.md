# Task API - Full Stack Developer Intern Assignment

A RESTful Task Management API built using **Node.js** and **Express.js**.

This project was developed as part of a Full Stack Developer Intern assignment. The goal was to understand an existing backend codebase, write comprehensive tests, identify and fix bugs, and implement a new API feature.

---

# Features

## Task Management APIs

The API supports:

- Create tasks
- Fetch all tasks
- Filter tasks by status
- Pagination support
- Update tasks
- Delete tasks
- Mark tasks as completed
- View task statistics
- Assign tasks to users

---

# Tech Stack

## Backend

- Node.js
- Express.js

## Testing

- Jest
- Supertest

## Development Tools

- npm
- Git

---

# Project Structure

```
task-api/
│
├── src/
│   │
│   ├── app.js                 # Express application setup
│   │
│   ├── routes/
│   │   └── tasks.js           # Task API routes
│   │
│   ├── services/
│   │   └── taskService.js     # Business logic layer
│   │
│   └── utils/
│       └── validators.js      # Request validation functions
│
├── tests/
│   ├── taskService.test.js    # Unit tests
│   └── tasks.test.js          # API integration tests
│
├── BUG_REPORT.md              # Bugs discovered and fixes
├── package.json
└── README.md
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd task-api
```

Install dependencies:

```bash
npm install
```

---

# Running the Application

Start the server:

```bash
npm start
```

The API will run on:

```
http://localhost:3000
```

---

# Running Tests

Run all tests:

```bash
npm test
```

The project includes:

- Unit tests for service functions
- Integration tests for API routes using Supertest

---

# Test Coverage

Generate coverage report:

```bash
npm run coverage
```

Current coverage achieved:

```
Statements: 85%+
Lines: 84%+
Functions: 90%+
```

---

# API Documentation

Base URL:

```
http://localhost:3000/tasks
```

---

# 1. Create Task

## POST `/tasks`

Creates a new task.

### Request Body

```json
{
  "title": "Complete assignment",
  "description": "Finish API implementation",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-08-20"
}
```

### Response

```json
{
  "id": "task-id",
  "title": "Complete assignment",
  "description": "Finish API implementation",
  "priority": "high",
  "status": "todo"
}
```

---

# 2. Get All Tasks

## GET `/tasks`

Returns all tasks.

Example:

```
GET /tasks
```

---

# 3. Filter Tasks By Status

## GET `/tasks?status=<status>`

Example:

```
GET /tasks?status=done
```

Supported statuses:

```
todo
in_progress
done
```

---

# 4. Pagination

## GET `/tasks?page=<page>&limit=<limit>`

Example:

```
GET /tasks?page=1&limit=10
```

Pagination handles invalid values safely by applying default values.

---

# 5. Get Task Statistics

## GET `/tasks/stats`

Returns task statistics.

Example response:

```json
{
  "todo": 5,
  "in_progress": 2,
  "done": 3,
  "overdue": 1
}
```

---

# 6. Update Task

## PUT `/tasks/:id`

Updates an existing task.

Example:

```
PUT /tasks/task-id
```

Request:

```json
{
  "priority": "high"
}
```

---

# 7. Delete Task

## DELETE `/tasks/:id`

Deletes a task.

Example:

```
DELETE /tasks/task-id
```

Response:

```
204 No Content
```

---

# 8. Complete Task

## PATCH `/tasks/:id/complete`

Marks a task as completed.

Example:

```
PATCH /tasks/task-id/complete
```

Response:

```json
{
  "status": "done",
  "completedAt": "timestamp"
}
```

---

# 9. Assign Task

## PATCH `/tasks/:id/assign`

Assigns a task to a user.

### Request

```
PATCH /tasks/task-id/assign
```

Body:

```json
{
  "assignee": "Shaun"
}
```

### Response

```json
{
  "id": "task-id",
  "title": "Complete assignment",
  "assignee": "Shaun"
}
```

### Validation

- Assignee must be a non-empty string.
- Returns `400 Bad Request` for invalid input.
- Returns `404 Not Found` if the task does not exist.
- Existing assignments can be overwritten to support reassignment.

---

# Testing Approach

The project follows two levels of testing:

## Unit Testing

Tests the service layer directly.

Covered:

- Task creation
- Task retrieval
- Task update
- Task deletion
- Status filtering
- Pagination
- Completing tasks

---

## Integration Testing

Tests complete API flows using Supertest.

Covered:

- API request handling
- Route behavior
- Validation errors
- Missing resource handling
- Assign task feature

---

# Bugs Identified and Fixed

## 1. Pagination Edge Case

### Issue

Invalid page and limit values could produce incorrect offsets.

Example:

```
page = 0
limit = 10
```

could result in negative offset calculation.

### Fix

Added validation and safe defaults before calculating pagination offsets.

---

## 2. Incorrect Status Filtering

### Issue

Status filtering used partial matching:

```javascript
status.includes(value)
```

which could return unintended results.

### Fix

Changed filtering to exact matching:

```javascript
task.status === status
```

---

# Design Decisions

## In-memory Storage

The project currently uses an in-memory array for storing tasks.

Advantages:

- Simple implementation
- Easy testing
- No external database dependency

Note:

Data will reset whenever the server restarts.

---

## Error Handling

The API handles:

- Validation errors (`400`)
- Missing resources (`404`)
- Unexpected server errors (`500`)

---

# Future Improvements

Possible enhancements:

- Add database persistence using PostgreSQL/MongoDB
- Add authentication and authorization
- Add user management
- Add API documentation using Swagger/OpenAPI
- Add Docker support
- Add CI/CD pipeline

