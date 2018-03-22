/* eslint-env jest */
const backupPackages = require('../')

test('main', () => {
  expect(typeof backupPackages).toBe('function')
})
