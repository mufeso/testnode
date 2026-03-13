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

let tasks;

try {
  tasks = loadTasks();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function printUsage() {
  console.log('Usage:');
  console.log('  node todo.js add <task>');
  console.log('  node todo.js list');
  console.log('  node todo.js remove <id>');
  console.log('  node todo.js complete <id>');
  console.log('  node todo.js reopen <id>');
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

function createTask(id, title) {
  return {
    id,
    title,
    completed: false
  };
}

function nextId() {
  return tasks.reduce((highest, task) => Math.max(highest, task.id), 0) + 1;
}

function addTask(title) {
  const task = createTask(nextId(), title);
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

function removeTask(id) {
  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return {
      changed: false,
      reason: `Task not found: ${id}`
    };
  }

  const [task] = tasks.splice(index, 1);
  saveTasks(tasks);

  return {
    changed: true,
    task
  };
}

function updateTask(id, changes) {
  const task = tasks.find(item => item.id === id);

  if (!task) {
    return {
      changed: false,
      reason: `Task not found: ${id}`
    };
  }

  Object.assign(task, changes);
  saveTasks(tasks);

  return {
    changed: true,
    task
  };
}

function formatTask(task) {
  const state = task.completed ? 'done' : 'open';
  return `${task.id}. [${state}] ${task.title}`;
}

function listTasks() {
  if (tasks.length === 0) {
    console.log('No tasks found');
    return;
  }

  console.log(tasks.map(formatTask).join('\n'));
}

function handleCommand(command, args) {
  switch (command) {
    case 'add': {
      const result = validateTitle(args.join(' '));

      if (!result.valid) {
        console.error(result.reason);
        process.exitCode = 1;
        return;
      }

      const task = addTask(result.value);
      console.log(`Task added: ${task.title}`);
      break;
    }

    case 'list':
      listTasks();
      break;

    case 'remove': {
      const id = Number(args[0]);

      if (!Number.isInteger(id)) {
        console.error('A numeric task ID is required');
        process.exitCode = 1;
        return;
      }

      const result = removeTask(id);

      if (!result.changed) {
        console.error(result.reason);
        process.exitCode = 1;
      } else {
        console.log(`Task removed: ${result.task.title}`);
      }

      break;
    }

    case 'complete':
    case 'reopen': {
      const id = Number(args[0]);

      if (!Number.isInteger(id)) {
        console.error('A numeric task ID is required');
        process.exitCode = 1;
        return;
      }

      const result = updateTask(id, {
        completed: command === 'complete'
      });

      if (!result.changed) {
        console.error(result.reason);
        process.exitCode = 1;
      } else {
        console.log(`Task updated: ${result.task.title}`);
      }

      break;
    }

    default:
      printUsage();
  }
}

if (require.main === module) {
  handleCommand(command, args);
}

module.exports = {
  validateTitle,
  createTask,
  formatTask,
  loadTasks,
  saveTasks
};

