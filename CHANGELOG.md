# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Support next v13 in peer dependencies.
- Updated dev dependencies.
- Updated jest test snapshots.

## [4.2.0] - 2022-09-12
### Fixed
- Major issue with next 12.3.0. Worker not reading plugin config thru env vars.

## [4.1.1] - 2022-08-10
### Fixed
- Fixed warn with nextein property in next config.

## [4.1.0] - 2022-08-10
### Added
- Include node v18 in CI test environments.

### Fixed
- Fixed warn with assetPrefix in config with next v12.2
- Updated dependencies.

### Removed
- Removed node v12 fro CI test environments.
- Removed `taskr`.

## [4.0.5] - 2022-04-01
### Fixed
- Added react v18 to peerDeps.

## [4.0.4] - 2022-02-12
### Fixed
- Moved cache out of .next directory. [#346](https://github.com/elmasse/nextein/issues/346)

## [4.0.3] - 2022-01-31
### Fixed
- Issue with using missing babel runtime dependency.
- Update dependencies.
- Issue with unhandled error while writing cache when .next directory wasn't created.

## [4.0.2] - 2022-01-31
### Fixed
- Issue with using an old transitive dependency in render loader.
- Upgrade to work with next v12.0.9
- Test fixed for render plugin loader.

## [4.0.1] - 2022-01-05
### Fixed
- Performance issue caused by getStaticPaths running in either a child process or a Worker. Reimplemented Cache.

## [4.0.0] - 2022-01-03
### Added
- Support for Next.js dynamic routes.
- Support for Next.js `getStaticProps` and `getStaticPaths` using fetcher methods.

### Fixed
- Issues with `fetcher` not working properly.
- Documentation.
- Issues with generated files sizes.

### Removed
- HOCs `withPost`, `withPosts` and all filtered variants.
- `nextein` binary.
- `Link` component.
- `url` and `permalink` from generted data in post.
- Generated json files from the export process.

## [3.2.5] - 2021-11-04
### Fixed
- Adde next v12 to peerDependencies.

## [3.2.4] - 2021-10-18
### Fixed
- Improved size of generated files.
- Removed unnecessary rehype-parse from `markdown-plugin` render method.

## [3.2.3] - 2021-09-30
### Fixed
- Issue with missing post json file when production build is re-deployed. #338

## [3.2.2] - 2021-09-24
### Fixed
- Issue with `page` not overriding defaults.

## [3.2.1] - 2021-09-24
### Fixed
- Issue with `nextein dev` not working with next v11+

## [3.2.0] - 2021-08-03
### Added
- `source-filesystem` param `data` to add default metadata (extra) for each entry.
- Tests for source-filesystem.
- Tests for fetcher.

### Fixed
- Issue with `fetcher` function `getPostsByFilter` loading all entries when filter returned no results.

## [3.1.3] - 2021-07-22
### Fixed
- Issue with `nextein build` failing on Windows. (#333)

## [3.1.2] - 2021-06-25
### Fixed
- Issue with `rehype-raw` removing position information. Update to latest version  and patch usage with workaround to keep position information.

## [3.1.1] - 2021-06-23
### Fixed
- Issue with `rehype-raw` removing position information. Reverted to `rehype-raw@^4`.

## [3.1.0] - 2021-06-23
### Fixed
- Issue with next v11 webpack5 check
- issue with webpack configuration.
- Include next v11 in peerDependencies list.

## [3.0.2] - 2021-06-02
### Fixed
- Issue with old remark-parse dependency.
- Upgrade dependencies.

## [3.0.1] - 2021-02-23
### Fixed
- Issue with next config future flag for webpack5.

## [3.0.0] - 2020-11-20
### Added
- New Plugin System. Evolved into stages.
- New File System Plugin for `source`.
- Improved / Refactored `markdown` plugin.
- New `render` Plugin for `Content`.
- Fast refresh for posts/entries via `source` plugin.
- New `fetcher` for loading/querying posts in dynamic routes. (*Experimental*)
- Moved `inCategory` to `nextein/filters`. Still exported from `nextein/posts`.
- Added `query` object params into filter functions fo `withPostsFilterBy`.
- Added `query` object to attached info in `nextein/link` for matching urls.
- Added `post` resolved from `query.__id` in `withPosts` and `withPostsFilterBy` to avoid nesting HOCs.

### Fixed
- Issue with trailing slash export configuration.
- Issue with `nextein/link` not compliant with latest changes from Next.
- Issue with `nextein/link` rendering posts with no `page` or `page` set to `false`.

### Removed
- Support for Next lower than v9.5.
- Support for Node lower than v10

## [2.7.3] - 2020-08-15
### Fixed
- Fix issue with `nextein/link` causing a warning on href not matching on Server and Client.

## [2.7.1] - 2020-07-28
### Fixed
- Fix issue with next v9.5.0 throwing error when a post is modified.

## [2.7.0] - 2020-07-27
### Added
- `Content` exposes `ref` to inner element.

## [2.6.0] - 2020-07-17
### Fixed
- Re-sync binaries with next. Make one single binary and import dev cli code as in next binary.
- Test run in Play.js

## [2.5.1] - 2020-05-11
### Fixed
- Issue with `nextein export` on Windows. #314

## [2.5.0] - 2020-05-05
### Added
- `exportPathMap` receives now all paths including those from Nextein entries and all urls generated by Next.
  This eliminates the need to define extra pages in the exportPathMap.

### Fixed
- Fixed issues with exportPathMap (Related to #311):
  - User can modify the exported values including the pages generated by Next (defaultPathMap) and Nextein entries.
  - Remove the `/` url added by Nextein.
  - Pass all urls to `exportPathMap`: (defaultPathMap - entries pages ) + entries urls.
- Updated dependencies.

## [2.4.1] - 2020-04-27
### Fixed
- Dev issue running on Windows. Normalized path after glob is applied. #309.

## [2.4.0] - 2020-04-12
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

[Unreleased]: https://github.com/elmasse/nextein/compare/v4.1.1...HEAD
[4.1.1]: https://github.com/elmasse/nextein/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/elmasse/nextein/compare/v4.0.5...v4.1.0
[4.0.5]: https://github.com/elmasse/nextein/compare/v4.0.4...v4.0.5
[4.0.4]: https://github.com/elmasse/nextein/compare/v4.0.3...v4.0.4
[4.0.3]: https://github.com/elmasse/nextein/compare/v4.0.2...v4.0.3
[4.0.2]: https://github.com/elmasse/nextein/compare/v4.0.1...v4.0.2
[4.0.1]: https://github.com/elmasse/nextein/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/elmasse/nextein/compare/v3.2.5...v4.0.0
[3.2.5]: https://github.com/elmasse/nextein/compare/v3.2.4...v3.2.5
[3.2.4]: https://github.com/elmasse/nextein/compare/v3.2.3...v3.2.4
[3.2.3]: https://github.com/elmasse/nextein/compare/v3.2.2...v3.2.3
[3.2.2]: https://github.com/elmasse/nextein/compare/v3.2.1...v3.2.2
[3.2.1]: https://github.com/elmasse/nextein/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/elmasse/nextein/compare/v3.1.3...v3.2.0
[3.1.3]: https://github.com/elmasse/nextein/compare/v3.1.2...v3.1.3
[3.1.2]: https://github.com/elmasse/nextein/compare/v3.1.1...v3.1.2
[3.1.1]: https://github.com/elmasse/nextein/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/elmasse/nextein/compare/v3.0.2...v3.1.0
[3.0.2]: https://github.com/elmasse/nextein/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/elmasse/nextein/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/elmasse/nextein/compare/v2.7.3...v3.0.0
[2.7.3]: https://github.com/elmasse/nextein/compare/v2.7.1...v2.7.3
[2.7.1]: https://github.com/elmasse/nextein/compare/v2.7.0...v2.7.1
[2.7.0]: https://github.com/elmasse/nextein/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/elmasse/nextein/compare/v2.5.1...v2.6.0
[2.5.1]: https://github.com/elmasse/nextein/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/elmasse/nextein/compare/v2.4.1...v2.5.0
[2.4.1]: https://github.com/elmasse/nextein/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/elmasse/nextein/compare/v2.3.4...v2.4.0
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
