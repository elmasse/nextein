# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Updated dependencies.
### Removed
- Remove `_entries` from `__NEXT_DATA__` reducing size of exported html up to 45%.

## [2.3.4] - 2020-04-06
### Fixed
- Warning on mdast. Use standard `allowDangerousHtml`. 
- Updated dependencies.

## [2.3.3] - 2019-12-27
### Fixed
- Issue with `path-to-regexp@6.1.0` import. 

## [2.3.2] - 2019-12-23
### Fixed
- Update dependencies.

## [2.3.1] - 2019-10-12
### Added
- Disabled telemetry for next.

### Fixed
- Update dependencies.

## [2.3.0] - 2019-07-18
### Added
- Support for `next v9`.
- Move to `babel v7`.
- Tests for `node v12`.
- Chainable `withPostsFilterBy`

### Fixed
- Linter issues.
- Updated Dependencies.

### Removed
- Support for `next v6` and `next v7`.

## [2.2.0] - 2019-02-27
### Added
- Nextein plugin markdown options and documentation.
- Import Content from its own `nextein/content` file.

### Fixed
- Issue with posts and HMR.

## [2.1.3] - 2019-02-12
### Fixed
- Issue with `next v8.0.0` export forking threads.
- Content render and exports.

## [2.1.2] - 2018-11-21
### Fixed
- Minor issue with `excerpt` in Content not returning correct values.

## [2.1.1] - 2018-11-20
### Added
- Log error with `excerpt` in Content to avoid failing silently.

## [2.1.0] - 2018-11-18

## 2.0.0 - 2018-10-22
### Added
- Plugins for read & transform entries.
- Configuration for nextein plugins in `next.config.js` using nextein.
- Export posts as static json files.

### Removed
- Entries from `__NEXT_DATA__`.

[Unreleased]: https://github.com/elmasse/nextein/compare/v2.3.4...HEAD
[2.3.4]: https://github.com/elmasse/nextein/compare/v2.3.3...v2.3.4
[2.3.3]: https://github.com/elmasse/nextein/compare/v2.3.2...v2.3.3
[2.3.2]: https://github.com/elmasse/nextein/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/elmasse/nextein-ws/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/elmasse/nextein-ws/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/elmasse/nextein/compare/v2.1.3...v2.1.0
[2.1.3]: https://github.com/elmasse/nextein/compare/v2.0.0...v2.1.0
[2.1.2]: https://github.com/elmasse/nextein/compare/v2.0.0...v2.1.0
[2.1.1]: https://github.com/elmasse/nextein/compare/v2.0.0...v2.1.0
[2.1.0]: https://github.com/elmasse/nextein/compare/v2.0.0...v2.1.0
