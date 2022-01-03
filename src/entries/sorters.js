
export const byDate = (postA, postB) => {
  const { data: { date: aDate } = postA } = postA // If no data assume we are working with metadata
  const { data: { date: bDate } = postB } = postB

  const aTime = new Date(aDate).getTime()
  const bTime = new Date(bDate).getTime()

  return bTime - aTime
}
