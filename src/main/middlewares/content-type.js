module.exports = async (req, res, next) => {
  res.type('json')
  next()
}
