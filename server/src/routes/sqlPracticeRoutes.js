const express = require('express');
const router = express.Router();
const initSqlJs = require('sql.js');

let SQL_ENGINE = null;

// Initialize SQLite engine once
async function getSqlEngine() {
  if (!SQL_ENGINE) {
    SQL_ENGINE = await initSqlJs();
  }
  return SQL_ENGINE;
}

// Seed data definitions for isolated SQL sandbox
const SEED_SQL = `
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  budget INTEGER NOT NULL
);

INSERT INTO departments VALUES 
(1, 'Engineering', 'Bengaluru', 5000000),
(2, 'Data & AI', 'Hyderabad', 4200000),
(3, 'Product', 'Pune', 3100000),
(4, 'Quality Assurance', 'Noida', 1800000);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  department_id INTEGER,
  salary INTEGER NOT NULL,
  hire_date TEXT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO employees VALUES 
(101, 'Aarav', 'Sharma', 1, 1450000, '2022-03-15'),
(102, 'Priya', 'Patel', 2, 1600000, '2021-08-10'),
(103, 'Rohan', 'Verma', 1, 1100000, '2023-01-20'),
(104, 'Sneha', 'Reddy', 2, 1350000, '2022-11-05'),
(105, 'Vikram', 'Singh', 3, 1250000, '2022-06-12'),
(106, 'Ananya', 'Iyer', 4, 850000, '2023-04-18'),
(107, 'Karan', 'Mehta', 1, 1900000, '2020-05-01');

CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  major TEXT NOT NULL,
  gpa REAL NOT NULL
);

INSERT INTO students VALUES 
(1, 'Abhishek', 'Computer Science', 9.2),
(2, 'Deepika', 'Data Science', 8.9),
(3, 'Rahul', 'Computer Science', 7.8),
(4, 'Meera', 'Information Technology', 8.4);
`;

const SQL_LESSONS = [
  {
    id: 'intro-select',
    title: '1. Basic SELECT & WHERE',
    category: 'Foundations',
    difficulty: 'Beginner',
    explanation: 'The SELECT statement retrieves columns from a table, while WHERE filters rows satisfying specific conditions.',
    starterQuery: 'SELECT first_name, last_name, salary FROM employees WHERE salary > 1200000;',
    practiceTask: 'Select all employees who work in Department 1 with a salary greater than 1,200,000.'
  },
  {
    id: 'aggregate-group-by',
    title: '2. Aggregations & GROUP BY',
    category: 'Analysis',
    difficulty: 'Intermediate',
    explanation: 'Aggregate functions like COUNT(), SUM(), AVG(), MIN(), MAX() combine multiple rows. GROUP BY groups results by unique attributes.',
    starterQuery: 'SELECT department_id, COUNT(*) AS employee_count, AVG(salary) AS avg_salary FROM employees GROUP BY department_id;',
    practiceTask: 'Find the average salary and employee count for each department.'
  },
  {
    id: 'inner-joins',
    title: '3. Relational INNER & LEFT JOIN',
    category: 'Joins',
    difficulty: 'Intermediate',
    explanation: 'A JOIN clause combines columns from two tables based on a related column between them (Primary Key & Foreign Key).',
    starterQuery: 'SELECT e.first_name, e.last_name, d.name AS department_name, d.location FROM employees e JOIN departments d ON e.department_id = d.id;',
    practiceTask: 'Fetch employee names along with their department name and location.'
  },
  {
    id: 'subqueries-cte',
    title: '4. Subqueries & Nested Expressions',
    category: 'Advanced SQL',
    difficulty: 'Advanced',
    explanation: 'A subquery is a query embedded within another query, used in WHERE, FROM, or SELECT clauses for comparative lookups.',
    starterQuery: 'SELECT first_name, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
    practiceTask: 'Retrieve all employees earning higher than the company-wide average salary.'
  },
  {
    id: 'nth-highest-salary',
    title: '5. Interview Problem: 2nd Highest Salary',
    category: 'Interview Prep',
    difficulty: 'Advanced',
    explanation: 'A classic tech interview problem: finding the second highest salary using subqueries or LIMIT/OFFSET.',
    starterQuery: 'SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;',
    practiceTask: 'Write a query to find the 2nd highest distinct salary from the employees table.'
  }
];

/**
 * @route GET /api/v1/sql/lessons
 * Retrieve SQL curriculum lessons and schema information
 */
router.get('/lessons', (req, res) => {
  res.json({
    success: true,
    schemaTables: [
      {
        name: 'departments',
        columns: ['id (INTEGER PRIMARY KEY)', 'name (TEXT)', 'location (TEXT)', 'budget (INTEGER)']
      },
      {
        name: 'employees',
        columns: ['id (INTEGER PRIMARY KEY)', 'first_name (TEXT)', 'last_name (TEXT)', 'department_id (INTEGER FK)', 'salary (INTEGER)', 'hire_date (TEXT)']
      },
      {
        name: 'students',
        columns: ['id (INTEGER PRIMARY KEY)', 'name (TEXT)', 'major (TEXT)', 'gpa (REAL)']
      }
    ],
    lessons: SQL_LESSONS
  });
});

/**
 * @route POST /api/v1/sql/execute
 * Run user query inside isolated in-memory SQLite sandbox
 */
router.post('/execute', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'SQL query string is required.' });
  }

  const startTime = Date.now();
  let db = null;

  try {
    const SQL = await getSqlEngine();
    db = new SQL.Database();
    
    // Seed standard test database
    db.run(SEED_SQL);

    // Execute user query
    const results = db.exec(query);
    const executionTimeMs = Date.now() - startTime;

    if (!results || results.length === 0) {
      db.close();
      return res.json({
        success: true,
        columns: [],
        values: [],
        rowCount: 0,
        executionTimeMs,
        message: 'Query executed successfully with 0 returned rows (or modified table state).'
      });
    }

    const firstResult = results[0];
    db.close();

    res.json({
      success: true,
      columns: firstResult.columns,
      values: firstResult.values,
      rowCount: firstResult.values.length,
      executionTimeMs
    });
  } catch (error) {
    if (db) {
      try { db.close(); } catch (e) {}
    }
    res.status(200).json({
      success: false,
      error: error.message || 'SQL execution failed.',
      executionTimeMs: Date.now() - startTime
    });
  }
});

module.exports = router;
