# AI Question Generation & Validation Pipeline

## 1. Overview
AspirantAI integrates an automated question generation, vetting, and scheduling engine configured for competitive examinations across India.

## 2. Quality & Validation Workflow
```
[ Prompt Generation Engine / LLM ]
               |
               v
[ Schema Validator ] (Assures 4 distinct choices, valid keys A/B/C/D)
               |
               v
[ Duplicate Detection ] (Levenshtein distance & semantic text fingerprinting)
               |
               v
[ Consistency Engine ] (Verifies that Hindi & English options map to the same key)
               |
               v
[ Validation Status Tagging ]
- Approved: Admitted to Daily Quiz active pool
- Pending Review: Flagged for Content Manager review
- Rejected: Purged from active generation
```

## 3. Scheduled Daily 100-Question Assessment
- Scheduler runs daily at `00:00:00` in timezone `Asia/Kolkata`.
- Checks for 100 validated questions matching the active exam syllabus.
- Fallback: In offline or low-quota conditions, automatically hydrates quizzes from the approved curated question bank to guarantee an uninterrupted daily test for students.
