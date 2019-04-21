# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/elmasse/nextein/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/elmasse/nextein/compare/v2.1.3...v2.1.0
[2.1.3]: https://github.com/elmasse/nextein/compare/v2.0.0...v2.1.0
[2.1.2]: https://github.com/elmasse/nextein/compare/v2.0.0...v2.1.0
[2.1.1]: https://github.com/elmasse/nextein/compare/v2.0.0...v2.1.0
[2.1.0]: https://github.com/elmasse/nextein/compare/v2.0.0...v2.1.0
