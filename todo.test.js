'use strict';

const assert = require('node:assert').strict;
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  validateTitle,
  createTask,
  formatTask,
  loadTasks,
  saveTasks
} = require('./todo');

const tempFile = path.join(
  os.tmpdir(),
  `node-todo-test-${process.pid}.json`
);

const sampleTasks = [
  createTask(1, 'learn Node.js'),
  {
    id: 2,
    title: 'write tests',
    completed: true
  }
];

saveTasks(sampleTasks, tempFile);

assert.deepEqual(loadTasks(tempFile), sampleTasks);
assert.deepEqual(validateTitle('buy milk'), {
  valid: true,
  value: 'buy milk'
});
assert.equal(validateTitle('   ').valid, false);
assert.equal(validateTitle('x'.repeat(121)).valid, false);
assert.equal(validateTitle(123).valid, false);
assert.equal(
  formatTask(sampleTasks[0]),
  '1. [open] learn Node.js'
);
assert.equal(
  formatTask(sampleTasks[1]),
  '2. [done] write tests'
);

fs.writeFileSync(tempFile, '{"invalid":true}');

assert.throws(
  () => loadTasks(tempFile),
  /Todo data must be an array/
);

fs.unlinkSync(tempFile);

console.log('Todo persistence tests passed');
