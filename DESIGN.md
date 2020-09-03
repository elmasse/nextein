# Nextein v3

Major update goal is to improve plugins & life cycle.

## Plugins

The Plugin System will be revamped to split current `source` into 2 stages: *source* and *create*.

We should be able to create remark content based on md files or even plain txt or json files. We could also provide a creator-render perspective that might allow to process and render MDX files or any other formats that does not requires a HAST processing rendering.

### Stages

We will have these stages/plugin-types:

- source
- build
- transform
- filter
- sort

The stages or plugin-types will be executed in the order listed here.

- *source*: This stage compiles an entries list. It should call `action.build` on any entry to be processed. The `action.build` will execute *build* plugins. 
  - `source(options, action: { build, remove })`. 
      - options
      - action
        - build(buildOptions)
        - remove(removeOptions)
      - `buildOptions` {Object}
        - path: Relative to `options.path`. e.g.`'/blog/first-post.md'`
        - name: e.g.`'firts-post.md'`
        - mimeType: e.g.`'text/markdown'`
        - createdOn {Date}
        - removed {Boolean}
        - load() {Promise} return file content
      - `removeOptions` {Object}
        -  filePath
- *build*: Create an entry. It should call `action.create` to generate an `Entry` in the **_entries** array. 
  - `build(options, buildOptions, action: { create })`.
    - options
    - buildOptions
    - action
      - create(createOptions): {Entry}
    - `createOptions` {Object}
      - meta
        - filePath
        - path
        - name
        - mimeType
        - createdOn
        - raw
        - extra: (any user defined data e.g. in frontmatter)
      - content
    - `Entry` {Object}
      - data
        - __id: MD5(meta.filePath)
        - page: meta.extra.page || `'post'`
        - name: meta.name
        - category: meta.extra.category || meta.path
        - date: meta.extra.date || meta.created
        - month?
        - year?
        - url: formatted(meta.extra.url || `/:category?/:name`)
        - {...user defined data}
      - content
      - raw
- *transform*: This stage receive the **_entries** array as `posts`. Here we can modify one or many items.
  - `transform(options, posts)`
    - options
    - posts
- *filter*: Similar to *transform* stage but guaranteed to run after all transformations are made. Good for cleanups.
  - `filter(options, posts)`
- *sort*: Apply sorters after all transformations and filters are applied.
  - `sort(options, posts)`:
-*content-render*: This stage runs inside the `Content` component.
- `render`: TBD


## Plugin Configuration

The plugin configuration should allow to:

- Configure multiple instances of a plugin.
- Override a defined configuration.
- Resolve fullname plugin with configured name as:
  - simplified: `source-fs`. 
  - fullname: `nextein-plugin-source-fs`.

### Plugin Configuration Resolution

Configuration resolves to an Object with the form:
 
```
{ 
  name: {String},
  id?: {String},
  options: {Object}
}
```

Accepted forms:

- Object: `{ name, id?, options }`
- String: `name-of-plugin` -> { name: 'name-of-plugin' },
- Array: [name, options] -> { name, options }

A plugin configuration will be identified by an internal `id`. This *id* will be set by default to the plugin name if no `id` property is provided.
This allows to generate multiple instances of the same plugin if an`id` is provided or it can override a pre-configured plugin if not id provided.

```
{
  name: 'nextein-plugin-x',
  options: {
    position: true,
    raw: false    
  }
},

// override previous definition
['nextein-plugin-x', { position: true, raw: true }], 

// Multiple instances
{
  name: 'source-fs',
  id: 'posts',
  options: {
    path: 'posts',
    includes: '**/*.md'
  }
},
{
  name: 'source-fs',  // resolve to nextein-plugin-source-fs
  id: 'images',
  options: {
    path: 'images'
  }
}
```

#### NOTE
 
**Consider detecting 'nextein-plugin-markdown' and split into 2 configurations to preserve back compat.**


## Default Settings

- `source-fs`
  - source
- `build-remark`
  - build
  - filter?
- `filter-unpublished`
  - filter


## Watching Sources

For *source* plugins there is way to setup file watchers for dev mode. Once the watcher activates, it triggers the action of re-sourcing. This implies:

- *source* calls `action.build` with the file that changed.
- *source*'s `action.build` executes *build*'s `action.create` and might or might not return an entry. ??

//TBD

## Rendering `content`

// TBD

## Extra - Run Plugin Stack from `getStaticProps`?

// TBD
