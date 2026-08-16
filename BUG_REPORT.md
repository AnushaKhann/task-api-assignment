# Bug Report

## Overview

During testing of the Task API, I reviewed the existing implementation, wrote unit tests for the service layer, and integration tests for API routes using Supertest.

The following issues were identified:

1. Pagination handling with invalid parameters
2. Incorrect status filtering due to partial matching
3. Inconsistency in documented status values

---

# Bug 1: Pagination Handling with Invalid Page and Limit Values

## Location

`src/services/taskService.js`

## Description

The pagination logic did not properly handle invalid `page` and `limit` values.

Original implementation:

```javascript
const getPaginated = (page, limit) => {
  const offset = (page - 1) * limit;
  return tasks.slice(offset, offset + limit);
};

Invalid values such as:

```
page = 0
page = -1
limit = 0
```

could result in incorrect offset calculation and unexpected results because JavaScript `Array.slice()` supports negative indexes.

---

## Expected Behavior

The API should handle invalid pagination values safely.

- Page numbers should start from `1`.
- Limit should always be a positive number.
- Invalid values should not produce incorrect task results.

---

## Actual Behavior

Invalid pagination values could generate incorrect offsets.

Example:

```
page = 0
limit = 10
```

Calculation:

```javascript
offset = (0 - 1) * 10

offset = -10
```

This could cause unexpected results while fetching tasks.

---

## How It Was Discovered

This issue was discovered while writing unit tests for the `getPaginated()` function in `taskService.js`.

An edge-case test with invalid pagination values exposed the incorrect behavior.

---

## Fix Implemented

Pagination input values were validated before calculating the offset.

Updated implementation:

```javascript
const getPaginated = (page, limit) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const offset = (page - 1) * limit;

  return tasks.slice(offset, offset + limit);
};
```

---

# Bug 2: Incorrect Status Filtering Using Partial Matching

## Location

`src/services/taskService.js`

## Description

The original implementation used `includes()` while filtering tasks by status.

Original code:

```javascript
const getByStatus = (status) =>
  tasks.filter((t) => t.status.includes(status));
```

Using `includes()` allowed partial matches instead of exact status matching.

Example:

```javascript
getByStatus("in")
```

could incorrectly match:

```
in_progress
```

even though `"in"` is not a valid complete status.

---

## Expected Behavior

The API should return only tasks whose status exactly matches the requested status.

Example:

Request:

```
GET /tasks?status=done
```

should return only tasks where:

```javascript
task.status === "done"
```

---

## Actual Behavior

Partial values could return unintended tasks because `includes()` checks whether the given value exists anywhere inside the status string.

---

## How It Was Discovered

This issue was discovered while writing unit tests for the `getByStatus()` service function and reviewing the filtering logic.

---

## Fix Implemented

Changed the filtering condition from partial matching to exact matching.

Updated implementation:

```javascript
const getByStatus = (status) =>
  tasks.filter((t) => t.status === status);
```

---

# Bug 3: Inconsistent Task Status Values in Documentation

## Location

Project documentation

## Description

Different documentation sources used different task status values.

One source mentioned:

```
pending
in-progress
completed
```

while the current implementation uses:

```
todo
in_progress
done
```

---

## Expected Behavior

Documentation and implementation should follow a single consistent status contract so API consumers know which values are accepted.

---

## Actual Behavior

Different status naming conventions may cause clients to send invalid values and receive validation errors.

---

## How It Was Discovered

This was identified while comparing the API documentation with the validation logic implemented in `validators.js`.

---

## Recommended Fix

Use one consistent status convention across:

- API documentation
- validation logic
- frontend/client usage

The current implementation follows:

```
todo
in_progress
done
```

---

# Additional Feature Implemented

# PATCH `/tasks/:id/assign`

## Description

Added a new endpoint to assign a task to a user.

---

## Request

```
PATCH /tasks/:id/assign
```

Body:

```json
{
  "assignee": "Anusha"
}
```

---

## Expected Behavior

The endpoint should:

- Accept an assignee name.
- Store the assignee on the task object.
- Return the updated task.
- Return `404` if the task does not exist.
- Return `400` if assignee is empty or invalid.

---

## Implementation

Added:

- `validateAssignTask()` for input validation.
- `assignTask()` service function.
- New PATCH route.

If a task already has an assignee, the existing value is overwritten to support reassignment.

---

# Testing Summary

Implemented:

- Unit tests for `taskService.js`
- Integration tests for API routes using Supertest

---

## Test Coverage Includes

- Task creation
- Task retrieval
- Task update
- Task deletion
- Task completion
- Task assignment
- Validation errors
- Missing resource handling
- Pagination edge cases

---

# Final Coverage

```
Statements: 85%+
Lines: 84%+
Functions: 90%+
```