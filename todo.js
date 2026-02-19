'use strict';

const [, , command, ...args] = process.argv;

const tasks = [];

function printUsage() {
  console.log('Usage:');
  console.log('  node todo.js add <task>');
  console.log('  node todo.js list');
  console.log('  node todo.js remove <id>');
}

function validateTitle(title) {
  if (!title) {
    return {
      valid: false,
      reason: 'A task title is required'
    };
  }

  if (title.length > 120) {
    return {
      valid: false,
      reason: 'A task title must not exceed 120 characters'
    };
  }

  return {
    valid: true,
    value: title
  };
}

function createTask(id, title) {
  return {
    id,
    title,
    completed: false
  };
}

function addTask(title) {
  const task = createTask(tasks.length + 1, title);
  tasks.push(task);
  return task;
}

function removeTask(id) {
  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return {
      removed: false,
      reason: `Task not found: ${id}`
    };
  }

  const [task] = tasks.splice(index, 1);

  return {
    removed: true,
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
      const title = args.join(' ').trim();
      const result = validateTitle(title);

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

      if (!result.removed) {
        console.error(result.reason);
        process.exitCode = 1;
      } else {
        console.log(`Task removed: ${result.task.title}`);
      }

      break;
    }

    default:
      printUsage();
  }
}

handleCommand(command, args);
