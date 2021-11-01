
export const byDate = ({ data: { date: aDate } }, { data: { date: bDate } }) => {
  const aTime = new Date(aDate).getTime()
  const bTime = new Date(bDate).getTime()
  return bTime - aTime
}
