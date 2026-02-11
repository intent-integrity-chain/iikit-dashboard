'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Parse spec.md to extract user stories.
 * Pattern: ### User Story N - Title (Priority: PX)
 *
 * @param {string} content - Raw markdown content of spec.md
 * @returns {Array<{id: string, title: string, priority: string}>}
 */
function parseSpecStories(content) {
  if (!content || typeof content !== 'string') return [];

  const regex = /### User Story (\d+) - (.+?) \(Priority: (P\d+)\)/g;
  const stories = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    stories.push({
      id: `US${match[1]}`,
      title: match[2].trim(),
      priority: match[3]
    });
  }

  return stories;
}

/**
 * Parse tasks.md to extract tasks with checkbox status and story tags.
 * Pattern: - [x] TXXX [P]? [USy]? Description
 *
 * @param {string} content - Raw markdown content of tasks.md
 * @returns {Array<{id: string, storyTag: string|null, description: string, checked: boolean}>}
 */
function parseTasks(content) {
  if (!content || typeof content !== 'string') return [];

  const regex = /- \[([ x])\] (T\d+)\s+(?:\[P\]\s*)?(?:\[(US\d+)\]\s*)?(.*)/g;
  const tasks = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    tasks.push({
      id: match[2],
      storyTag: match[3] || null,
      description: match[4].trim(),
      checked: match[1] === 'x'
    });
  }

  return tasks;
}

/**
 * Parse all checklist files in a directory and return aggregate completion.
 *
 * @param {string} checklistDir - Path to checklists/ directory
 * @returns {{total: number, checked: number, percentage: number}}
 */
function parseChecklists(checklistDir) {
  const result = { total: 0, checked: 0, percentage: 0 };

  if (!fs.existsSync(checklistDir)) return result;

  const files = fs.readdirSync(checklistDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(checklistDir, file), 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      if (/- \[x\]/i.test(line)) {
        result.total++;
        result.checked++;
      } else if (/- \[ \]/.test(line)) {
        result.total++;
      }
    }
  }

  result.percentage = result.total > 0 ? Math.round((result.checked / result.total) * 100) : 0;
  return result;
}

/**
 * Parse CONSTITUTION.md to determine if TDD is required.
 * Looks for strong TDD indicators combined with MUST/NON-NEGOTIABLE.
 *
 * @param {string} constitutionPath - Path to CONSTITUTION.md
 * @returns {boolean} true if TDD is required
 */
function parseConstitutionTDD(constitutionPath) {
  if (!fs.existsSync(constitutionPath)) return false;

  const content = fs.readFileSync(constitutionPath, 'utf-8').toLowerCase();
  const hasTDDTerms = /\btdd\b|test-first|red-green-refactor|write tests before|tests must be written before/.test(content);
  const hasMandatory = /\bmust\b|\brequired\b|non-negotiable/.test(content);

  return hasTDDTerms && hasMandatory;
}

/**
 * Check if spec.md content contains a Clarifications section.
 *
 * @param {string} specContent - Raw content of spec.md
 * @returns {boolean}
 */
function hasClarifications(specContent) {
  if (!specContent || typeof specContent !== 'string') return false;
  return /^## Clarifications/m.test(specContent);
}

/**
 * Parse CONSTITUTION.md to extract principles with full details and version metadata.
 *
 * @param {string} projectPath - Path to the project root
 * @returns {{principles: Array<{number: string, name: string, text: string, rationale: string, level: string}>, version: {version: string, ratified: string, lastAmended: string}|null, exists: boolean}}
 */
function parseConstitutionPrinciples(projectPath) {
  const constitutionPath = path.join(projectPath, 'CONSTITUTION.md');

  if (!fs.existsSync(constitutionPath)) {
    return { principles: [], version: null, exists: false };
  }

  const content = fs.readFileSync(constitutionPath, 'utf-8');
  const lines = content.split('\n');
  const principles = [];

  // Find principles: ### N. Name pattern (Roman numerals)
  const principleRegex = /^### ([IVXLC]+)\.\s+(.+?)(?:\s+\(.*\))?\s*$/;

  let currentPrinciple = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(principleRegex);

    if (match) {
      // Save previous principle
      if (currentPrinciple) {
        finalizePrinciple(currentPrinciple);
        principles.push(currentPrinciple);
      }
      currentPrinciple = {
        number: match[1],
        name: match[2].trim(),
        text: '',
        rationale: '',
        level: 'SHOULD'
      };
    } else if (currentPrinciple) {
      // Stop collecting if we hit a ## heading (next section)
      if (/^## /.test(line)) {
        finalizePrinciple(currentPrinciple);
        principles.push(currentPrinciple);
        currentPrinciple = null;
      } else {
        currentPrinciple.text += line + '\n';
      }
    }
  }

  // Don't forget the last principle
  if (currentPrinciple) {
    finalizePrinciple(currentPrinciple);
    principles.push(currentPrinciple);
  }

  // Parse version from footer
  const versionMatch = content.match(/\*\*Version\*\*:\s*(\S+)\s*\|\s*\*\*Ratified\*\*:\s*(\S+)\s*\|\s*\*\*Last Amended\*\*:\s*(\S+)/);
  const version = versionMatch
    ? { version: versionMatch[1], ratified: versionMatch[2], lastAmended: versionMatch[3] }
    : null;

  return { principles, version, exists: true };
}

/**
 * Finalize a principle: extract rationale and determine obligation level.
 */
function finalizePrinciple(principle) {
  const text = principle.text.trim();

  // Extract rationale
  const rationaleMatch = text.match(/\*\*Rationale\*\*:\s*([\s\S]*)/);
  if (rationaleMatch) {
    principle.rationale = rationaleMatch[1].trim();
  }

  // Determine obligation level (strongest keyword wins)
  if (/\bMUST\b/.test(text)) {
    principle.level = 'MUST';
  } else if (/\bSHOULD\b/.test(text)) {
    principle.level = 'SHOULD';
  } else if (/\bMAY\b/.test(text)) {
    principle.level = 'MAY';
  }

  principle.text = text;
}

module.exports = { parseSpecStories, parseTasks, parseChecklists, parseConstitutionTDD, hasClarifications, parseConstitutionPrinciples };
