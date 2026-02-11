'use strict';

const crypto = require('crypto');

/**
 * Extract Given/When/Then lines from test-specs.md,
 * normalize whitespace, sort, and compute SHA256 hash.
 *
 * @param {string} content - Raw content of test-specs.md
 * @returns {string|null} SHA256 hex hash, or null if no assertions found
 */
function computeAssertionHash(content) {
  if (!content || typeof content !== 'string') return null;

  const lines = content.split('\n');
  const assertionLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('**Given**:') ||
      trimmed.startsWith('**When**:') ||
      trimmed.startsWith('**Then**:')
    ) {
      // Normalize whitespace: collapse multiple spaces to single space
      const normalized = trimmed.replace(/\s+/g, ' ').trim();
      assertionLines.push(normalized);
    }
  }

  if (assertionLines.length === 0) return null;

  // Sort for deterministic ordering
  assertionLines.sort();

  const joined = assertionLines.join('\n');
  return crypto.createHash('sha256').update(joined, 'utf8').digest('hex');
}

/**
 * Compare current assertion hash against stored hash.
 *
 * @param {string|null} currentHash - Hash computed from current test-specs.md
 * @param {string|null} storedHash - Hash from context.json
 * @returns {{status: string, currentHash: string|null, storedHash: string|null}}
 */
function checkIntegrity(currentHash, storedHash) {
  if (!currentHash || !storedHash) {
    return {
      status: 'missing',
      currentHash: currentHash || null,
      storedHash: storedHash || null
    };
  }

  return {
    status: currentHash === storedHash ? 'valid' : 'tampered',
    currentHash,
    storedHash
  };
}

module.exports = { computeAssertionHash, checkIntegrity };
