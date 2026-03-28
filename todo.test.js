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

assert.equal(runCommand('add', ['learn', 'Node.js'], store), 0);
assert.equal(runCommand('complete', ['1'], store), 0);
assert.equal(runCommand('reopen', ['1'], store), 0);
assert.equal(runCommand('remove', ['1'], store), 0);
assert.equal(runCommand('remove', ['99'], store), 1);
assert.equal(runCommand('complete', ['bad'], store), 1);

const added = store.add('write tests');

assert.deepEqual(added, {
  id: 2,
  title: 'write tests',
  completed: false
});

assert.deepEqual(store.list(), [added]);

const updated = store.update(2, { completed: true });

assert.equal(updated.changed, true);
assert.equal(store.list()[0].completed, true);

saveTasks([createTask(3, 'review output')], tempFile);
assert.deepEqual(loadTasks(tempFile), [
  createTask(3, 'review output')
]);

assert.deepEqual(validateTitle('  buy milk  '), {
  valid: true,
  value: 'buy milk'
});

assert.equal(
  formatTask({
    id: 3,
    title: 'review output',
    completed: true
  }),
  '3. [done] review output'
);

fs.unlinkSync(tempFile);

console.log('Todo command tests passed');
