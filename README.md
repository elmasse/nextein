# nextein

A static site generator based in Next.js

[![Financial Contributors on Open Collective](https://opencollective.com/nextein/all/badge.svg?label=financial+contributors)](https://opencollective.com/nextein)  
[![Build Status](https://travis-ci.org/elmasse/nextein.svg?branch=master)](https://travis-ci.org/elmasse/nextein) 
[![ProductHunt](https://img.shields.io/badge/producthunt-vote-orange.svg)](https://www.producthunt.com/posts/nextein) 
[![Gitter](https://badges.gitter.im/elmasse/nextein.svg)](https://gitter.im/nextein/Lobby)

## What is it?
`nextein` is  a wrapper around `next.js` that allows you to write static sites using `markdown` and `react`. 

### Requirements
*NodeJS* __v8.x__+ is required to run `nextein` commands.

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

    import withPosts from 'nextein/posts'
    import { Content } from 'nextein/post'

    export default withPosts( ({ posts }) => {
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
      "dev": "nextein"
    }
    ```
- Run the development server
    - `npm run dev`
    - open http://localhost:3000
- Add another npm script to your `package.json` to export the site

    ```json
    "scripts": {
      "dev": "nextein",
      "export": "nextein build && nextein export"
    }
    ```

### Example
See [nextein-example](https://github.com/elmasse/nextein-example) for a working example

## Documentation

### `withPosts`

HOC for `/pages` components that renders a list of posts. It makes the post list available thru the `posts` property.

```js
import withPosts from 'nextein/posts'

export default withPosts( ({ posts }) => { /* render your posts here */ } )

```

### `inCategory(category, options)`

Filter function to be applied to posts to retrieve posts in a given category.

- `category`: `{String}` The category to filter results.
- `options` : `{Object}` Optional
    - `includeSubCategories:` `Boolean` true to include posts in sub categories. Default: `false`

Categories are resolved by the folder structure by default. This means that a post located at `posts/categoryA/subOne` will have a category `categoryA/subOne` unless you specify the category name in frontmatter. 

```js
import withPosts, { inCategory } from 'nextein/posts'

export default withPosts( ({ posts }) => { 
  const homePosts = posts.filter(inCategory('home'))
  /* render your homePosts here */ 
} )

```

If you want to retrieve all posts under a certain category, let's say `categoryA` which will include all those under `subOne`, use the options `includeSubCategories: true`. 

```js
import withPosts, { inCategory } from 'nextein/posts'

export default withPosts( ({ posts }) => { 
  const categoryAPosts = posts
    .filter(inCategory('categoryA', { includeSubCategories: true }))
  /* render your categoryAPostsmePosts here */ 
} )

```

### `withPostsFilterBy(filter)`

Returns an HOC that gets all posts filtered out by the given filter function. This can be used in conjunction with `inCategory` to get only the desired posts in a certain category.

 ```js
import { withPostsFilterBy, inCategory } from 'nextein/posts'

const withCategoryAPosts = withPostsFilterBy(inCategory('categoryA'))

export default withCategoryAPosts(({ posts }) => { 
  /* render your posts here */ 
})

```

### `sortByDate`

Sort function to be applied to posts to sort by date (newest on top). This requires the post contains a `date` in `frontmatter` or in the file name (ala jekyll)

```js
import withPosts, { sortByDate } from 'nextein/posts'

export default withPosts( ({ posts }) => { 
  posts.sort(sortByDate)
  /* render your posts here */ 
} )

```

### `withPost`

HOC for `/pages` components that renders a single post. It makes the post available thru the `post` property.

```js
import withPost from 'nextein/post'

export default withPost( ({ post }) => { /* render your post here */ } )

```

### `Content`

Component to render a `post` object. This component receives the `content` from the post as a property.
Use the `excerpt` property to only render the first paragraph (this is useful when rendering a list of posts).

- `content`: `{Object}` Markdown content in HAST format to be render. This is provided by `post.content`
- `excerpt`: `{Boolean}` true to only render the first paragraph. Optional. Default: `false`
- `renderers`: `{Object}` A set of custom renderers for Markdown elements with the form of `[tagName]: renderer`.
- `prefix`: `{String}` Prefix to use for the generated React elements. Optional. Default: `'entry-'`
- `component`: `{String|React.Component}`	The component used for the root node. Either a string to use or a React Component.


```js
import withPost, { Content } from 'nextein/post'

export default withPost( ({ post }) => { return (<Content {...post} />) } )

```

Using the `excerpt` property

```js
import withPosts, {inCategory} from 'nextein/posts'

export default withPosts( ({ posts }) => { 
  const homePosts = posts.filter(inCategory('home'))
  return (
    <section>
    {
      homePosts.map( (post, idx) => <Content key={idx} {...post} excerpt/> )
    }
    </section>
  )
} )

```

Using `renderers` to change/style the `<p>` tag

```js
export default withPost( ({ post }) => { 
  return (
    <Content {...post} 
      renderers={{
        p: Paragraph 
      }}
    />
  ) 
} )

const Paragraph = ({ children }) => (<p style={{padding:10, background: 'silver'}}> { children } </p> )

```


### `Link`

You can use `nextein/link` instead with the exact same parameters as `next/link`. This component wraps the `next/link` one to simplify creating a _Link_ for a given post object. `next/link` will work out of the box.
 When passing a `post.data.url` to `href` it will generate the underlying `next/link` with the `post` information.


- `data`: `{Object}` Post frontmatter object. This is provided by `post.data`


```js
import withPosts from 'nextein/posts'
import Link from 'nextein/link'

export default withPosts( ({ posts }) => (
  <section>
  {
    posts.map( (post, idx) => {
      return (
        <div>
          <h1>{post.data.title}</h1>
          <Content key={idx} {...post} excerpt/>
          <Link {...post}><a>Read More...</a></Link>
      </div>
      )
    })    
  }
  </section>
))


```

### `post`

- `data` is the frontmatter object containig the post meta information (title, page, category, etc)
    - `data.url` is the generated url for the post
    - `data.category` is the post's category. When not specified, if the post is inside a folder, the directory structure under `posts` will be used. 
    - `data.date`: JSON date from frontmatter's date or date in file name or file creation date
- `raw` is markdown content of the post
- `content` is a HAST representation of post content 

```js

{ data, raw } = post

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

You can also define nextein plugins using the `withNextein` configuration:

```js

const { withNextein } = require('nextein/config')

module.exports = withNextein({
  nextein: {
    plugins: [
      ['nextein-plugin-markdown', { entriesDir: ['_posts'] }]
      //your nextein plugins here
    ]
  }
  // Your own next.js config here
})

```

The `nextein.plugins` configuration accepts an array of plugins with the following formats:

- ` ['plugin-name'] `: Just a string to define the plugin.
- ` ['plugin-name', {  }] `: A string to define the plugin and a plugins options object.

The plugin name should be a pre-installed plugin (`nextein-plugin-markdown`) , or a local file (`./myplugins/my-awesome-plugin`)

### Default Plugin (nextein-plugin-markdown)

The default plugin will source the posts using a configurable set of options:

- `extension`: Default to `md`
- `entriesDir`: Default to `['posts']`
- `raw`: Default to `true`. Make this `false` to not add the `raw` content in the post object.
- `position`: Default to `false`. Make this `true` to add the position info to post content HAST.
- `rehype`: Default to `[]`. Add a set of plugins for `rehype`
- `remark`: Default to `[]`. Add a set of plugins for `remark`

## Plugins

You can write your own plugins. There are basically 2 different types (source and transforms). Source plugins will be called to generate the posts entries and then the transform plugins will receive those entries and can modify, filter, append, or transform in anyway the posts list.

Both types are just async functions. You have to export a `source` and/or `transform` method from you plugin main module:

```js
// file: ./plugins/my-plugin

/* source plugin  (options) => post[]  */
module.exports.source = async (options) => { /* return your posts */ }

/* transform plugin (options, post[]) =>  post[] */
module.export.transform = async (options, posts) => { /* return your posts */ }

```

Then in the `next.config.js` file you can define your plugin with options as follows. The same `options` object will be passed to both `source` and `transform` methods.

```js

const { withNextein } = require('nextein/config')

module.exports = withNextein({
  nextein: {
    plugins: [
      ['./plugins/my-plugin', { awesome: true }]
    ]
  }
  // Your own next.js config here
})

```

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/elmasse/nextein/graphs/contributors"><img src="https://opencollective.com/nextein/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/nextein/contribute)]

#### Individuals

<a href="https://opencollective.com/nextein"><img src="https://opencollective.com/nextein/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/nextein/contribute)]

<a href="https://opencollective.com/nextein/organization/0/website"><img src="https://opencollective.com/nextein/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/1/website"><img src="https://opencollective.com/nextein/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/2/website"><img src="https://opencollective.com/nextein/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/3/website"><img src="https://opencollective.com/nextein/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/4/website"><img src="https://opencollective.com/nextein/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/5/website"><img src="https://opencollective.com/nextein/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/6/website"><img src="https://opencollective.com/nextein/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/7/website"><img src="https://opencollective.com/nextein/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/8/website"><img src="https://opencollective.com/nextein/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/nextein/organization/9/website"><img src="https://opencollective.com/nextein/organization/9/avatar.svg"></a>
