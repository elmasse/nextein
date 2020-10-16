# Nextein v3

Major update goal is to improve plugins & life cycle.

## Plugins

The Plugin System will be revamped to split current `source` into 2 stages: *source* and *create*.

We should be able to create remark content based on md files or even plain txt or json files. We could also provide a creator-render perspective that might allow to process and render MDX files or any other formats that does not requires a HAST processing rendering.

### Stages

We will have these stages/plugin-types:

- config
- source
- build
- transform
- cleanup
- filter
- sort
- render

The stages or plugin-types will be executed in the order listed here.

- *config*: This stage allows plugin developers to inject configuration into the `next.config.js` module. It *MUST* return the `nextConfig` or the modified version of it.
  - `config(options, nextConfig): {Object}`
    - options
    - nextConfig
- *source*: This stage compiles an entries list. It should call `action.build` on any entry to be processed. The `action.build` will execute *build* plugins. 
  - `source(options, action: { build, remove })`. 
      - options
      - action
        - build(buildOptions)
        - remove(removeOptions)
      - `buildOptions` {Object}
        - filePath: Absolute path
        - path: Relative to `options.path`. e.g.`'/blog/first-post.md'`
        - name: e.g.`'firts-post.md'`
        - mimeType: e.g.`'text/markdown'`
        - createdOn {Date}
        - load() {Promise} return file content
      - `removeOptions` {Object}
        -  filePath: Absolute path
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
        - mimeType: meta.mimeType,
        - page: meta.extra.page || `'post'`
        - name: meta.name
        - category: meta.extra.category || meta.path
        - date: meta.extra.date || meta.created
        - day: {String} 2 digit padded day from date
        - month: {String} 2 digit padded month from date
        - year: {String} 4 digit year from date
        - url: formatted(meta.extra.url || `/:category?/:name`)
        - {...user defined data}
      - content
      - raw
- *transform*: This stage receive the **_entries** array as `posts`. Here we can modify one or many items.
  - `transform(options, posts): {Array<Entry>}`
    - options
    - posts
- *cleanup*: Same as *transform* stage but useful to remove / clean up data.
  - `cleanup(options, posts): {Array<Entry>}`
    - options
    - posts
- *filter*: Filter posts. Same as *transform* stage plugins but guaranteed to run after *cleanup*.
  - `filter(options, posts): {Array<Entry>}`
    - options
    - posts
- *sort*: Sort posts. Same as *transform* stage plugins but guaranteed to run after *filter*.
  - `sort(options, posts): {Array<Entry>}`
    - options
    - posts
- *render*: This stage runs inside the `Content` component.
  - `render(options, post): {Component}`: **It MUST be defined as a named export in a `render.js` file on the plugin root folder.** This method should return a React Component. 

## Plugin Configuration

The plugin configuration should allow to:

- Configure multiple instances of a plugin.
- Override a defined configuration.
- Resolve fullname plugin with configured name as:
  - simplified: `source-fs`. 
  - fullname: `nextein-plugin-source-fs`.

### Plugin Configuration Resolution

Configuration resolves to an Object with the form:
 
```js
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

```js
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

## Default Settings

- `source-fs`
  - source
- `markdown`
  - build
  - cleanup (remove position, raw, etc.)
- `filter-unpublished`
  - filter


## Watching Sources

For *source* plugins there is way to setup file watchers for dev mode. Once the watcher activates, it triggers the action of re-sourcing. This implies:

- *source* calls `action.build` with the file that changed or `action.remove` if file is removed.
- *source*'s `action.build` executes *build*'s `action.create`.
- *source*'s `action.remove` executes a remove of entry from current entry set.

Once this stage is completed, the entry set is cloned and all plugins from `transform` stage are run against the new set.

## Rendering with `Content`

The `Content` component will run the appropriate render based on the `post` data.

## New `fetcher` for Dynamic Routes

> Status: **Experimental**

Dynamic Routes and *static generator functions* (getStaticProps and getStaticPaths) can be used with this new experimental feature.

> **NOTE**: For now, all posts rendered in a dynamic route require to have `page: false`. 

Example for a `[name].js` dynamic route

```js
import fetcher from 'nextein/fetcher'

const { getData, getPost } = fetcher(/* filter */)

export async function getStaticPaths () {
  const data = await getData()
  return {
    paths: data.map(({ name }) => ({ params: { name } })),
    fallback: false
  }
}

export async function getStaticProps ({ params }) {
  const post = await getPost(params)
  return { props: { post } }
}

export default function Post ({ post }) {
  //...
}

```

Example for a `[[...name]].js` dynamic route:

```js
import fetcher from 'nextein/fetcher'
import { inCategory } from 'nextein/filters'

const { getData, getPosts, getPost } = fetcher(inCategory('guides'))

export async function getStaticPaths () {
  const data = await getData()
  return {
    paths: [{ params: { name: [] } },
      ...data.map(({ name }) => ({ params: { name: [name] } }))
    ],
    fallback: false
  }
}

export async function getStaticProps ({ params }) {
  const posts = await getPosts()
  const post = await getPost(params) // This can be null if not matching `...name`
  return { props: { posts, post } }
}

export default function Guides ({ posts, post }) {
  //...
}

```

### Caveats

- Post are required to be marked with `page: false`.
- No fast refresh for post changes.
- The `nextein` Link won't work since page is set to false.
