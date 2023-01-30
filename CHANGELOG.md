# Changelog
## 1.1.0
_30 January 2023_

**Breaking**
- Rename `build.js` to `cli.js`
- Rename directory `bin/` to `out/`
- Change export parsing to only support destructuring syntax

**Additions**
- `try..catch..finally` statement
- `in` keyword
- `import * as foo from 'foo'` statement
- Support for template string literal quotes

**Other Changes**
- Fix return without expression
- Remove unused scope system
- cli:
  - Add `self` command for recompilation
  - Support compilation of arbitrary files by providing file path as argument
  - Add `help` and `version` commands

## 1.0.0
_23 January 2023_

Initial Release
