'use strict';

const fs = require('node:fs');
const path = require('node:path');

const DATA_FILE = path.join(__dirname, 'tasks.json');
const [, , command, ...args] = process.argv;

function loadTasks(file = DATA_FILE) {
  if (!fs.existsSync(file)) {
    return [];
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (!Array.isArray(parsed)) {
      throw new Error('Todo data must be an array');
    }

    return parsed;
  } catch (error) {
    throw new Error(`Could not read task data: ${error.message}`);
  }
}

function saveTasks(tasks, file = DATA_FILE) {
  fs.writeFileSync(file, `${JSON.stringify(tasks, null, 2)}\n`);
}

function createTask(id, title) {
  return {
    id,
    title,
    completed: false
  };
}

function validateTitle(title) {
  if (typeof title !== 'string') {
    return {
      valid: false,
      reason: 'A task title must be a string'
    };
  }

  const value = title.trim();

  if (!value) {
    return {
      valid: false,
      reason: 'A task title is required'
    };
  }

  if (value.length > 120) {
    return {
      valid: false,
      reason: 'A task title must not exceed 120 characters'
    };
  }

  return {
    valid: true,
    value
  };
}

function formatTask(task) {
  const state = task.completed ? 'done' : 'open';
  return `${task.id}. [${state}] ${task.title}`;
}

function createTodoStore(file = DATA_FILE) {
  const tasks = loadTasks(file);

  function nextId() {
    return tasks.reduce((highest, task) => Math.max(highest, task.id), 0) + 1;
  }

  function add(title) {
    const task = createTask(nextId(), title);
    tasks.push(task);
    saveTasks(tasks, file);
    return task;
  }

  function remove(id) {
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
      return {
        changed: false,
        reason: `Task not found: ${id}`
      };
    }

    const [task] = tasks.splice(index, 1);
    saveTasks(tasks, file);

    return {
      changed: true,
      task
    };
  }

  function update(id, changes) {
    const task = tasks.find(item => item.id === id);

    if (!task) {
      return {
        changed: false,
        reason: `Task not found: ${id}`
      };
    }

    Object.assign(task, changes);
    saveTasks(tasks, file);

    return {
      changed: true,
      task
    };
  }

  function list() {
    return [...tasks];
  }

  return {
    add,
    remove,
    update,
    list
  };
}

function printUsage() {
  console.log('Usage:');
  console.log('  node todo.js add <task>');
  console.log('  node todo.js list');
  console.log('  node todo.js remove <id>');
  console.log('  node todo.js complete <id>');
  console.log('  node todo.js reopen <id>');
}

function runCommand(command, args, store) {
  switch (command) {
    case 'add': {
      const result = validateTitle(args.join(' '));

      if (!result.valid) {
        console.error(result.reason);
        return 1;
      }

      const task = store.add(result.value);
      console.log(`Task added: ${task.title}`);
      return 0;
    }

    case 'list': {
      const tasks = store.list();

      if (tasks.length === 0) {
        console.log('No tasks found');
        return 0;
      }

      console.log(tasks.map(formatTask).join('\n'));
      return 0;
    }

    case 'remove': {
      const id = Number(args[0]);

      if (!Number.isInteger(id)) {
        console.error('A numeric task ID is required');
        return 1;
      }

      const result = store.remove(id);

      if (!result.changed) {
        console.error(result.reason);
        return 1;
      }

      console.log(`Task removed: ${result.task.title}`);
      return 0;
    }

    case 'complete':
    case 'reopen': {
      const id = Number(args[0]);

      if (!Number.isInteger(id)) {
        console.error('A numeric task ID is required');
        return 1;
      }

      const result = store.update(id, {
        completed: command === 'complete'
      });

      if (!result.changed) {
        console.error(result.reason);
        return 1;
      }

      console.log(`Task updated: ${result.task.title}`);
      return 0;
    }

    default:
      printUsage();
      return 1;
  }
}

if (require.main === module) {
  try {
    const store = createTodoStore();
    process.exitCode = runCommand(command, args, store);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  validateTitle,
  createTask,
  formatTask,
  loadTasks,
  saveTasks,
  createTodoStore,
  runCommand
};
