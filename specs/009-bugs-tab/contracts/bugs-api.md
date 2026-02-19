# API Contract: Bugs

## GET /api/bugs/:feature

Returns the bug tracking state for a given feature, including parsed bugs from `bugs.md` and cross-referenced fix tasks from `tasks.md`.

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| feature | string | URL path | Yes | Feature directory name (e.g., "009-bugs-tab") |

### Response: 200 OK

```json
{
  "exists": true,
  "bugs": [
    {
      "id": "BUG-001",
      "reported": "2026-02-19",
      "severity": "critical",
      "status": "reported",
      "githubIssue": "#13",
      "description": "Login fails when email contains plus sign",
      "rootCause": null,
      "fixReference": null,
      "fixTasks": {
        "total": 3,
        "checked": 1,
        "tasks": [
          { "id": "T-B001", "description": "Investigate root cause for BUG-001: Login fails...", "checked": false },
          { "id": "T-B002", "description": "Implement fix for BUG-001: Login fails...", "checked": true },
          { "id": "T-B003", "description": "Write regression test for BUG-001: Login fails...", "checked": false }
        ]
      }
    },
    {
      "id": "BUG-002",
      "reported": "2026-02-18",
      "severity": "medium",
      "status": "fixed",
      "githubIssue": null,
      "description": "Dashboard flickers on theme toggle",
      "rootCause": "CSS transition timing",
      "fixReference": "T-B004",
      "fixTasks": {
        "total": 2,
        "checked": 2,
        "tasks": [
          { "id": "T-B004", "description": "Implement fix for BUG-002...", "checked": true },
          { "id": "T-B005", "description": "Write regression test for BUG-002...", "checked": true }
        ]
      }
    }
  ],
  "summary": {
    "total": 2,
    "open": 1,
    "fixed": 1,
    "highestOpenSeverity": "critical",
    "bySeverity": {
      "critical": 1,
      "high": 0,
      "medium": 0,
      "low": 0
    }
  }
}
```

### Response: 200 OK (no bugs.md)

```json
{
  "exists": false,
  "bugs": [],
  "summary": {
    "total": 0,
    "open": 0,
    "fixed": 0,
    "highestOpenSeverity": null,
    "bySeverity": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    }
  }
}
```

### Response: 404 Not Found

```json
{
  "error": "Feature not found"
}
```

### Response: 500 Internal Server Error

```json
{
  "error": "Error message"
}
```

## WebSocket Message: bugs_update

Broadcast to subscribed clients when `bugs.md` or `tasks.md` changes on disk.

### Message Format

```json
{
  "type": "bugs_update",
  "feature": "009-bugs-tab",
  "bugs": {
    "exists": true,
    "bugs": [ ... ],
    "summary": { ... }
  }
}
```

The `bugs` payload is identical to the `GET /api/bugs/:feature` response body.

### Trigger

Any file change detected by chokidar in the project directory (same trigger as other `_update` messages). Debounced at 300ms.

### Client Subscription

Client must send `{ "type": "subscribe", "feature": "<featureId>" }` to receive updates for a specific feature. Same subscription mechanism as all other view updates.
