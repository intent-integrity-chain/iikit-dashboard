# IIKit Dashboard (Archived)

> **This repository has been archived.** The dashboard is now part of [Intent Integrity Kit (IIKit)](https://github.com/intent-integrity-chain/kit). See [DASHBOARD.md](https://github.com/intent-integrity-chain/kit/blob/main/DASHBOARD.md) in the kit repo for current documentation.

---

The IIKit dashboard visualizes every phase of the specification-driven development workflow — from governance constitution through specification, testing, and implementation — with live updates as artifacts change on disk.

As of v2.0.0, the dashboard generates a static HTML file instead of running a server process. The generator has been folded into IIKit core.

## Migration

If you were using `npx iikit-dashboard`, switch to the built-in dashboard generation in IIKit:

```bash
# Install/update IIKit
tessl install tessl-labs/intent-integrity-kit

# Dashboard generates automatically during the workflow,
# or generate manually:
node src/generate-dashboard.js /path/to/project
```

## License

MIT
