'use strict';

const assert = require('node:assert').strict;
const {
  validateTitle,
  createTask,
  formatTask
} = require('./todo');

assert.deepEqual(validateTitle('buy milk'), {
  valid: true,
  value: 'buy milk'
});

assert.equal(validateTitle('   ').valid, false);

assert.deepEqual(createTask(1, 'learn Node.js'), {
  id: 1,
  title: 'learn Node.js',
  completed: false
});

assert.equal(formatTask(createTask(1, 'learn Node.js')), '1. [open] learn Node.js');

console.log('Todo unit tests passed');
