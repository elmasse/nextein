import { runIndexer } from '../plugins'

/**
 *
 */
export async function metadata () {
  const entries = await runIndexer()

  return entries.map(({ data }) => data)
}
