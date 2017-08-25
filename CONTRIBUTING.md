# Contributing to Nextein

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

## Getting Started

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Install the dependencies: `npm install`
3. Run `npm link` to link the local repo to NPM
4. Run `npm run build` to build and watch for code changes
5. Then npm link this repo inside any example app with `npm link nextein`


## Using a lerna repo locally

Since version `beta19` the inclusion of `nextein/link` requires to use a monorepo to test or develop `nextein` locally given the `next.js` router singleton instance.

Lerna has to be configured with hoisting enabled. The following snippet shows a `lerna.json` example to run `nextein` locally:

```json
{
  "lerna": "2.0.0-rc.5",
  "packages": [
    "packages/*"
  ],
  "version": "independent",
  "commands": {
    "bootstrap": {
      "hoist": true,
      "nohoist": "taskr**"
    }
  }
}

```

This configuration implies you copy / clone `nextein` under the `packages/nextein` folder.