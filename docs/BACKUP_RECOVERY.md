# MongoDB Atlas Backup and Disaster Recovery Strategy

This document establishes the official database backup, archival, and point-in-time recovery strategy for the **AspirantAI** platform.

---

## 1. Cloud-Native Backup Architecture (MongoDB Atlas)

For production deployment on MongoDB Atlas:
1. **Continuous Cloud Backups**:
   - Atlas utilizes automated localized storage snapshots without interrupting live database transactions.
   - Point-in-Time Recovery (PITR) allows restoration to any specific second within the last 7 days.
2. **Snapshot Retention Schedules**:
   - **Hourly Snapshots**: Retained for 24 hours.
   - **Daily Snapshots**: Retained for 7 days.
   - **Weekly Snapshots**: Retained for 4 weeks.
   - **Monthly Snapshots**: Retained for 12 months (compliance & audit logs).

---

## 2. Logical Backup Procedure (CLI Utility)

For development or auxiliary offline archives, use the official `mongodump` tool with strict TLS:

```bash
# Export encrypted compressed archive of AspirantAI database
mongodump \
  --uri="mongodb+srv://<username>:<password>@cluster0.mongodb.net/aspirantai" \
  --gzip \
  --archive="/secure/backups/aspirantai_$(date +%Y%m%d_%H%M%S).gz"
```

### Security Precaution:
- **Never log plain-text passwords or connection URIs** in terminal history or automated cron logs.
- Utilize environment variables or secrets managers (e.g. `export MONGODB_URI=...`).
- Store exported archives in an encrypted S3 bucket or isolated cold storage.

---

## 3. Disaster Recovery & Restoration Workflow

### Scenario A: Restoring via MongoDB Atlas Console (Recommended)
1. Log in to the [MongoDB Atlas Management Console](https://cloud.mongodb.com).
2. Navigate to **Deployment** → **Databases** → **Backup**.
3. Select the desired cluster and click **Restore**.
4. Choose restoration type:
   - **Point-in-Time Restore**: Enter the target timestamp (Asia/Kolkata).
   - **Snapshot Restore**: Select an automated verified snapshot.
5. Choose destination:
   - Restore to a newly provisioned staging cluster first for verification, or replace the target cluster.
6. Click **Confirm Restore**.

### Scenario B: Restoring from Compressed Archive via CLI
```bash
# Restore entire database to target instance
mongorestore \
  --uri="mongodb+srv://<username>:<password>@cluster0.mongodb.net/aspirantai" \
  --gzip \
  --archive="/secure/backups/aspirantai_backup.gz" \
  --drop
```
*(The `--drop` flag removes existing collections before restoration to prevent document collision).*

---

## 4. Integrity Verification & Post-Restoration Checklist
Following any restoration drill:
- [ ] Verify core counts: Users, Questions, Quizzes, CodingProblems, Internships, JobListings.
- [ ] Confirm index creation using `db.collection.getIndexes()`.
- [ ] Run backend health check `GET /api/v1/health` and automated test suite (`npm test`).
- [ ] Log the restoration event in `AdminAuditLog` with operator attribution.
