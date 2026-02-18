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
  const storyStarts = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    storyStarts.push({
      id: `US${match[1]}`,
      title: match[2].trim(),
      priority: match[3],
      index: match.index
    });
  }

  for (let i = 0; i < storyStarts.length; i++) {
    const start = storyStarts[i].index;
    const end = i + 1 < storyStarts.length ? storyStarts[i + 1].index : content.length;
    const section = content.substring(start, end);

    // Count Given/When/Then scenario blocks (numbered list items starting with digit + .)
    const scenarioCount = (section.match(/^\d+\.\s+\*\*Given\*\*/gm) || []).length;

    // Extract body text (everything after the heading line, trimmed, stop at ---)
    const headingEnd = section.indexOf('\n');
    let body = headingEnd >= 0 ? section.substring(headingEnd + 1) : '';
    const separatorIdx = body.indexOf('\n---');
    if (separatorIdx >= 0) body = body.substring(0, separatorIdx);
    body = body.trim();

    stories.push({
      id: storyStarts[i].id,
      title: storyStarts[i].title,
      priority: storyStarts[i].priority,
      scenarioCount,
      body
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

  // If the only checklist is requirements.md (spec quality checklist from /iikit-01-specify),
  // don't count it — the /iikit-04-checklist phase hasn't run yet
  const hasDomainChecklists = files.some(f => f !== 'requirements.md');
  if (!hasDomainChecklists) return result;

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
 * Parse all checklist files in a directory and return detailed per-file data
 * with individual items, categories, CHK IDs, and tags.
 *
 * Applies same requirements.md-only filter as parseChecklists:
 * if requirements.md is the only file, returns empty array.
 *
 * @param {string} checklistDir - Path to checklists/ directory
 * @returns {Array<{name: string, filename: string, total: number, checked: number, items: Array}>}
 */
function parseChecklistsDetailed(checklistDir) {
  if (!fs.existsSync(checklistDir)) return [];

  const files = fs.readdirSync(checklistDir).filter(f => f.endsWith('.md'));

  // Same filter as parseChecklists: skip if requirements.md is the only file
  const hasDomainChecklists = files.some(f => f !== 'requirements.md');
  if (!hasDomainChecklists) return [];

  const result = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(checklistDir, file), 'utf-8');
    const lines = content.split('\n');

    // Derive human-readable name from filename
    const baseName = file.replace(/\.md$/, '');
    const name = baseName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const items = [];
    let currentCategory = null;
    let totalCount = 0;
    let checkedCount = 0;

    for (const line of lines) {
      // Track category headings (## or ###)
      const headingMatch = line.match(/^#{2,3}\s+(.+)/);
      if (headingMatch) {
        currentCategory = headingMatch[1].trim();
        continue;
      }

      // Parse checkbox items
      const checkboxMatch = line.match(/^- \[([ x])\]\s+(.*)/i);
      if (!checkboxMatch) continue;

      const isChecked = checkboxMatch[1].toLowerCase() === 'x';
      let itemText = checkboxMatch[2].trim();
      totalCount++;
      if (isChecked) checkedCount++;

      // Extract CHK-xxx ID
      let chkId = null;
      const chkMatch = itemText.match(/^(CHK-\d{3})\s+/);
      if (chkMatch) {
        chkId = chkMatch[1];
        itemText = itemText.substring(chkMatch[0].length);
      }

      // Extract trailing tags [tag1] [tag2] — but not the checkbox itself
      const tags = [];
      const tagRegex = /\[([^\]]+)\]\s*$/;
      let tagMatch;
      while ((tagMatch = itemText.match(tagRegex))) {
        // Don't treat spec references like [Completeness, FR-004] as simple tags
        tags.unshift(tagMatch[1]);
        itemText = itemText.substring(0, tagMatch.index).trim();
      }

      items.push({
        text: itemText,
        checked: isChecked,
        chkId,
        category: currentCategory,
        tags
      });
    }

    result.push({
      name,
      filename: file,
      total: totalCount,
      checked: checkedCount,
      items
    });
  }

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
  const rationaleMatch = text.match(/\*\*Rationale\*\*:\s*([\s\S]*?)$/m);
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

/**
 * Parse spec.md to extract functional requirements.
 * Pattern: - **FR-XXX**: description
 *
 * @param {string} content - Raw markdown content of spec.md
 * @returns {Array<{id: string, text: string}>}
 */
function parseRequirements(content) {
  if (!content || typeof content !== 'string') return [];

  const regex = /- \*\*FR-(\d+)\*\*:\s*(.*)/g;
  const requirements = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    requirements.push({
      id: `FR-${match[1]}`,
      text: match[2].trim()
    });
  }

  return requirements;
}

/**
 * Parse spec.md to extract success criteria.
 * Pattern: - **SC-XXX**: description
 *
 * @param {string} content - Raw markdown content of spec.md
 * @returns {Array<{id: string, text: string}>}
 */
function parseSuccessCriteria(content) {
  if (!content || typeof content !== 'string') return [];

  const regex = /- \*\*SC-(\d+)\*\*:\s*(.*)/g;
  const criteria = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    criteria.push({
      id: `SC-${match[1]}`,
      text: match[2].trim()
    });
  }

  return criteria;
}

/**
 * Parse spec.md to extract clarification Q&A entries.
 * Pattern: ### Session YYYY-MM-DD followed by - Q: question -> A: answer [FR-001, US-2]
 *
 * @param {string} content - Raw markdown content of spec.md
 * @returns {Array<{session: string, question: string, answer: string, refs: string[]}>}
 */
function parseClarifications(content) {
  if (!content || typeof content !== 'string') return [];

  // Check for Clarifications section
  if (!/^## Clarifications/m.test(content)) return [];

  const clarifications = [];
  const lines = content.split('\n');
  let currentSession = null;
  let inClarifications = false;

  for (const line of lines) {
    if (/^## Clarifications/.test(line)) {
      inClarifications = true;
      continue;
    }
    if (inClarifications && /^## /.test(line) && !/^## Clarifications/.test(line)) {
      break; // Next top-level section
    }
    if (!inClarifications) continue;

    const sessionMatch = line.match(/^### Session (\d{4}-\d{2}-\d{2})/);
    if (sessionMatch) {
      currentSession = sessionMatch[1];
      continue;
    }

    const qaMatch = line.match(/^- Q:\s*(.*?)\s*->\s*A:\s*(.*)/);
    if (qaMatch && currentSession) {
      let answer = qaMatch[2].trim();
      let refs = [];

      // Extract trailing [FR-001, US-2, SC-003] references
      const refsMatch = answer.match(/\[((?:(?:FR|US|SC)-\w+(?:,\s*)?)+)\]\s*$/);
      if (refsMatch) {
        refs = refsMatch[1].split(/,\s*/).map(r => r.trim());
        answer = answer.substring(0, answer.lastIndexOf('[')).trim();
      }

      clarifications.push({
        session: currentSession,
        question: qaMatch[1].trim(),
        answer,
        refs
      });
    }
  }

  return clarifications;
}

/**
 * Parse spec.md to extract edges from user stories to requirements.
 * Scans entire story sections for FR-xxx patterns.
 *
 * @param {string} content - Raw markdown content of spec.md
 * @returns {Array<{from: string, to: string}>}
 */
function parseStoryRequirementRefs(content) {
  if (!content || typeof content !== 'string') return [];

  const edges = [];
  const storyRegex = /### User Story (\d+) - .+? \(Priority: P\d+\)/g;
  const storyStarts = [];
  let match;

  while ((match = storyRegex.exec(content)) !== null) {
    storyStarts.push({ id: `US${match[1]}`, index: match.index });
  }

  for (let i = 0; i < storyStarts.length; i++) {
    const start = storyStarts[i].index;
    const end = i + 1 < storyStarts.length ? storyStarts[i + 1].index : content.length;
    const section = content.substring(start, end);
    const storyId = storyStarts[i].id;

    const frRegex = /FR-\d+/g;
    const seen = new Set();
    let frMatch;

    while ((frMatch = frRegex.exec(section)) !== null) {
      const frId = frMatch[0];
      if (!seen.has(frId)) {
        seen.add(frId);
        edges.push({ from: storyId, to: frId });
      }
    }
  }

  return edges;
}

/**
 * Parse plan.md Technical Context section to extract key-value entries.
 * Pattern: **Label**: Value
 *
 * @param {string} content - Raw markdown content of plan.md
 * @returns {Array<{label: string, value: string}>}
 */
function parseTechContext(content) {
  if (!content || typeof content !== 'string') return [];

  // Find Technical Context section
  const sectionMatch = content.match(/^## Technical Context\s*$/m);
  if (!sectionMatch) return [];

  const sectionStart = sectionMatch.index + sectionMatch[0].length;
  const nextSection = content.indexOf('\n## ', sectionStart);
  const sectionEnd = nextSection >= 0 ? nextSection : content.length;
  const section = content.substring(sectionStart, sectionEnd);

  const entries = [];
  const regex = /\*\*(.+?)\*\*:\s*(.+)/g;
  let match;

  while ((match = regex.exec(section)) !== null) {
    entries.push({
      label: match[1].trim(),
      value: match[2].trim()
    });
  }

  return entries;
}

/**
 * Parse plan.md File Structure section to extract directory tree entries.
 *
 * @param {string} content - Raw markdown content of plan.md
 * @returns {{rootName: string, entries: Array<{name: string, type: string, comment: string|null, depth: number}>}|null}
 */
function parseFileStructure(content) {
  if (!content || typeof content !== 'string') return null;

  // Find File Structure section, then first code block
  const sectionRegex = /^##[^#].*(?:File Structure|Project Structure|Source Code)/m;
  const sectionMatch = content.match(sectionRegex);
  if (!sectionMatch) return null;

  const afterSection = content.substring(sectionMatch.index);
  const codeBlockMatch = afterSection.match(/```(?:\w*)\n([\s\S]*?)```/);
  if (!codeBlockMatch) return null;

  const treeText = codeBlockMatch[1];
  const lines = treeText.split('\n').filter(l => l.trim());

  if (lines.length === 0) return null;

  // First line ending with / could be:
  // a) A project name to strip (like "iikit-kanban/") — NOT a real directory
  // b) A real directory (like "src/") that should be shown as a tree entry
  // We treat it as a project name ONLY if the name contains a hyphen or number prefix
  // (indicating a project/feature name like "iikit-kanban/", "my-project/")
  // Simple names like "src/", "test/", "lib/" are treated as real directories
  let rootName = '';
  let startIdx = 0;
  const firstLine = lines[0].trim();
  if (firstLine.endsWith('/') && !firstLine.includes('├') && !firstLine.includes('└')) {
    const dirName = firstLine.replace(/\/$/, '');
    const commonDirs = new Set(['src', 'lib', 'test', 'tests', 'bin', 'cmd', 'pkg', 'app', 'api', 'docs', 'public', 'config', 'scripts', 'build', 'dist', 'out', 'vendor', 'internal']);
    const isProjectName = !commonDirs.has(dirName);
    if (isProjectName) {
      rootName = dirName;
      startIdx = 1;
    }
  }

  const entries = [];
  let bareDirDepthOffset = 0; // tracks depth offset from bare directory sections

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];

    // Check for bare directory name (no tree characters, like "test/" between sections)
    const bareDirMatch = line.match(/^([a-zA-Z0-9._-]+\/)\s*(?:#\s*(.*))?$/);
    if (bareDirMatch && !line.includes('├') && !line.includes('└') && !line.includes('│')) {
      const name = bareDirMatch[1].replace(/\/$/, '');
      const comment = bareDirMatch[2] ? bareDirMatch[2].trim() : null;
      entries.push({ name, type: 'directory', comment, depth: 0 });
      bareDirDepthOffset = 1; // subsequent tree entries are children of this directory
      continue;
    }

    // Calculate depth from tree characters
    let depth = 0;

    // Count depth by finding the position of the tree branch
    const branchMatch = line.match(/^([\s│]*)[├└]/);
    if (branchMatch) {
      const prefix = branchMatch[1];
      // Each nesting level is typically 4 chars (│   or    )
      depth = Math.round(prefix.replace(/│/g, ' ').length / 4) + bareDirDepthOffset;
    }

    // Extract name and optional comment
    const entryMatch = line.match(/[├└]──\s*([^#\n]+?)(?:\s+#\s*(.*))?$/);
    if (!entryMatch) continue;

    let name = entryMatch[1].trim();
    const comment = entryMatch[2] ? entryMatch[2].trim() : null;

    // Determine if directory
    const isDir = name.endsWith('/');
    if (isDir) name = name.replace(/\/$/, '');

    entries.push({
      name,
      type: isDir ? 'directory' : 'file',
      comment,
      depth
    });
  }

  // Mark entries as directories if they have children at greater depth
  for (let i = 0; i < entries.length; i++) {
    if (i + 1 < entries.length && entries[i + 1].depth > entries[i].depth) {
      entries[i].type = 'directory';
    }
  }

  return { rootName, entries };
}

/**
 * Parse plan.md Architecture Overview section to extract ASCII diagram.
 * Detects boxes using box-drawing characters and connections between them.
 *
 * @param {string} content - Raw markdown content of plan.md
 * @returns {{nodes: Array, edges: Array, raw: string}|null}
 */
function parseAsciiDiagram(content) {
  if (!content || typeof content !== 'string') return null;

  // Find Architecture Overview section
  const sectionMatch = content.match(/^## Architecture Overview\s*$/m);
  if (!sectionMatch) return null;

  const afterSection = content.substring(sectionMatch.index);
  const codeBlockMatch = afterSection.match(/```(?:\w*)\n([\s\S]*?)```/);
  if (!codeBlockMatch) return null;

  const raw = codeBlockMatch[1];
  const lines = raw.split('\n');

  // Build 2D grid
  const grid = lines.map(l => [...l]);
  const height = grid.length;
  const width = Math.max(...grid.map(r => r.length), 0);

  // Track which cells belong to boxes
  const boxCells = Array.from({ length: height }, () => new Array(width).fill(false));

  const nodes = [];
  const used = Array.from({ length: height }, () => new Array(width).fill(false));

  // Find all boxes: scan for ┌ characters (don't skip used — allows nested boxes)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < (grid[y] ? grid[y].length : 0); x++) {
      if (grid[y][x] === '┌') {
        const box = traceBox(grid, x, y, used);
        if (box) {
          // Mark cells
          for (let by = box.y; by <= box.y2; by++) {
            for (let bx = box.x; bx <= box.x2; bx++) {
              boxCells[by][bx] = true;
            }
          }

          // Extract text content
          const textLines = [];
          for (let by = box.y + 1; by < box.y2; by++) {
            const lineText = lines[by]
              ? lines[by].substring(box.x + 1, box.x2).replace(/│/g, ' ').trim()
              : '';
            if (lineText) textLines.push(lineText);
          }

          if (textLines.length > 0) {
            nodes.push({
              id: `node-${nodes.length}`,
              label: textLines[0],
              content: textLines.join('\n'),
              type: 'default',
              x: box.x,
              y: box.y,
              width: box.x2 - box.x,
              height: box.y2 - box.y
            });
          }
        }
      }
    }
  }

  // Filter out container boxes (boxes that fully enclose other boxes)
  // Keep only leaf nodes — containers are decorative grouping in ASCII art
  const leafNodes = nodes.filter(node => {
    const containsOther = nodes.some(other =>
      other !== node &&
      other.x > node.x && other.y > node.y &&
      other.x + other.width < node.x + node.width &&
      other.y + other.height < node.y + node.height
    );
    return !containsOther;
  });
  nodes.length = 0;
  nodes.push(...leafNodes);

  // Find edges: look for connector characters between boxes
  const edges = [];
  const connectorChars = new Set(['│', '─', '┬', '┴', '├', '┤', '┼', '┌', '┐', '└', '┘']);

  // Simple edge detection: find vertical connectors between box boundaries
  for (let x = 0; x < width; x++) {
    let lastBoxIdx = -1;
    let hasConnector = false;
    let labelText = '';

    for (let y = 0; y < height; y++) {
      const ch = grid[y] && grid[y][x] ? grid[y][x] : ' ';

      // Check if we're at a box boundary
      for (let ni = 0; ni < nodes.length; ni++) {
        const n = nodes[ni];
        if (x >= n.x && x <= n.x + n.width) {
          if (y === n.y || y === n.y + n.height) {
            if (lastBoxIdx >= 0 && lastBoxIdx !== ni && hasConnector) {
              // Found an edge
              const existingEdge = edges.find(
                e => (e.from === nodes[lastBoxIdx].id && e.to === nodes[ni].id) ||
                     (e.from === nodes[ni].id && e.to === nodes[lastBoxIdx].id)
              );
              if (!existingEdge) {
                edges.push({
                  from: nodes[lastBoxIdx].id,
                  to: nodes[ni].id,
                  label: labelText.trim() || null
                });
              }
            }
            lastBoxIdx = ni;
            hasConnector = false;
            labelText = '';
          }
        }
      }

      if (!boxCells[y][x] && (ch === '│' || ch === '┬' || ch === '┴' || ch === '┤' || ch === '├')) {
        hasConnector = true;
        // Look for label text on the same line, to the right of connector
        if (grid[y]) {
          const restOfLine = lines[y] ? lines[y].substring(x + 1).trim() : '';
          if (restOfLine && !connectorChars.has(restOfLine[0])) {
            labelText = restOfLine.split(/[┌┐└┘│─┬┴├┤┼]/).filter(Boolean)[0] || '';
          }
        }
      }
    }
  }

  return { nodes, edges, raw };
}

/**
 * Trace a box from its top-left corner.
 */
function traceBox(grid, startX, startY, used) {
  const height = grid.length;

  const topEdgeChars = new Set(['─', '┬', '┴', '┼']);
  const leftEdgeChars = new Set(['│', '├', '┤', '┼']);

  // Find top-right corner (┐)
  let x2 = startX + 1;
  while (x2 < (grid[startY] ? grid[startY].length : 0) && grid[startY][x2] !== '┐') {
    if (!topEdgeChars.has(grid[startY][x2])) return null;
    x2++;
  }
  if (x2 >= (grid[startY] ? grid[startY].length : 0)) return null;

  // Find bottom-left corner (└)
  let y2 = startY + 1;
  while (y2 < height && grid[y2] && grid[y2][startX] !== '└') {
    if (!leftEdgeChars.has(grid[y2][startX])) return null;
    y2++;
  }
  if (y2 >= height) return null;

  // Verify bottom-right corner (┘)
  if (!grid[y2] || grid[y2][x2] !== '┘') return null;

  // Mark used
  for (let y = startY; y <= y2; y++) {
    for (let x = startX; x <= x2; x++) {
      if (used[y]) used[y][x] = true;
    }
  }

  return { x: startX, y: startY, x2, y2 };
}

/**
 * Parse tessl.json to extract installed tiles.
 *
 * @param {string} projectPath - Path to project root
 * @returns {Array<{name: string, version: string, eval: null}>}
 */
function parseTesslJson(projectPath) {
  const tesslPath = path.join(projectPath, 'tessl.json');
  if (!fs.existsSync(tesslPath)) return [];

  try {
    const content = fs.readFileSync(tesslPath, 'utf-8');
    const json = JSON.parse(content);
    if (!json.dependencies || typeof json.dependencies !== 'object') return [];

    return Object.entries(json.dependencies).map(([name, info]) => ({
      name,
      version: info.version || 'unknown',
      eval: null
    }));
  } catch {
    return [];
  }
}

/**
 * Parse research.md to extract decision entries.
 *
 * @param {string} content - Raw markdown content of research.md
 * @returns {Array<{title: string, decision: string, rationale: string}>}
 */
function parseResearchDecisions(content) {
  if (!content || typeof content !== 'string') return [];

  // Check for Decisions section
  if (!/^## Decisions/m.test(content)) return [];

  const decisions = [];
  const lines = content.split('\n');
  let inDecisions = false;
  let current = null;

  for (const line of lines) {
    if (/^## Decisions/.test(line)) {
      inDecisions = true;
      continue;
    }
    if (inDecisions && /^## /.test(line) && !/^## Decisions/.test(line)) {
      break;
    }
    if (!inDecisions) continue;

    const titleMatch = line.match(/^### \d+\.\s+(.+)/);
    if (titleMatch) {
      if (current) decisions.push(current);
      current = { title: titleMatch[1].trim(), decision: '', rationale: '' };
      continue;
    }

    if (current) {
      const decisionMatch = line.match(/^\*\*Decision\*\*:\s*(.+)/);
      if (decisionMatch) {
        current.decision = decisionMatch[1].trim();
        continue;
      }
      const rationaleMatch = line.match(/^\*\*Rationale\*\*:\s*(.+)/);
      if (rationaleMatch) {
        current.rationale = rationaleMatch[1].trim();
      }
    }
  }

  if (current) decisions.push(current);
  return decisions;
}

module.exports = { parseSpecStories, parseTasks, parseChecklists, parseChecklistsDetailed, parseConstitutionTDD, hasClarifications, parseConstitutionPrinciples, parseRequirements, parseSuccessCriteria, parseClarifications, parseStoryRequirementRefs, parseTechContext, parseFileStructure, parseAsciiDiagram, parseTesslJson, parseResearchDecisions };
