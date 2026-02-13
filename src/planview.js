'use strict';

const fs = require('fs');
const path = require('path');
const { parseTechContext, parseFileStructure, parseAsciiDiagram, parseTesslJson, parseResearchDecisions } = require('./parser');

module.exports = { computePlanViewState, classifyNodeTypes };

// In-memory cache for LLM classification results per feature
const classificationCache = new Map();

/**
 * Compute plan view state from parsed plan.md data.
 * Follows the same pattern as board.js and storymap.js.
 *
 * @param {string} projectPath - Path to project root
 * @param {string} featureId - Feature directory name
 * @returns {Promise<Object>} Plan view state
 */
async function computePlanViewState(projectPath, featureId) {
  const featureDir = path.join(projectPath, 'specs', featureId);
  const planPath = path.join(featureDir, 'plan.md');

  if (!fs.existsSync(planPath)) {
    return {
      techContext: [],
      researchDecisions: [],
      fileStructure: null,
      diagram: null,
      tesslTiles: [],
      exists: false,
    };
  }

  const planContent = fs.readFileSync(planPath, 'utf-8');

  // Parse tech context
  const techContext = parseTechContext(planContent);

  // Parse research decisions for tooltips
  const researchPath = path.join(featureDir, 'research.md');
  let researchDecisions = [];
  if (fs.existsSync(researchPath)) {
    const researchContent = fs.readFileSync(researchPath, 'utf-8');
    researchDecisions = parseResearchDecisions(researchContent);
  }

  // Parse file structure and check existence
  let fileStructure = parseFileStructure(planContent);
  if (fileStructure) {
    fileStructure.entries = fileStructure.entries.map(entry => {
      const filePath = buildFilePath(fileStructure.entries, entry, fileStructure.rootName);
      const fullPath = path.join(projectPath, filePath);
      return { ...entry, exists: fs.existsSync(fullPath) };
    });
  }

  // Parse ASCII diagram
  let diagram = parseAsciiDiagram(planContent);
  if (diagram && diagram.nodes.length > 0) {
    // Classify node types via LLM (with cache and fallback)
    const cacheKey = `${featureId}:${planContent.length}`;
    if (classificationCache.has(cacheKey)) {
      const cached = classificationCache.get(cacheKey);
      diagram.nodes = diagram.nodes.map(n => ({
        ...n,
        type: cached[n.label] || 'default'
      }));
    } else {
      const labels = diagram.nodes.map(n => n.label);
      const types = await classifyNodeTypes(labels);
      classificationCache.set(cacheKey, types);
      diagram.nodes = diagram.nodes.map(n => ({
        ...n,
        type: types[n.label] || 'default'
      }));
    }
  }

  // Parse tessl.json
  const tesslTiles = parseTesslJson(projectPath);

  return {
    techContext,
    researchDecisions,
    fileStructure,
    diagram,
    tesslTiles,
    exists: true,
  };
}

/**
 * Build file path from tree entries by walking up the depth chain.
 */
function buildFilePath(entries, targetEntry, rootName) {
  const idx = entries.indexOf(targetEntry);
  const parts = [targetEntry.name];
  let currentDepth = targetEntry.depth;

  // Walk backwards to find all parent directories
  for (let i = idx - 1; i >= 0; i--) {
    if (entries[i].depth < currentDepth && entries[i].type === 'directory') {
      parts.unshift(entries[i].name);
      currentDepth = entries[i].depth;
      if (currentDepth === 0) break;
    }
  }

  // If entry is at depth 0 and has no directory parent, prepend rootName
  if (currentDepth === 0 && rootName && parts[0] !== rootName) {
    // Check if the entry is NOT under a different depth-0 directory
    // (i.e., it belongs to the rootName section)
    let hasDepth0DirParent = false;
    for (let i = idx - 1; i >= 0; i--) {
      if (entries[i].depth === 0 && entries[i].type === 'directory') {
        hasDepth0DirParent = true;
        break;
      }
    }
    if (!hasDepth0DirParent) {
      parts.unshift(rootName);
    }
  }

  return parts.join('/');
}

/**
 * Classify diagram node labels into component types using LLM.
 * Falls back to all "default" if API key is missing or call fails.
 *
 * @param {string[]} labels - Node labels to classify
 * @returns {Promise<Object>} Mapping of label -> type
 */
async function classifyNodeTypes(labels) {
  const result = {};
  for (const label of labels) result[label] = 'default';

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || labels.length === 0) return result;

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Classify each of these software architecture diagram component labels into exactly one category: "client", "server", "storage", or "external".

Labels: ${JSON.stringify(labels)}

Respond with ONLY a JSON object mapping each label to its category. Example: {"Browser": "client", "API Server": "server"}
No explanation, just the JSON.`
      }]
    }, { signal: controller.signal });

    clearTimeout(timeout);

    const text = response.content[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const validTypes = new Set(['client', 'server', 'storage', 'external']);
      for (const [label, type] of Object.entries(parsed)) {
        if (validTypes.has(type)) {
          result[label] = type;
        }
      }
    }
  } catch {
    // Fallback: all nodes get "default" type
  }

  return result;
}

/**
 * Invalidate classification cache for a feature.
 */
function invalidateCache(featureId) {
  for (const key of classificationCache.keys()) {
    if (key.startsWith(`${featureId}:`)) {
      classificationCache.delete(key);
    }
  }
}

module.exports.invalidateCache = invalidateCache;
