const fill = require('lodash/fill')
const flattenDeep = require('lodash/flattenDeep')
const padStart = require('lodash/padStart')
const unzip = require('lodash/unzip')
const inv = require('mathjs').inv

function Matrix (x) {
  if (
    typeof x !== 'number' &&
    !(x instanceof Array) ||
    // maltyped array contents
    flattenDeep([].concat(x)).some((x) => typeof x !== 'number') ||
    (x[0] instanceof Array &&
      // extra nesting
      (x.length === 1 ||
      // uneven rows
      x.some((row) => row.length !== x[0].length)))
  ) throw new TypeError('Matrix must be a number or array of numbers')

  const matrix = Object.create(Matrix.prototype)
  matrix.__value = x
  return matrix
}

Matrix.addable = function (x, y) {
  return x instanceof Matrix &&
         y instanceof Matrix &&
         x.countRows() === y.countRows() &&
         x.countColumns() === y.countColumns()
}

Matrix.add = function (x, y) {
  if (!Matrix.addable(x, y)) throw new TypeError('Matrices are not addable')
  return x.map((row, i) =>
    row.map((column, j) =>
      column + y.__value[i][j]
    )
  )
}

Matrix.multipliable = function (x, y) {
  return x instanceof Matrix &&
         y instanceof Matrix &&
         x.countColumns() === y.countRows()
}

function innerproduct (x, y, i) {
  const _x = x.__value
  const _y = unzip(y.__value) === [] ? unzip([y.__value])[i] : unzip(y.__value)[i]
  return [].concat(_x).reduce((z, _z, j) => z + _z * _y[j], 0)
}

Matrix.multiply = function (x, y) {
  if (!Matrix.multipliable(x, y)) throw new TypeError('Matrices are not multipliable')
  if (x.countColumns() === 0 && y.countRows() === 0) return Matrix(x * y)
  const z = Matrix(fill(
    Array(x.countRows()),
    x.countRows() !== 1 ? fill(Array(y.countColumns()), 0) : 0
  ))
  return z.map((_z, i) => {
    if (typeof _z === 'number') return innerproduct(x, y, i)
    return _z.map((_, j) => innerproduct({ __value: x.__value[i] }, y, j))
  })
}

Matrix.invert = function (x) {
  return Matrix(inv(x instanceof Matrix ? x.__value : x))
}

Matrix.prototype.countRows = function () {
  if (typeof this.__value === 'number') return 0
  if (typeof this.__value[0] === 'number') return 1
  return this.__value.length
}

Matrix.prototype.countColumns = function () {
  if (typeof this.__value === 'number') return 0
  if (typeof this.__value[0] === 'number') return this.__value.length
  return this.__value[0].length
}

Matrix.prototype.addable = function (y) {
  return Matrix.addable(this, y)
}

Matrix.prototype.add = function (y) {
  return Matrix.add(this, y)
}

Matrix.prototype.multipliable = function (y) {
  return Matrix.multipliable(this, y)
}

Matrix.prototype.multiply = function (y) {
  return Matrix.multiply(this, y)
}

Matrix.prototype.transpose = function () {
  switch (this.countRows()) {
    case 0:
      return Matrix(this.__value)
    case 1:
      return Matrix(unzip([this.__value]))
    default:
      return Matrix(unzip(this.__value))
  }
}

Matrix.prototype.invert = function () {
  return Matrix.invert(this)
}

Matrix.prototype.map = function (x) {
  return Matrix(this.__value.map(x))
}

Matrix.prototype.valueOf = function () {
  return this.__value
}

Matrix.prototype.inspect = function () {
  switch (this.countRows()) {
    case 0:
      return `${this.__value}`
    case 1:
      return `[ ${this.__value.join(' ')} ]`
    default:
      const padding = unzip(this.__value).map((column) =>
        column.reduce((length, x) =>
          Math.max(`${x}`.length, length),
        0)
      )
      return this.__value
      .reduce((output, row) =>
        `${output}[ ${row.map((x, i) => padStart(x, padding[i])).join(' ')} ]`,
      '')
      .replace(/]\[/g, ']\n[')
  }
}

module.exports = Matrix
