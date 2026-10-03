/**
 * Lightweight SQL beautifier that capitalizes keywords and cleans up indentation
 */
export function formatSql(sql: string): string {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'HAVING', 'ORDER BY',
    'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN',
    'CROSS JOIN', 'ON', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'OVER', 'PARTITION BY', 'ROW_NUMBER',
    'RANK', 'DENSE_RANK', 'LEAD', 'LAG', 'WITH', 'UNION', 'UNION ALL', 'INTERSECT',
    'EXCEPT', 'NOT IN', 'IN', 'EXISTS', 'NOT EXISTS', 'IS NULL', 'IS NOT NULL',
    'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'TRUNCATE TABLE', 'INSERT INTO',
    'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'BEGIN TRANSACTION', 'COMMIT', 'ROLLBACK'
  ];

  let formatted = sql.trim();

  // Keyword capitalization
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, kw);
  });

  // Ensure major clauses start on a new line if not already
  const majorClauses = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT',
    'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'
  ];

  majorClauses.forEach((clause) => {
    const regex = new RegExp(`(?<!\\n)\\b${clause}\\b`, 'g');
    formatted = formatted.replace(regex, `\n${clause}`);
  });

  return formatted.trim();
}
