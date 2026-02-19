# Bug Reports: Plan Architecture Viewer

## BUG-001

**Reported**: 2026-02-18
**Severity**: medium
**Status**: fixed
**GitHub Issue**: #13

**Description**: Show Tessl tile eval scores when available via API/MCP (deferred feature — FR-014 was specified but KDD-5 deferred implementation until API availability. Tessl MCP search now provides eval data.)

**Reproduction Steps**:
1. Install Tessl tiles in a project (tiles appear in Plan Architecture Viewer)
2. Tessl MCP `search` tool now returns eval data for tiles
3. Open the Plan Architecture Viewer dashboard
4. Tile cards show name and version but no eval scores, even though CSS and data model placeholders already exist and the MCP data source is available

**Root Cause**: `computePlanViewState` called `parseTesslJson` which returns tiles with `eval: null` hardcoded. No mechanism existed to fetch eval data from the Tessl eval API, even though CSS classes and conditional rendering logic were already in place in `renderTesslPanel()`.

**Fix Reference**: Branch `bugfix/013-tessl-tile-eval-scores` — added `fetchTesslEvalData()` function in `src/planview.js` that calls `tessl eval list/view` CLI to fetch eval run data, computes score/multiplier/chartData summary, and enriches tile objects via dependency-injectable eval fetcher in `computePlanViewState()`. Updated `renderTesslPanel()` bar chart in `src/public/index.html` to use `chartData.pass/fail` for pass/fail distribution.
