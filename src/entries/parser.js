import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import raw from 'rehype-raw'

export default unified()
  .use(markdown)
  .use(remark2rehype, { allowDangerousHTML: true })
  .use(raw)
