# AspirantAI Testing Report & Verification

## Test Execution Summary

The backend integration test suite covers 14 distinct integration scenarios executed against an active database instance:

```bash
cd server && npm test
```

### Verified Test Assertions
1. `GET /api/v1/health` - Verified health status, uptime, and developer credit `Abhishek Kumar`.
2. `POST /api/v1/auth/signup` - Account creation, unverified status issuance, password hashing.
3. `OTP Replay Prevention` - Verifies that OTP codes cannot be reused once validated.
4. `POST /api/v1/auth/login (Student)` - Verifies student authentication and token issuance.
5. `POST /api/v1/auth/login (Admin)` - Verifies admin authentication.
6. `RBAC Student Check` - Verifies that students receive HTTP 403 on admin-only endpoints.
7. `RBAC Admin Check` - Verifies that admin tokens successfully access protected telemetry.
8. `POST /api/v1/onboarding/preferences` - Persists user primary exam (`BPSC_CCE`) and goals.
9. `GET /api/v1/exams` - Validates verified exams directory.
10. `Answer Leakage Check` - Asserts that `GET /api/v1/daily-quiz/today` strictly strips `correctAnswer` and `explanation`.
11. `Server-Authoritative Evaluation` - Validates that server evaluates score and negative marking accurately.
12. `Idempotent Submission` - Asserts that duplicate quiz submission attempts are safely rejected.
13. `SM-2 Spaced Repetition` - Tests interval calculation and repetition increment for flashcards.
14. `GET /api/v1/vacancies` - Validates verified recruitment data.

**Total Tests:** 14 passed, 0 failed.
