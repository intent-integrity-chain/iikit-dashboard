'use strict';

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

module.exports = { parseSpecStories, parseTasks };
