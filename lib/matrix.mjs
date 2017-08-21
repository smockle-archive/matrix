// @flow

/** @module matrix */

import fill from 'lodash/fill'
import flattenDeep from 'lodash/flattenDeep'
import padStart from 'lodash/padStart'
import unzip from 'lodash/unzip'
import mathjs from 'mathjs'
const { inv } = mathjs

/**
 * Creates a Matrix
 * @constructor
 * @alias module:matrix
 * @param {number|Array<number>} x - Values to store in matrix
 * @throws {TypeError} Argument x must be a number or number array
 * @return {Matrix} Single or multi dimensional matrix
 */
function Matrix (x /* : number | Array<number> */) /* : Matrix */ {
  if (
    (typeof x !== 'number' && !(x instanceof Array)) ||
    // maltyped array contents
    flattenDeep([].concat(x)).some(
      (x /* : number */) => typeof x !== 'number'
    ) ||
    // $flow_disable_line
    (x[0] instanceof Array &&
      // extra nesting
      // $flow_disable_line
      (x.length === 1 ||
        // uneven rows
        // $flow_disable_line
        x.some(row => row.length !== x[0].length)))
  ) {
    throw new TypeError('Matrix must be a number or array of numbers')
  }

  /**
   * Single or multi dimensional matrix
   * @constant {Matrix}
   */
  const matrix = Object.create(Matrix.prototype)
  matrix.__value = x
  return matrix
}

/**
 * Determines whether two matrices can be summed
 * @alias module:matrix.addable
 * @param  {Matrix} x - Matrix to check
 * @param  {Matrix} y - Matrix to check
 * @return {boolean} Whether two matrices can be summed (using matrix addition)
 */
Matrix.addable = function (x /* : Matrix */, y /* : Matrix */) /* : boolean */ {
  return (
    x instanceof Matrix &&
    y instanceof Matrix &&
    x.countRows() === y.countRows() &&
    x.countColumns() === y.countColumns()
  )
}

/**
 * Adds two matrices using matrix addition
 * @alias module:matrix.add
 * @param {Matrix} x - Matrix to add
 * @param {Matrix} y - Matrix to add
 * @throws {TypeError} Matrices are not addable
 * @return {Matrix} New matrix with the summation
 */
Matrix.add = function (x /* : Matrix */, y /* : Matrix */) /* : Matrix */ {
  if (!Matrix.addable(x, y)) throw new TypeError('Matrices are not addable')
  return x.map(
    (row /* : Array<number> */, i /* : number */ /* : Array<number> */) =>
      row.map(
        (column /* : number */, j /* : number */ /* : number */) =>
          column + y.__value[i][j]
      )
  )
}

/**
 * Determines whether two matrices can be multiplied
 * @alias module:matrix.multipliable
 * @param  {Matrix} x - Matrix to check
 * @param  {Matrix} y - Matrix to check
 * @return {boolean} Whether two matrices can be summed (using matrix multiplication)
 */
Matrix.multipliable = function (
  x /* : Matrix */,
  y /* : Matrix */
) /* : boolean */ {
  return (
    x instanceof Matrix &&
    y instanceof Matrix &&
    x.countColumns() === y.countRows()
  )
}

/**
 * Calculates the inner product of two matrices
 * @param  {Matrix} x - Matrix to multiply
 * @param  {Matrix} y - Matrix to multiply
 * @param  {number} i - Column in matrix y to multiply
 * @return {number} Inner product of matrices
 */
function innerproduct (
  x /* : Matrix */,
  y /* : Matrix */,
  i /* : number */
) /* : number */ {
  const _x /* : Array<number> */ = x.__value
  const _y /* : Array<number> */ = unzip(y.__value) === []
    ? unzip([y.__value])[i]
    : unzip(y.__value)[i]
  return []
    .concat(_x)
    .reduce(
      (z /* : number */, _z /* : number */, j /* : number */ /* : number */) =>
        z + _z * _y[j],
      0
    )
}

/**
 * Calculates the dot product of two matrices
 * @alias module:matrix.multiply
 * @param  {Matrix} x - Matrix to multiply
 * @param  {Matrix} y - Matrix to multiply
 * @return {Matrix} New matrix with the dot product
 */
Matrix.multiply = function (x /* : Matrix */, y /* : Matrix */) /* : Matrix */ {
  if (!Matrix.multipliable(x, y)) {
    throw new TypeError('Matrices are not multipliable')
  }
  /* $flow_disable_line */
  if (x.countColumns() === 0 && y.countRows() === 0) return Matrix(x * y)
  /**
   * New matrix with the dot product
   * @const {Matrix}
   */
  const z /* : Matrix */ = Matrix(
    fill(
      Array(x.countRows()),
      x.countRows() !== 1 ? fill(Array(y.countColumns()), 0) : 0
    )
  )
  return z.map(
    (
      _z /* : number | Array<number> */,
      i /* : number */ /* : number | Array<number> */
    ) => {
      if (typeof _z === 'number') return innerproduct(x, y, i)
      return _z.map((_, j) => innerproduct({ __value: x.__value[i] }, y, j))
    }
  )
}

/**
 * Inverts a matrix
 * @alias module:matrix.invert
 * @param  {x} Matrix to invert
 * @return {Matrix} Matrix inverse
 */
Matrix.invert = function (x /* : Matrix */) /* : Matrix */ {
  return Matrix(inv(x instanceof Matrix ? x.__value : x))
}

/**
 * Counts rows in this matrix
 * @alias module:matrix#countRows
 * @return {number} Number of rows
 */
Matrix.prototype.countRows = function () /* : number */ {
  if (typeof this.__value === 'number') return 0
  if (typeof this.__value[0] === 'number') return 1
  return this.__value.length
}

/**
 * Counts columns in this matrix
 * @alias module:matrix#countColumns
 * @return {number} Number of columns
 */
Matrix.prototype.countColumns = function () /* : number */ {
  if (typeof this.__value === 'number') return 0
  if (typeof this.__value[0] === 'number') return this.__value.length
  return this.__value[0].length
}

/**
 * Determines whether this matrix can be summed
 * @alias module:matrix#addable
 * @param  {Matrix} y - Matrix to check
 * @return {boolean} Whether this matrix can be summed (using matrix addition)
 */
Matrix.prototype.addable = function (y /* : Matrix */) /* : boolean */ {
  return Matrix.addable(this, y)
}

/**
 * Adds this matrix using matrix addition
 * @alias module:matrix#add
 * @param {Matrix} y - Matrix to add
 * @return {Matrix} New matrix with the summation
 */
Matrix.prototype.add = function (y /* : Matrix */) /* : Matrix */ {
  return Matrix.add(this, y)
}

/**
 * Determines whether this matrix can be multiplied
 * @alias module:matrix#multipliable
 * @param  {Matrix} y - Matrix to check
 * @return {boolean} Whether two matrices can be summed (using matrix multiplication)
 */
Matrix.prototype.multipliable = function (y /* : Matrix */) /* : boolean */ {
  return Matrix.multipliable(this, y)
}

/**
 * Calculates the dot product of this matrix
 * @alias module:matrix#multiply
 * @param  {Matrix} y - Matrix to multiply
 * @return {Matrix} New matrix with the dot product
 */
Matrix.prototype.multiply = function (y /* : Matrix */) /* : Matrix */ {
  return Matrix.multiply(this, y)
}

/**
 * Calculates the transpose of this matrix
 * @alias module:matrix#transpose
 * @return {Matrix} New matrix with the transpose
 */
Matrix.prototype.transpose = function () /* : Matrix */ {
  switch (this.countRows()) {
    case 0:
      return Matrix(this.__value)
    case 1:
      return Matrix(unzip([this.__value]))
    default:
      return Matrix(unzip(this.__value))
  }
}

/**
 * Inverts this matrix
 * @alias module:matrix#invert
 * @return {Matrix} Matrix inverse
 */
Matrix.prototype.invert = function () /* : Matrix */ {
  return Matrix.invert(this)
}

/**
 * Maps over this matrix
 * @alias module:matrix#map
 * @return {Matrix} Matrix inverse
 */
Matrix.prototype.map = function (x /* : Function */) /* : Matrix */ {
  return Matrix(this.__value.map(x))
}

/**
 * Returns the number or number array value
 * @alias module:matrix#valueOf
 * @return {number|Array<number>} Number of number array value
 */
Matrix.prototype.valueOf = function () /* : number | Array<number> */ {
  return this.__value
}

/**
 * Formats and prints the matrix value
 * @alias module:matrix#inspect
 * @return {string} Formatted matrix value
 */
Matrix.prototype.inspect = function () /* : string */ {
  switch (this.countRows()) {
    case 0:
      return `${this.__value}`
    case 1:
      return `[ ${this.__value.join(' ')} ]`
    default:
      /**
       * Output array filled with zeroes
       * @constant {string}
       */
      const padding /* : Array<number> */ = unzip(
        this.__value
      ).map((column /* : Array<number> */) =>
        column.reduce((length, x) => Math.max(`${x}`.length, length), 0)
      )
      return this.__value
        .reduce(
          (output, row) =>
            `${output}[ ${row
              .map((x, i) => padStart(x, padding[i]))
              .join(' ')} ]`,
          ''
        )
        .replace(/]\[/g, ']\n[')
  }
}

export default Matrix
