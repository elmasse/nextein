# nextein
A static site generator based in Next.js

## What is it?
`nextein` is  a wrapper around `next.js` that allows you to write static sites using `markdown` and `react`. 

## Getting Started
There are a few steps you have to follow to get your site up and running with `nextein`

- Create a project:
    -  `mkdir my-site`
    -  `cd my-site`
    -  `npm init -y` 
- Install Dependencies
    -  `npm i nextein@beta next@beta react react-dom`
- Add a `next.config.js` config file 

    ```js
        const nexteinConfig = require('nextein/config').default

        module.exports = nexteinConfig({

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
    {
        "scripts": {
            "dev": "nextein"
        }
    }
    ```
- Run the development server
    - `npm run dev`
    - open http://localhost:3000
- Add another npm script to your `package.json` to export the site

    ```json
    {
        "scripts": {
            "dev": "nextein",
            "export": "nextein build && nextein export"
        }
    }
    ```

### Example
see [nextein-example](https://github.com/elmasse/nextein-example) for a working example

## Documentation

### `withPosts`

HOC for `/pages` components that renders a list of posts. It makes the post list available thru the `posts` property.

```js
import withPosts from 'nextein/posts'

export default withPosts( ({ posts }) => { /* render your posts here */ } )

```

### `inCategory(category)`

Filter function to be applied to posts to retrieve posts in given category

```js
import withPosts, { inCategory } from 'nextein/posts'

export default withPosts( ({ posts }) => { 
    const homePosts = posts.filter(inCategory('home'))
    /* render your homePosts here */ 
} )

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

Component to render a `post` object. This component receive the `content` from the post as a property.
Use the `excerpt` property to only render the first paragraph (this is useful when rendering a list of posts).

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

### `post`

- `data` is the frontmatter object containig the post meta information (title, page, category, etc)
    - `data.url` is the generated url for the post
    - `data.category` is the post's category
- `content` is markdown content of the post

```js

{ data, content } = post

```

### frontmatter

There are only a few defined properties in the frontmatter metadata that is used by `nextein`

```md
---
page: my-awesome-post
category: categoryOne
slug: /posts/my-first-post
date: 2017-06-23

---

Post Content...

```

- `page`: the component under `/pages` that will be used to render the post (default to `post` which reads `/pages/post` component)
- `category`: the category name (optional)
- `slug`: the post url (optional)
- `date`: date string in YYYY-MM-DD format. Used to sort posts list. (optional)


### `nexteinConfig`

A wrapper configuration function to be applied into the `next.config.js`. It provides a way to add your own `next.js` config along with `nextein` internal next.js config.

> next.config.js

```js

const nexteinConfig = require('nextein/config').default

module.exports = nexteinConfig({
    // Your own next.js config here
})

```