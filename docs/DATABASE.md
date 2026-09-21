# WasteWise AI - Database Audit

## Production Indexing Strategy
To ensure `O(log N)` query performance on large datasets, the following indexes are required (Step 3).

### Scan Collection
```javascript
// Optimized for the history page timeline
ScanSchema.index({
  userId: 1,
  createdAt: -1
});

// Optimized for category filtering on history
ScanSchema.index({
  userId: 1,
  category: 1,
  createdAt: -1
});
```

### Notification Collection
```javascript
// Optimized for loading the notifications dropdown quickly
NotificationSchema.index({
  userId: 1,
  createdAt: -1
});
```

### XP Transaction Collection
```javascript
// Optimized for calculating total XP and leveling
XPTransactionSchema.index({
  userId: 1,
  createdAt: -1
});
```

## Known Database Risks & Checks Required
1. **Unbounded Arrays**: Ensure no Mongoose schema utilizes unbounded arrays (e.g., storing all scans as an array inside the `User` document instead of by reference).
2. **Orphan Records**: If a User is deleted, their Scans, Notifications, and XPTransactions must be cascaded or anonymized.
3. **Aggregation Performance**: Analytics routes should utilize `$match`, `$group`, `$sort`, `$limit` natively in MongoDB, avoiding pulling thousands of documents into Node.js memory.
