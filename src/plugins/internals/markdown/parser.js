import { unified } from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import raw from 'rehype-raw'

export default ({ remark = [], rehype = [] }) => unified()
  .use(markdown)
  .use(remark.map(mapPlugin))
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(rehype.map(mapPlugin))
  .use(raw)

const mapPlugin = p => {
  if (Array.isArray(p)) {
    const [name, options] = p
    return [require(name), options]
  }
  return require(p)
}
