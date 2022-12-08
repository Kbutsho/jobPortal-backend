const errorFormatter = eb =>{
  let errors = {}
  let allErrors = eb.substring(eb.indexOf(':') + 1).trim()
  // for imageURLs.0 remove
  allErrors = allErrors.split(".0").join('')
  const allErrorsArrayFormate = allErrors.split(',').map(err=>err.trim())
  allErrorsArrayFormate.forEach(error =>{
      const [key, value] = error.split(':').map(err=> err.trim())
      errors[key] = value
  })
  return errors
}
module.exports = errorFormatter