# Bug Reports: testify-traceability

## BUG-001

**Reported**: 2026-02-21
**Severity**: high
**Status**: reported
**GitHub Issue**: #30

**Description**: Dashboard parses test-specs.md markdown format but IIKit core has migrated to standard Gherkin .feature files — parser, integrity hash, pipeline detection, and file watcher all reference the old format

**Reproduction Steps**:
1. Run IIKit testify phase which now generates tests/features/*.feature files instead of tests/test-specs.md
2. Open the dashboard for a feature with Gherkin .feature files
3. Observe: Testify panel shows empty state because parser cannot find or parse test-specs.md
4. Observe: Integrity seal shows "Missing" because hash computation targets old file
5. Observe: Pipeline phase detection shows Testify as "not_started" despite .feature files existing

**Root Cause**: _(empty until investigation)_

**Fix Reference**: _(empty until implementation)_
