import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code }) => {
  const formatSqlToken = (text: string) => {
    // If the line is purely a comment (starts with -- or //)
    if (text.trim().startsWith('--') || text.trim().startsWith('//')) {
      return `<span style="color:#008000;font-style:italic;">${escapeHtml(text)}</span>`;
    }

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'ON', 'AS', 'IS', 'NULL',
      'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'JOIN',
      'GROUP BY', 'HAVING', 'ORDER BY', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'DISTINCT',
      'BETWEEN', 'LIKE', 'ILIKE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'OVER',
      'PARTITION BY', 'ROWS BETWEEN', 'RANGE BETWEEN', 'UNBOUNDED PRECEDING',
      'CURRENT ROW', 'PRECEDING', 'FOLLOWING', 'UNION', 'UNION ALL', 'INTERSECT',
      'EXCEPT', 'MINUS', 'EXISTS', 'NOT EXISTS', 'WITH', 'RECURSIVE', 'NULLS FIRST',
      'NULLS LAST', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'TRUNCATE TABLE',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'PRIMARY KEY',
      'FOREIGN KEY', 'REFERENCES', 'CHECK', 'DEFAULT', 'AUTOINCREMENT', 'VARCHAR',
      'INTEGER', 'DECIMAL', 'TIMESTAMP', 'DATE', 'CASCADE'
    ];

    const functions = [
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'CEIL', 'FLOOR', 'ABS', 'MOD',
      'POWER', 'COALESCE', 'NULLIF', 'IFNULL', 'ROW_NUMBER', 'RANK', 'DENSE_RANK',
      'LEAD', 'LAG', 'FIRST_VALUE', 'LAST_VALUE', 'NTILE', 'CONCAT', 'CONCAT_WS',
      'SUBSTRING', 'SUBSTR', 'LENGTH', 'CHAR_LENGTH', 'UPPER', 'LOWER', 'INITCAP',
      'TRIM', 'LTRIM', 'RTRIM', 'LPAD', 'RPAD', 'INSTR', 'POSITION', 'REPLACE',
      'STRING_AGG', 'GROUP_CONCAT', 'DATE_TRUNC', 'strftime', 'DATEDIFF', 'DATE_ADD',
      'DATE_SUB', 'EXTRACT', 'NOW', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP',
      'CAST'
    ];

    let escaped = escapeHtml(text);

    // 1. Strings (red)
    escaped = escaped.replace(/(["'].*?["'])/g, '<span style="color:#cc0000;font-weight:500;">$1</span>');

    // 2. Numbers (crimson / brown)
    escaped = escaped.replace(/\b([0-9]+(?:\.[0-9]+)?)\b/g, '<span style="color:#b31414;">$1</span>');

    // 3. Built-in SQL Functions (deep blue/purple)
    functions.forEach((fn) => {
      const regex = new RegExp(`\\b(${fn})\\s*(?=\\()`, 'gi');
      escaped = escaped.replace(regex, '<span style="color:#004499;font-weight:bold;">$1</span>');
    });

    // 4. Keywords (bold dark blue)
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
      escaped = escaped.replace(regex, '<span style="color:#0000cc;font-weight:bold;">$1</span>');
    });

    // 5. In-line comments starting with -- or //
    escaped = escaped.replace(/(--.*$|\/\/.*$)/g, '<span style="color:#008000;font-style:italic;">$1</span>');

    return escaped;
  };

  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  return <span className="font-mono" dangerouslySetInnerHTML={{ __html: formatSqlToken(code) }} />;
};
