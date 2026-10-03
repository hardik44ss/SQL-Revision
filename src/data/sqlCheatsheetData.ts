export interface CodeLine {
  code: string;
  comment?: string;
}

export interface CardSection {
  title?: string;
  lines: CodeLine[];
}

export interface SheetCard {
  id: string;
  title: string;
  symbol: string;
  category: 'core' | 'functions' | 'joins' | 'window' | 'interview' | 'schema' | 'perf';
  description: string;
  sections: CardSection[];
  interactiveDemo?: {
    code: string;
    description: string;
  };
}

export const SQL_CHEATSHEET_CARDS: SheetCard[] = [
  {
    id: 'basic-queries',
    title: 'Select & Filtering',
    symbol: '🔍',
    category: 'core',
    description: 'Core retrieval clauses, row filtering, boolean operators, and sorting order.',
    sections: [
      {
        title: 'Basic SELECT Syntax',
        lines: [
          { code: 'SELECT * FROM employees;', comment: '// retrieve all columns' },
          { code: 'SELECT id, name, salary FROM employees;', comment: '// specific columns' },
          { code: 'SELECT DISTINCT department_id FROM employees;', comment: '// unique values only' },
          { code: 'SELECT name AS employee_name FROM employees;', comment: '// column alias' },
          { code: 'SELECT * FROM employees LIMIT 10 OFFSET 20;', comment: '// paginate (page 3)' },
        ],
      },
      {
        title: 'WHERE Predicates & Operators',
        lines: [
          { code: 'WHERE salary > 75000 AND status = "active";', comment: '// AND logical operator' },
          { code: 'WHERE department_id = 1 OR department_id = 2;', comment: '// OR logical operator' },
          { code: 'WHERE salary BETWEEN 50000 AND 100000;', comment: '// inclusive range' },
          { code: 'WHERE role IN ("Dev", "QA", "PM");', comment: '// match set of values' },
          { code: 'WHERE role NOT IN ("Sales", "HR");', comment: '// exclude set' },
          { code: 'WHERE manager_id IS NULL;', comment: '// check for NULL (never = NULL)' },
          { code: 'WHERE manager_id IS NOT NULL;', comment: '// check for non-null' },
        ],
      },
      {
        title: 'Pattern Matching (LIKE & ILIKE)',
        lines: [
          { code: 'WHERE name LIKE "J%";', comment: '// starts with "J"' },
          { code: 'WHERE email LIKE "%@gmail.com";', comment: '// ends with "@gmail.com"' },
          { code: 'WHERE phone LIKE "___-____";', comment: '// exactly 8 characters (_ is 1 char)' },
          { code: 'WHERE name ILIKE "john%";', comment: '// case-insensitive match (Postgres)' },
        ],
      },
      {
        title: 'Sorting (ORDER BY)',
        lines: [
          { code: 'ORDER BY salary DESC;', comment: '// highest salary first' },
          { code: 'ORDER BY department_id ASC, salary DESC;', comment: '// multi-column sort' },
          { code: 'ORDER BY manager_id ASC NULLS LAST;', comment: '// handle NULL position' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'Run SELECT query on employees table',
      code: 'SELECT name, salary, department_id\nFROM employees\nWHERE salary >= 100000\nORDER BY salary DESC;',
    },
  },

  {
    id: 'aggregate-functions',
    title: 'Aggregates & Grouping',
    symbol: '∑',
    category: 'functions',
    description: 'Summary functions, grouping rows, and filtering aggregate results with HAVING.',
    sections: [
      {
        title: 'Aggregate Functions',
        lines: [
          { code: 'SELECT COUNT(*) FROM employees;', comment: '// total rows (includes NULLs)' },
          { code: 'SELECT COUNT(manager_id) FROM employees;', comment: '// counts only non-NULL rows' },
          { code: 'SELECT COUNT(DISTINCT role) FROM employees;', comment: '// count unique values' },
          { code: 'SELECT SUM(salary) FROM employees;', comment: '// sum total of values' },
          { code: 'SELECT AVG(salary) FROM employees;', comment: '// average (ignores NULLs!)' },
          { code: 'SELECT MIN(salary), MAX(salary);', comment: '// lowest and highest' },
          { code: 'SELECT ROUND(AVG(salary), 2);', comment: '// round to 2 decimals' },
        ],
      },
      {
        title: 'GROUP BY & HAVING',
        lines: [
          { code: 'SELECT department_id, COUNT(*) AS count', comment: '// group column + aggregate' },
          { code: 'FROM employees' },
          { code: 'GROUP BY department_id;', comment: '// collapse into groups' },
          { code: 'SELECT department_id, AVG(salary)', comment: '// calculate dept average' },
          { code: 'FROM employees' },
          { code: 'WHERE salary > 40000', comment: '// row filter BEFORE grouping' },
          { code: 'GROUP BY department_id' },
          { code: 'HAVING AVG(salary) > 80000;', comment: '// group filter AFTER grouping' },
        ],
      },
      {
        title: 'Handling NULLs (COALESCE & NULLIF)',
        lines: [
          { code: 'SELECT COALESCE(bonus, 0) FROM employees;', comment: '// returns 0 if bonus is NULL' },
          { code: 'SELECT COALESCE(mobile, phone, "N/A");', comment: '// first non-null value' },
          { code: 'SELECT revenue / NULLIF(orders, 0);', comment: '// prevents divide-by-zero!' },
        ],
      },
      {
        title: 'Conditional CASE WHEN Expression',
        lines: [
          { code: 'SELECT name,', comment: '// conditional labeling' },
          { code: '  CASE', comment: '// start switch' },
          { code: '    WHEN salary >= 120000 THEN "High"', comment: '// branch 1' },
          { code: '    WHEN salary >= 80000 THEN "Medium"', comment: '// branch 2' },
          { code: '    ELSE "Standard"', comment: '// fallback' },
          { code: '  END AS salary_bracket', comment: '// alias' },
          { code: 'FROM employees;' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'Department average salary with HAVING filter',
      code: 'SELECT department_id, COUNT(*) as staff_count, ROUND(AVG(salary), 2) as avg_sal\nFROM employees\nGROUP BY department_id\nHAVING COUNT(*) >= 2\nORDER BY avg_sal DESC;',
    },
  },

  {
    id: 'joins',
    title: 'Joins & Anti-Joins',
    symbol: '🔗',
    category: 'joins',
    description: 'Relational table joins, Venn intersection, full outer joins, and anti-joins.',
    sections: [
      {
        title: 'INNER JOIN (Intersection A ∩ B)',
        lines: [
          { code: 'SELECT e.name, d.name AS department' },
          { code: 'FROM employees e' },
          { code: 'INNER JOIN departments d', comment: '// matches both tables' },
          { code: '  ON e.department_id = d.id;' },
        ],
      },
      {
        title: 'LEFT JOIN (All A + Matched B)',
        lines: [
          { code: 'SELECT e.name, d.name AS department' },
          { code: 'FROM employees e' },
          { code: 'LEFT JOIN departments d', comment: '// keeps all employees even with NULL dept' },
          { code: '  ON e.department_id = d.id;' },
        ],
      },
      {
        title: 'LEFT ANTI-JOIN (Rows in A with NO match in B)',
        lines: [
          { code: 'SELECT c.id, c.name, c.email' },
          { code: 'FROM customers c' },
          { code: 'LEFT JOIN orders o ON c.id = o.customer_id' },
          { code: 'WHERE o.id IS NULL;', comment: '// finds customers who never placed an order!' },
        ],
      },
      {
        title: 'SELF JOIN (Hierarchical Org Chart)',
        lines: [
          { code: 'SELECT e.name AS employee, m.name AS manager' },
          { code: 'FROM employees e' },
          { code: 'LEFT JOIN employees m', comment: '// joins table with itself' },
          { code: '  ON e.manager_id = m.id;' },
        ],
      },
      {
        title: 'FULL OUTER JOIN & CROSS JOIN',
        lines: [
          { code: 'SELECT * FROM A FULL OUTER JOIN B ON A.id = B.id;', comment: '// union of all rows' },
          { code: 'SELECT * FROM sizes CROSS JOIN colors;', comment: '// Cartesian product (M × N rows)' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'Employee and Department join query',
      code: 'SELECT e.name AS employee, e.salary, d.name AS department, d.location\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id\nORDER BY e.salary DESC;',
    },
  },

  {
    id: 'window-functions',
    title: 'Window Functions',
    symbol: '🪟',
    category: 'window',
    description: 'Calculations across row partitions without collapsing rows. #1 asked interview topic.',
    sections: [
      {
        title: 'Ranking Functions (ROW_NUMBER, RANK, DENSE_RANK)',
        lines: [
          { code: 'SELECT name, salary,' },
          { code: '  ROW_NUMBER() OVER (ORDER BY salary DESC) as row_n,', comment: '// 1, 2, 3 (strictly sequential)' },
          { code: '  RANK()       OVER (ORDER BY salary DESC) as rnk,', comment: '// 1, 1, 3 (skips rank on ties)' },
          { code: '  DENSE_RANK() OVER (ORDER BY salary DESC) as dense_r', comment: '// 1, 1, 2 (no gaps on ties!)' },
          { code: 'FROM employees;' },
        ],
      },
      {
        title: 'PARTITION BY (Grouped Ranking)',
        lines: [
          { code: 'SELECT name, department_id, salary,' },
          { code: '  DENSE_RANK() OVER (', comment: '// rank within each dept' },
          { code: '    PARTITION BY department_id', comment: '// reset rank per department' },
          { code: '    ORDER BY salary DESC' },
          { code: '  ) AS dept_rank' },
          { code: 'FROM employees;' },
        ],
      },
      {
        title: 'Value Navigation (LEAD & LAG)',
        lines: [
          { code: 'SELECT order_date, total_amount,' },
          { code: '  LAG(total_amount, 1) OVER (ORDER BY order_date) as prev_amount,', comment: '// prior row' },
          { code: '  LEAD(total_amount, 1) OVER (ORDER BY order_date) as next_amount', comment: '// next row' },
          { code: 'FROM orders;' },
        ],
      },
      {
        title: 'Running Total & Window Framing',
        lines: [
          { code: 'SELECT order_date, total_amount,' },
          { code: '  SUM(total_amount) OVER (', comment: '// running cumulative total' },
          { code: '    ORDER BY order_date, id', comment: '// order sequence' },
          { code: '    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW', comment: '// explicit frame' },
          { code: '  ) AS cumulative_sum,' },
          { code: '  AVG(total_amount) OVER (', comment: '// rolling 3-order average' },
          { code: '    ORDER BY order_date', comment: '//' },
          { code: '    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW', comment: '// last 2 + current' },
          { code: '  ) AS rolling_3_avg' },
          { code: 'FROM orders;' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'Cumulative running total window calculation',
      code: 'SELECT id, order_date, total_amount,\n  ROUND(SUM(total_amount) OVER (ORDER BY order_date, id), 2) AS running_total\nFROM orders\nORDER BY order_date, id;',
    },
  },

  {
    id: 'string-functions',
    title: 'String Functions',
    symbol: '❝',
    category: 'functions',
    description: 'String parsing, concatenation, length, regex, and sub-string extractions.',
    sections: [
      {
        title: 'Concatenation & Formatting',
        lines: [
          { code: 'SELECT first_name || " " || last_name AS full_name;', comment: '// ANSI standard concat' },
          { code: 'SELECT CONCAT(first_name, " ", last_name);', comment: '// MySQL/Postgres CONCAT' },
          { code: 'SELECT CONCAT_WS("-", "2024", "05", "12");', comment: '// concat with separator' },
          { code: 'SELECT UPPER(name), LOWER(name);', comment: '// case conversion' },
          { code: 'SELECT INITCAP("john doe");', comment: '// = "John Doe" (Postgres)' },
        ],
      },
      {
        title: 'Trimming & Padding',
        lines: [
          { code: 'SELECT TRIM("   hello   ");', comment: '// removes leading & trailing spaces' },
          { code: 'SELECT LTRIM("  abc"), RTRIM("abc  ");', comment: '// left or right trim' },
          { code: 'SELECT LPAD(id, 6, "0");', comment: '// pads id: 42 -> "000042"' },
          { code: 'SELECT RPAD(code, 8, " ");', comment: '// pads right' },
        ],
      },
      {
        title: 'Substring & Position',
        lines: [
          { code: 'SELECT SUBSTRING("Hello World", 1, 5);', comment: '// = "Hello" (1-indexed!)' },
          { code: 'SELECT SUBSTR(phone, -4);', comment: '// gets last 4 characters' },
          { code: 'SELECT LENGTH("PostgreSQL");', comment: '// character count = 10' },
          { code: 'SELECT INSTR(email, "@");', comment: '// returns index of "@"' },
          { code: 'SELECT REPLACE(url, "http://", "https://");', comment: '// substring replace' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'String manipulation demo',
      code: 'SELECT name, UPPER(name) AS uppercase_name,\n  SUBSTR(email, 1, INSTR(email, "@") - 1) AS username\nFROM customers\nLIMIT 5;',
    },
  },

  {
    id: 'date-functions',
    title: 'Date & Time Functions',
    symbol: '📅',
    category: 'functions',
    description: 'Timestamp arithmetic, month truncation, date differences, and formatting.',
    sections: [
      {
        title: 'Current Timestamps',
        lines: [
          { code: 'SELECT CURRENT_DATE;', comment: '// returns "YYYY-MM-DD"' },
          { code: 'SELECT CURRENT_TIME;', comment: '// returns "HH:MM:SS"' },
          { code: 'SELECT CURRENT_TIMESTAMP, NOW();', comment: '// full datetime' },
        ],
      },
      {
        title: 'Date Truncation (MoM Grouping)',
        lines: [
          { code: 'SELECT DATE_TRUNC("month", order_date);', comment: '// 2024-05-18 -> 2024-05-01' },
          { code: 'SELECT strftime("%Y-%m", order_date) AS month,', comment: '// SQLite month string' },
          { code: '  SUM(total_amount) AS revenue' },
          { code: 'FROM orders' },
          { code: 'GROUP BY strftime("%Y-%m", order_date);' },
        ],
      },
      {
        title: 'Date Math & Intervals',
        lines: [
          { code: 'WHERE created_at >= NOW() - INTERVAL "30 days";', comment: '// last 30 days' },
          { code: 'SELECT DATEDIFF("2024-05-10", "2024-05-01");', comment: '// returns 9 days' },
          { code: 'SELECT EXTRACT(YEAR FROM order_date);', comment: '// extracts year: 2024' },
          { code: 'SELECT EXTRACT(DOW FROM order_date);', comment: '// day of week (0 = Sunday)' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'Group orders by month',
      code: 'SELECT SUBSTR(order_date, 1, 7) AS order_month,\n  COUNT(*) AS orders_count,\n  ROUND(SUM(total_amount), 2) AS monthly_revenue\nFROM orders\nGROUP BY order_month\nORDER BY order_month ASC;',
    },
  },

  {
    id: 'ctes-subqueries',
    title: 'CTEs & Subqueries',
    symbol: '⎘',
    category: 'core',
    description: 'Common Table Expressions (WITH clauses), recursive trees, and correlated subqueries.',
    sections: [
      {
        title: 'Common Table Expression (WITH clause)',
        lines: [
          { code: 'WITH HighEarners AS (' },
          { code: '  SELECT * FROM employees WHERE salary > 100000' },
          { code: '),', comment: '// comma separates multiple CTEs' },
          { code: 'DeptSummary AS (' },
          { code: '  SELECT department_id, COUNT(*) as cnt' },
          { code: '  FROM HighEarners GROUP BY department_id' },
          { code: ')' },
          { code: 'SELECT * FROM DeptSummary;' },
        ],
      },
      {
        title: 'EXISTS vs IN (Correlated Subquery)',
        lines: [
          { code: 'SELECT c.name FROM customers c', comment: '// fast & null-safe' },
          { code: 'WHERE EXISTS (' },
          { code: '  SELECT 1 FROM orders o WHERE o.customer_id = c.id' },
          { code: ');' },
          { code: 'WHERE c.id NOT IN (', comment: '// ⚠️ DANGEROUS IF NULL EXISTS!' },
          { code: '  SELECT customer_id FROM orders WHERE customer_id IS NOT NULL' },
          { code: ');', comment: '// always add IS NOT NULL guard with NOT IN' },
        ],
      },
      {
        title: 'Recursive CTE (Hierarchy / Org Chart)',
        lines: [
          { code: 'WITH RECURSIVE OrgChart AS (' },
          { code: '  -- 1. Anchor: top boss (manager_id IS NULL)' },
          { code: '  SELECT id, name, manager_id, 1 as level' },
          { code: '  FROM employees WHERE manager_id IS NULL' },
          { code: '  UNION ALL' },
          { code: '  -- 2. Recursive member: reports to current level' },
          { code: '  SELECT e.id, e.name, e.manager_id, o.level + 1' },
          { code: '  FROM employees e' },
          { code: '  JOIN OrgChart o ON e.manager_id = o.id' },
          { code: ')' },
          { code: 'SELECT * FROM OrgChart ORDER BY level, id;' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'CTE calculating top department salaries',
      code: 'WITH RankedSalaries AS (\n  SELECT name, salary, department_id,\n    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank_in_dept\n  FROM employees\n)\nSELECT * FROM RankedSalaries WHERE rank_in_dept = 1;',
    },
  },

  {
    id: 'interview-top-questions',
    title: 'Top 8 Interview Questions',
    symbol: '🎯',
    category: 'interview',
    description: 'The exact high-frequency questions asked in FAANG & data engineering interviews.',
    sections: [
      {
        title: '1. N-th Highest Salary (Handles Ties)',
        lines: [
          { code: 'WITH RankedSalaries AS (' },
          { code: '  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk' },
          { code: '  FROM employees' },
          { code: ')' },
          { code: 'SELECT DISTINCT salary FROM RankedSalaries WHERE rnk = 2;', comment: '// 2nd highest' },
        ],
      },
      {
        title: '2. Employees Earning More Than Their Managers',
        lines: [
          { code: 'SELECT e.name AS emp, e.salary, m.name AS mgr, m.salary' },
          { code: 'FROM employees e' },
          { code: 'JOIN employees m ON e.manager_id = m.id', comment: '// self join' },
          { code: 'WHERE e.salary > m.salary;', comment: '// compare salaries' },
        ],
      },
      {
        title: '3. Duplicate Records Detection & Deletion',
        lines: [
          { code: 'SELECT email, COUNT(*) AS count' },
          { code: 'FROM customers GROUP BY email HAVING COUNT(*) > 1;', comment: '// find dupes' },
          { code: 'DELETE FROM customers WHERE id NOT IN (', comment: '// delete duplicates keeping lowest id' },
          { code: '  SELECT MIN(id) FROM customers GROUP BY email' },
          { code: ');' },
        ],
      },
      {
        title: '4. Month-over-Month Growth % (MoM)',
        lines: [
          { code: 'SELECT order_date, total_amount,' },
          { code: '  ROUND((total_amount - LAG(total_amount) OVER (ORDER BY order_date)) * 100.0' },
          { code: '    / LAG(total_amount) OVER (ORDER BY order_date), 2) AS growth_pct' },
          { code: 'FROM orders;' },
        ],
      },
      {
        title: '5. Consecutive Days / Streaks Pattern',
        lines: [
          { code: '-- "Gaps and Islands" problem: difference of sequences is constant!' },
          { code: 'SELECT user_id, (login_date - ROW_NUMBER() OVER (' },
          { code: '  PARTITION BY user_id ORDER BY login_date)) AS streak_group' },
          { code: 'FROM logins;' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'Employees earning more than managers',
      code: 'SELECT e.name AS employee, e.salary AS emp_salary,\n  m.name AS manager, m.salary AS mgr_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.id\nWHERE e.salary > m.salary;',
    },
  },

  {
    id: 'set-operations',
    title: 'Set Operations',
    symbol: '∪',
    category: 'core',
    description: 'Combining row sets with UNION, UNION ALL, INTERSECT, and EXCEPT / MINUS.',
    sections: [
      {
        title: 'UNION vs UNION ALL (Crucial Difference!)',
        lines: [
          { code: 'SELECT city FROM customers' },
          { code: 'UNION', comment: '// deduplicates rows (requires expensive sort/hash)' },
          { code: 'SELECT city FROM suppliers;' },
          { code: 'SELECT city FROM customers' },
          { code: 'UNION ALL', comment: '// retains duplicates (ultra fast O(1) append!)' },
          { code: 'SELECT city FROM suppliers;' },
        ],
      },
      {
        title: 'INTERSECT & EXCEPT / MINUS',
        lines: [
          { code: 'SELECT user_id FROM purchases_2023' },
          { code: 'INTERSECT', comment: '// users active in BOTH years' },
          { code: 'SELECT user_id FROM purchases_2024;' },
          { code: 'SELECT user_id FROM active_subscribers' },
          { code: 'EXCEPT', comment: '// in first set but NOT in second (MINUS in Oracle)' },
          { code: 'SELECT user_id FROM churned_users;' },
        ],
      },
    ],
  },

  {
    id: 'ddl-constraints',
    title: 'DDL & Table Constraints',
    symbol: '▦',
    category: 'schema',
    description: 'Data Definition Language: CREATE, ALTER, constraints, and cascading actions.',
    sections: [
      {
        title: 'CREATE TABLE with Full Constraints',
        lines: [
          { code: 'CREATE TABLE users (' },
          { code: '  id INTEGER PRIMARY KEY AUTOINCREMENT,', comment: '// unique PK' },
          { code: '  email VARCHAR(255) NOT NULL UNIQUE,', comment: '// unique constraint' },
          { code: '  age INTEGER CHECK (age >= 18),', comment: '// domain constraint' },
          { code: '  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
          { code: ');' },
        ],
      },
      {
        title: 'FOREIGN KEY with CASCADE Rules',
        lines: [
          { code: 'CREATE TABLE orders (' },
          { code: '  id INTEGER PRIMARY KEY,' },
          { code: '  user_id INTEGER NOT NULL,' },
          { code: '  FOREIGN KEY (user_id) REFERENCES users(id)' },
          { code: '    ON DELETE CASCADE', comment: '// auto-delete orders when user deleted' },
          { code: '    ON UPDATE CASCADE', comment: '// sync user_id changes' },
          { code: ');' },
        ],
      },
      {
        title: 'TRUNCATE vs DELETE vs DROP Matrix',
        lines: [
          { code: 'DELETE FROM logs WHERE date < "2023-01-01";', comment: '// DML, row-by-row, triggers fire, can filter' },
          { code: 'TRUNCATE TABLE logs;', comment: '// DDL, deallocates pages, ultra-fast, resets auto-increment' },
          { code: 'DROP TABLE logs;', comment: '// DDL, permanently removes schema + all rows' },
        ],
      },
    ],
  },

  {
    id: 'performance-indexing-acid',
    title: 'Indexing & ACID Principles',
    symbol: '⚡',
    category: 'perf',
    description: 'B-Tree indexes, query optimization, EXPLAIN analysis, and ACID transaction rules.',
    sections: [
      {
        title: 'Index Creation & Leftmost Prefix Rule',
        lines: [
          { code: 'CREATE INDEX idx_emp_salary ON employees(salary);', comment: '// single column B-Tree' },
          { code: 'CREATE INDEX idx_dept_sal ON employees(dept_id, salary);', comment: '// composite index' },
          { code: '-- Matches composite index (dept_id, salary):' },
          { code: 'WHERE dept_id = 2 AND salary > 80000; -- ✅ Uses index' },
          { code: 'WHERE dept_id = 2;                     -- ✅ Uses leftmost prefix' },
          { code: 'WHERE salary > 80000;                  -- ❌ Cannot use index!' },
        ],
      },
      {
        title: 'Why Queries Ignore Indexes (Common Traps!)',
        lines: [
          { code: 'WHERE YEAR(hire_date) = 2023; -- ❌ Function on column ignores index' },
          { code: 'WHERE hire_date >= "2023-01-01" AND hire_date < "2024-01-01"; -- ✅ Uses index' },
          { code: 'WHERE email LIKE "%@gmail.com"; -- ❌ Leading wildcard causes full scan' },
          { code: 'WHERE name LIKE "John%";        -- ✅ Prefix wildcard uses B-Tree scan' },
        ],
      },
      {
        title: 'ACID Properties & Isolation Levels',
        lines: [
          { code: 'Atomicity: All-or-nothing execution; rollbacks clean on error' },
          { code: 'Consistency: Preserves all schema constraints, FKs, and invariants' },
          { code: 'Isolation: Concurrent transactions do not corrupt each other' },
          { code: 'Durability: Committed data permanently written to disk/WAL' },
          { code: '-- Isolation levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable' },
        ],
      },
    ],
  },

  {
    id: 'transactions-concurrency',
    title: 'Transactions & Locking',
    symbol: '🔒',
    category: 'perf',
    description: 'Transaction demarcation, savepoints, pessimistic locking, and isolation phenomena.',
    sections: [
      {
        title: 'Transaction Control Commands',
        lines: [
          { code: 'BEGIN TRANSACTION;', comment: '// starts atomic unit of work' },
          { code: 'UPDATE accounts SET balance = balance - 100 WHERE id = 1;' },
          { code: 'UPDATE accounts SET balance = balance + 100 WHERE id = 2;' },
          { code: 'COMMIT;', comment: '// permanently writes changes to disk' },
          { code: 'ROLLBACK;', comment: '// reverts all changes if error occurs' },
        ],
      },
      {
        title: 'Savepoints (Partial Rollback)',
        lines: [
          { code: 'SAVEPOINT sp_deduct;', comment: '// creates checkpoint' },
          { code: 'INSERT INTO audit_log (action) VALUES ("transfer");' },
          { code: 'ROLLBACK TO sp_deduct;', comment: '// reverts only to checkpoint' },
          { code: 'RELEASE SAVEPOINT sp_deduct;', comment: '// destroys checkpoint' },
        ],
      },
      {
        title: 'Row Locking (Pessimistic Concurrency)',
        lines: [
          { code: 'SELECT * FROM inventory WHERE id = 5 FOR UPDATE;', comment: '// exclusive write lock' },
          { code: 'SELECT * FROM inventory WHERE id = 5 FOR SHARE;', comment: '// shared read lock' },
          { code: 'SELECT * FROM tickets FOR UPDATE SKIP LOCKED;', comment: '// worker queue pattern!' },
          { code: 'SELECT * FROM tickets FOR UPDATE NOWAIT;', comment: '// fail immediately if locked' },
        ],
      },
    ],
    interactiveDemo: {
      description: 'Transaction demonstration with rollback and commit',
      code: 'BEGIN TRANSACTION;\nUPDATE employees SET salary = salary + 5000 WHERE department_id = 1;\nSELECT name, salary FROM employees WHERE department_id = 1;\nROLLBACK;\nSELECT name, salary FROM employees WHERE department_id = 1;',
    },
  },
];
