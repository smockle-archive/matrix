import Matrix from '../lib/matrix'
import test from 'tape'
import util from 'util'
const { inspect } = util

test('Matrix', function (t) {
  t.plan(60)

  // Matrix
  const error = new TypeError('Matrix must be a number or array of numbers')
  t.ok(Matrix([]) instanceof Matrix, 'instanceof Matrix')
  t.throws(Matrix.bind(Matrix, 'string'), error, 'throws string')
  t.throws(Matrix.bind(Matrix, ['string']), error, 'throws string array')
  t.throws(Matrix.bind(Matrix, [['string']]), error, 'throws 2D string array')
  t.throws(Matrix.bind(Matrix, [[1, 2]]), error, 'throws unnecessary nesting')
  t.throws(
    Matrix.bind(Matrix, [[1, 2], [3, 'string']]),
    error,
    'throws mixed type arrays'
  )
  t.throws(
    Matrix.bind(Matrix, [[1, 2], [3], [4, 5]]),
    error,
    'throws uneven rows'
  )
  t.doesNotThrow(Matrix.bind(Matrix, 1), 'does not throw number')
  t.doesNotThrow(Matrix.bind(Matrix, [1]), 'does not throw number array')
  t.doesNotThrow(
    Matrix.bind(Matrix, [[1], [2]]),
    'does not throw 2D number array'
  )

  // Matrix.addable
  t.notOk(Matrix.addable('string', Matrix([3])), 'addable string and matrix')
  t.notOk(Matrix.addable(Matrix([3]), 'string'), 'addable matrix and string')
  t.notOk(
    Matrix.addable(Matrix([[1, 2], [3, 4]]), Matrix([[1, 2, 3], [4, 5, 6]])),
    'addable mismatched columns'
  )
  t.notOk(
    Matrix.addable(Matrix([[1, 2], [3, 4]]), Matrix([[1, 2], [4, 5], [7, 8]])),
    'addable mismatched rows'
  )
  t.ok(
    Matrix.addable(Matrix([[1, 2], [3, 4]]), Matrix([[5, 6], [7, 8]])),
    'addable'
  )

  // Matrix#addable
  t.notOk(Matrix([3]).addable('string'), 'addable matrix and string')
  t.notOk(
    Matrix([[1, 2], [3, 4]]).addable(Matrix([[1, 2, 3], [4, 5, 6]])),
    'addable mismatched columns'
  )
  t.notOk(
    Matrix([[1, 2], [3, 4]]).addable(Matrix([[1, 2], [4, 5], [7, 8]])),
    'addable mismatched rows'
  )
  t.ok(Matrix([[1, 2], [3, 4]]).addable(Matrix([[5, 6], [7, 8]])), 'addable')

  // Matrix.add
  t.throws(
    Matrix.add.bind(
      Matrix,
      Matrix([[1, 2], [3, 4]]),
      Matrix([[1, 2, 3], [4, 5, 6]])
    ),
    new TypeError('Matrices are not addable'),
    'add throws typerror'
  )
  t.deepEqual(
    Matrix.add(Matrix([[1, 2], [3, 4]]), Matrix([[5, 6], [7, 8]])),
    Matrix([[6, 8], [10, 12]]),
    'add'
  )

  // Matrix#add
  const addmatrix = Matrix([[1, 2], [3, 4]])
  t.throws(
    addmatrix.add.bind(addmatrix, Matrix([[1, 2, 3], [4, 5, 6]])),
    new TypeError('Matrices are not addable'),
    'add throws typerror'
  )
  t.deepEqual(
    Matrix([[1, 2], [3, 4]]).add(Matrix([[5, 6], [7, 8]])),
    Matrix([[6, 8], [10, 12]]),
    'add'
  )

  // Matrix.multipliable
  t.notOk(
    Matrix.multipliable('string', Matrix([3])),
    'multipliable string and matrix'
  )
  t.notOk(
    Matrix.multipliable(Matrix([3]), 'string'),
    'multipliable matrix and string'
  )
  t.notOk(
    Matrix.multipliable(
      Matrix([[1, 2, 3], [4, 5, 6]]),
      Matrix([[1, 2], [4, 5]])
    ),
    'multipliable mismatched columns and rows'
  )
  t.ok(
    Matrix.multipliable(Matrix([[1, 2], [3, 4]]), Matrix([[5, 6], [7, 8]])),
    'multipliable'
  )

  // Matrix#multipliable
  t.notOk(Matrix([3]).multipliable('string'), 'multipliable matrix and string')
  t.notOk(
    Matrix([[1, 2, 3], [4, 5, 6]]).multipliable(Matrix([[1, 2], [4, 5]])),
    'multipliable mismatched columns and rows'
  )
  t.ok(
    Matrix([[1, 2], [3, 4]]).multipliable(Matrix([[5, 6], [7, 8]])),
    'multipliable'
  )

  // Matrix.multiply
  const multiplymatrix = Matrix([1, 2, 3])
  t.throws(
    multiplymatrix.multiply.bind(multiplymatrix, Matrix([1, 2], [3, 4])),
    new TypeError('Matrices are not multipliable'),
    'multiply throws typerror'
  )
  t.deepEqual(Matrix(3).multiply(Matrix(6)), Matrix(18), 'multiply number')
  t.deepEqual(
    Matrix([1, 2]).multiply(Matrix([[3], [4]])),
    Matrix([11]),
    'multiply A (1x2) and B (2x1)'
  )
  t.deepEqual(
    Matrix([[1, 2], [3, 4]]).multiply(Matrix([[5, 6], [7, 8]])),
    Matrix([[19, 22], [43, 50]]),
    'multiply A (2x2) and B (2x2)'
  )
  t.deepEqual(
    Matrix([[1, 9, 7], [8, 1, 2]]).multiply(
      Matrix([[3, 2, 1, 5], [5, 4, 7, 3], [6, 9, 6, 8]])
    ),
    Matrix([[90, 101, 106, 88], [41, 38, 27, 59]]),
    'multiply A (2x3) and B (3x4)'
  )

  // Matrix#multiply
  t.throws(
    Matrix.multiply.bind(Matrix, Matrix([1, 2, 3]), Matrix([1, 2], [3, 4])),
    new TypeError('Matrices are not multipliable'),
    'multiply throws typerror'
  )
  t.deepEqual(
    Matrix.multiply(Matrix(3), Matrix(6)),
    Matrix(18),
    'multiply number'
  )
  t.deepEqual(
    Matrix.multiply(Matrix([1, 2]), Matrix([[3], [4]])),
    Matrix([11]),
    'multiply A (1x2) and B (2x1)'
  )
  t.deepEqual(
    Matrix.multiply(Matrix([[1, 2], [3, 4]]), Matrix([[5, 6], [7, 8]])),
    Matrix([[19, 22], [43, 50]]),
    'multiply A (2x2) and B (2x2)'
  )
  t.deepEqual(
    Matrix.multiply(
      Matrix([[1, 9, 7], [8, 1, 2]]),
      Matrix([[3, 2, 1, 5], [5, 4, 7, 3], [6, 9, 6, 8]])
    ),
    Matrix([[90, 101, 106, 88], [41, 38, 27, 59]]),
    'multiply A (2x3) and B (3x4)'
  )

  // Matrix#valueOf
  const array = [3]
  t.equal(Matrix(array).valueOf(), array, 'valueOf Matrix')

  // Matrix#countRows
  t.equal(Matrix(1).countRows(), 0, 'countRows number')
  t.equal(Matrix([1]).countRows(), 1, 'countRows number array')
  t.equal(
    Matrix([[1, 2], [3, 4], [5, 6]]).countRows(),
    3,
    'countRows 2D number array'
  )

  // Matrix#countColumns
  t.equal(Matrix(1).countColumns(), 0, 'countColumns number')
  t.equal(Matrix([1]).countColumns(), 1, 'countColumns number array')
  t.equal(Matrix([[1], [2]]).countColumns(), 1, 'countColumns 2D number array')
  t.equal(
    Matrix([[1, 2], [3, 4], [5, 6]]).countColumns(),
    2,
    'countColumns many 2D number array'
  )

  // Matrix#transpose
  t.deepEqual(Matrix(1).transpose(), Matrix(1), 'transpose number')
  t.deepEqual(
    Matrix([1, 2]).transpose(),
    Matrix([[1], [2]]),
    'transpose number array'
  )
  t.deepEqual(
    Matrix([[1, 2, 3], [4, 5, 6]]).transpose(),
    Matrix([[1, 4], [2, 5], [3, 6]]),
    'transpose 2D number array'
  )

  // Matrix#invert
  t.deepEqual(
    Matrix([[1, 2], [3, 4]]).invert(),
    Matrix([[-2, 1], [1.5, -0.5]]),
    'invert 2D number array'
  )

  // Matrix#map
  const matrix = Matrix([1, 2, 3])
  t.ok(matrix.map(x => x + 1) instanceof Matrix, 'map returns a matrix')
  t.deepEqual(matrix.map(x => x), matrix, 'map identity')
  t.deepEqual(matrix.map(x => x + 1), Matrix([2, 3, 4]), 'map increment')
  t.deepEqual(matrix, Matrix([1, 2, 3]), 'map non-mutable')

  // Matrix#inspect
  t.equal(inspect(Matrix(3)), '3', 'inspect number')
  t.equal(inspect(Matrix([1, 2, 3])), '[ 1 2 3 ]', 'inspect number array')
  t.equal(
    inspect(Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]])),
    '[ 1 2 3 ]\n[ 4 5 6 ]\n[ 7 8 9 ]',
    'inspect 2D number array'
  )
  t.equal(
    inspect(Matrix([[1, 2, 3], [-10, 11, -12], [100, 0, 0]])),
    '[   1  2   3 ]\n[ -10 11 -12 ]\n[ 100  0   0 ]',
    'inspect padded 2D number array'
  )
})
