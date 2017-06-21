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
    -  `npm i nextein@beta next@eta react react-dom`
- Add a `next.config.js` config file 

    ```js
        const nexteinConfig = require('nextein/config').default

        module.exports = nexteinConfig({

        })

    ```
- Create an `pages/index.js`

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

    This is the first paragraph and it will be used as an excerpt when loaded in an `<Content excerpt />` tag.

    This paragraph should *not* appear in that list.

    ```
- Add npm scripts to run dev mode to your `package.json`

    ```json
    {
        "scripts: {
            "dev": "nextein"
        }
    }
    ```
- Finally run the development server
    - `npm run dev`
    - open http://localhost:3000


WIP - see [nextein-example](https://github.com/elmasse/nextein-example) for a working example

## Documentation

// TODO