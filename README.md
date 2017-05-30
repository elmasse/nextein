# nextein
A Static Blog generator based in Next.js

## Waaaat?

- create a new project `mkdir blog && cd blog`
- init npm `npm init -y`
- install `react`, `react-dom`, `next@beta` and `nextein`
    - `npm i react react-dom next@beta`
    - `npm link nextein` (npm comming soon)

- create a pages folder. Add a index.js

> pages/index.js

```
import Entries from 'nextein/entries'

export default () => (
  <section>
    <h1>Hello</h1>
    <Entries category="post" />
  </section>

)
```

- create a posts folder. Add a post entry

> posts/first.md

```
---
title: First Post
category: post
---

This is the first paragraph and it will be used as a excerpt when loaded in an `<Entries />`.

This paragraph should *not* appear in that list.

```

- create a `next.config.js` file and wrap the next configuration with `nexteinConfig()`

> next.config.js

```
const nexteinConfig = require('nextein/config')

module.exports = nexteinConfig({
  // your customized next config here
})
```

- Add next to your build scripts in `package.json`

```
{
    "scripts": {
        "dev": "next"
    }
}
```

- Run your blog

`npm run dev`

