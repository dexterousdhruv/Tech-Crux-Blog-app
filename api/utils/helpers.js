const checkIsEmpty = (obj) => {
  const values = Object.values(obj)
  let isEmpty = false
  for (const value of values) {
    if (!value) {
      isEmpty = true
      break
    }
  }

  return isEmpty
}



export { checkIsEmpty }

