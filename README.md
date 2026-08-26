# LifeXP icon pack workflow

This package contains the standalone GitHub Actions workflow and local builder for the Game-icons source ZIP.

Included files:

- `.github/workflows/build-icon-pack.yml`
- `tools/build_icon_pack.js`
- `assets/icon-pack/selection.schema.json`
- `docs/ICON-PACK-WORKFLOW.md`

The real source ZIP is intentionally not included because it was not available in the local workspace. The workflow requires that ZIP as an explicit repository input and preserves its license files in the generated artifact. It never downloads or guesses assets.
