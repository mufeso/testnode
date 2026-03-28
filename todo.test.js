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
  saveTasks,
  createTodoStore,
  runCommand
} = require('./todo');

const tempFile = path.join(
  os.tmpdir(),
  `node-todo-test-${process.pid}.json`
);

const store = createTodoStore(tempFile);

assert.deepEqual(store.list(), []);

const added = store.add('learn Node.js');

assert.deepEqual(added, {
  id: 1,
  title: 'learn Node.js',
  completed: false
});

assert.deepEqual(store.list(), [added]);

const updated = store.update(1, { completed: true });

assert.equal(updated.changed, true);
assert.equal(store.list()[0].completed, true);

const removed = store.remove(1);

assert.equal(removed.changed, true);
assert.deepEqual(store.list(), []);

saveTasks([createTask(2, 'write tests')], tempFile);
assert.deepEqual(loadTasks(tempFile), [
  createTask(2, 'write tests')
]);

assert.deepEqual(validateTitle('  buy milk  '), {
  valid: true,
  value: 'buy milk'
});

assert.equal(
  formatTask({
    id: 2,
    title: 'write tests',
    completed: true
  }),
  '2. [done] write tests'
);

assert.equal(runCommand('invalid', [], store), 1);

fs.unlinkSync(tempFile);

console.log('Todo store tests passed');
