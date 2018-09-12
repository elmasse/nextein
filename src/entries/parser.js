import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import raw from 'rehype-raw'
import math from 'remark-math'

export default unified()
  .use(markdown)
  .use(math)
  .use(remark2rehype, { allowDangerousHTML: true })
  .use(raw)
