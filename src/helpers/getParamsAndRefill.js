export const getParamsAndRefill = (query, data) => {
  const regExp = /@(\w+)/g
  const matches = query.match(regExp)
  
  if (matches) {
    matches.forEach((match, index) => {
      query = query.replace(match, data[index])
    })
  }

  return query
}