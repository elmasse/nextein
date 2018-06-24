import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import raw from 'rehype-raw'

export default ({ remark, rehype }) => unified()
  .use(markdown)
  .use(...remark.map(p => require(p)))
  .use(remark2rehype, { allowDangerousHTML: true })
  .use(...rehype.map(p => require(p)))
  .use(raw)
