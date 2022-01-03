# nextein

A static site generator based in Next.js

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/elmasse/nextein/node-ci)
[![npm](https://img.shields.io/npm/v/nextein)](https://www.npmjs.com/package/nextein)

#### [Site](https://nextein.elmasse.io/) | [Documentation](https://nextein.elmasse.io/docs) | [Guides](https://nextein.elmasse.io/guides)

## What is it?
`nextein` is  a wrapper around `next.js` that allows you to write static sites using `markdown` and `react`. 

### Requirements
*NodeJS* __v10.x__+ is required to run `nextein` commands.

## Starter Kit
If you want to jump into a starter project check [nextein-starter](https://github.com/elmasse/nextein-starter)

## Getting Started
There are a few steps you have to follow to get your site up and running with `nextein`

- Create a project:
    -  `mkdir my-site`
    -  `cd my-site`
    -  `npm init -y` 
- Install Dependencies
    -  `npm i nextein next react react-dom`
- Add a `next.config.js` config file 

    ```js
    const { withNextein } = require('nextein/config')

    module.exports = withNextein({

    })

    ```
- Create `pages/index.js`

    ```js
    import React from 'react'

    import { getPosts } from 'nextein/fetcher'
    import Content from 'nextein/content'

    export async function getStaticProps () {
      return {
        props: {
          posts: await getPosts()
        }
      }
    }

    export default function Index ({ posts }) {
      return (
        <section>
        {
          posts.map(post => <Content {...post} />)
        }
        </section>
      )
    })

    ```
- Create a `markdown` post entry under `posts` folder (`posts/my-first-post.md`)

    ```md
    ---
    title: First Post
    category: post
    ---

    This is the first paragraph and it will be used as an excerpt when loaded in a `<Content excerpt />` tag.

    This paragraph should *not* appear in that list.

    ```
- Add npm scripts to run dev mode to your `package.json`

    ```json
    "scripts": {
      "dev": "next"
    }
    ```
- Run the development server
    - `npm run dev`
    - open http://localhost:3000

- Add another npm script to your `package.json` to export the site

    ```json
    "scripts": {
      "dev": "next",
      "export": "next build && next export"
    }
    ```

## Documentation

### `fetcher` 

Dynamic Routes and *static generator functions* (getStaticProps and getStaticPaths).

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

### `inCategory(category, options)`

Filter function to be applied to posts to retrieve posts in a given category.

- `category`: `{String}` The category to filter results.
- `options` : `{Object}` Optional
    - `includeSubCategories:` `Boolean` true to include posts in sub categories. Default: `false`

Categories are resolved by the folder structure by default. This means that a post located at `posts/categoryA/subOne` will have a category `categoryA/subOne` unless you specify the category name in frontmatter. 

```js
import withPosts from 'nextein/posts'
import { inCategory } from 'nextein/filters'

export default withPosts( ({ posts }) => { 
  const homePosts = posts.filter(inCategory('home'))
  /* render your homePosts here */ 
} )

```

If you want to retrieve all posts under a certain category, let's say `categoryA` which will include all those under `subOne`, use the options `includeSubCategories: true`. 

```js
import withPosts from 'nextein/posts'
import { inCategory } from 'nextein/filters'

export default withPosts( ({ posts }) => { 
  const categoryAPosts = posts
    .filter(inCategory('categoryA', { includeSubCategories: true }))
  /* render your categoryAPostsmePosts here */ 
} )

```

### `sortByDate`

Sort function to be applied to posts to sort by date (newest on top). This requires that the post contains a `date` in `frontmatter` or in the file name (ala jekyll)

```js
import withPosts, { sortByDate } from 'nextein/posts'

export default withPosts( ({ posts }) => { 
  posts.sort(sortByDate)
  /* render your posts here */ 
} )

```

### `Content`

Component to render a `post` object. This component receives the `content` from the post as a property.
Use the `excerpt` property to only render the first paragraph (this is useful when rendering a list of posts).

- `content`: `{Object}` Markdown content in HAST format to be render. This is provided by `post.content`
- `excerpt`: `{Boolean}` true to only render the first paragraph. Optional. Default: `false`
- `renderers`: `{Object}` A set of custom renderers for Markdown elements with the form of `[tagName]: renderer`.
- `component`: `{String|React.Component}`	The component used for the root node.


```js
import withPost from 'nextein/post'
import Content from 'nextein/content'

export default withPost( ({ post }) => { return (<Content {...post} />) } )

```

Using the `excerpt` property

```js
import withPosts, { inCategory } from 'nextein/posts'
import Content from 'nextein/content'

export default withPosts(({ posts }) => { 
  const homePosts = posts.filter(inCategory('home'))
  return (
    <section>
    {
      homePosts.map( (post, idx) => <Content key={idx} {...post} excerpt/> )
    }
    </section>
  )
})

```

Using `renderers` to change/style the `<p>` tag

```js
import withPost from 'nextein/post'
import Content from 'nextein/content'

const Paragraph = ({ children }) => (<p style={{padding:10, background: 'silver'}}> { children } </p> )

export default withPost(({ post }) => { 
  return (
    <Content {...post} 
      renderers={{
        p: Paragraph 
      }}
    />
  ) 
})

```


### `post`

- `data` is the frontmatter object containig the post meta information (title, page, category, etc)
    - `data.url` is the generated url for the post
    - `data.category` is the post's category. When not specified, if the post is inside a folder, the directory structure under `posts` will be used. 
    - `data.date`: JSON date from frontmatter's date or date in file name or file creation date
- `content` is representation of post content (generally in HAST format) created by the build plugin for a given mimeType.

```js

{ data, content } = post

```

### frontmatter

There are only a few defined properties in the frontmatter metadata that is used by `nextein`

```md
---
page: my-awesome-post
category: categoryOne
date: 2017-06-23

---

Post Content...

```

- `page`: the component under `/pages` that will be used to render the post (default to `post` which reads `/pages/post` component) **Note:** If you have an entry that should not be rendered by its own page (such as a part of an index file only) use `page: false` to avoid generating the url and exporting entry.
- `category`: the category name (optional)
- `date`: date string in YYYY-MM-DD format. Used to sort posts list. (optional)
- `published`: Set to `false` to remove this post from entries.
- `permalink`: Set the url using any parameter in the frontmatter object. Default value `/:category?/:name`. The `?` means the parameter will be optional.
- `name`: **Read Only** The post file name. Date is removed from name if present.
- `url`: **Read Only** The post url.

### `withNextein`

A wrapper configuration function to be applied into the `next.config.js`. It provides a way to add your own `next.js` config along with `nextein` internal next.js config.

> next.config.js

```js
const { withNextein } = require('nextein/config')

module.exports = withNextein({
  // Your own next.js config here
})

```

## Plugins

You can also define nextein plugins using the `withNextein` configuration:

```js
const { withNextein } = require('nextein/config')

module.exports = withNextein({
  nextein: {
    plugins: [
      //your nextein plugins here
    ]
  }
  // Your own next.js config here
})

```

The `nextein.plugins` configuration accepts an array of plugins with the following formats:

- ` [name] `: Just a string to define the plugin.
- ` [name, options] `: A string to define the plugin and a plugins options object.
- ` { name, id, options } `: A plugin object. The `name` field is required. All previous definitoins are transformed into this format. The `id` is optional, when provided allows multiple instances of the same plugin.

The plugin `name` should be a pre-installed plugin (`nextein-plugin-markdown`) , or a local file (`./myplugins/my-awesome-plugin`)

### Default Plugins

The default configuration includes:

```js
plugins: [
  ['nextein-plugin-source-fs', { path: 'posts', data: { page: 'post' } }],
  'nextein-plugin-markdown',
  'nextein-plugin-filter-unpublished'
]

```

#### nextein-plugin-source-fs

Read files from file system.

Options:

- `path`: Path to read files from.
- `data`: Default data to be passed as extra for each entry. Default to `{}`
- `includes`: Default to `**/*.*`. 
- `ignore`: A set of ignored files. The default list includes:
  ```js
  '**/.DS_Store',
  '**/.gitignore',
  '**/.npmignore',
  '**/.babelrc',
  '**/node_modules',
  '**/yarn.lock',
  '**/package-lock.json'
  ```

#### nextein-plugin-markdown

Render markdown files.

Options:

- `raw`: Default to `true`. Make this `false` to not add the `raw` content in the post object.
- `position`: Default to `false`. Make this `true` to add the position info to post content HAST.
- `rehype`: Default to `[]`. Add a set of plugins for `rehype`
- `remark`: Default to `[]`. Add a set of plugins for `remark`

#### nextein-plugin-filter-unpublished

Filter posts by using a property to prevent draft / unpublished entries to be displayed.

Options:

- `field`: Default to`'published'`. Will check if a `field` is present in post `data` and filter if set to `false`.

### Writing Plugins

You can write your own plugins. There are basically 2 different types (source and transforms). Source plugins will be called to generate the posts entries and then the transform plugins will receive those entries and can modify, filter, append, or transform in anyway the posts list.

See [plugins & lifecyle design document](./DESIGN.md).
