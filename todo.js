'use strict';

const [, , command, ...args] = process.argv;

const tasks = [];

function printUsage() {
  console.log('Usage:');
  console.log('  node todo.js add <task>');
  console.log('  node todo.js list');
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

function addTask(title) {
  const task = {
    id: tasks.length + 1,
    title,
    completed: false
  };

  tasks.push(task);
  return task;
}

function listTasks() {
  if (tasks.length === 0) {
    console.log('No tasks found');
    return;
  }

  tasks.forEach(task => {
    const state = task.completed ? 'done' : 'open';
    console.log(`${task.id}. [${state}] ${task.title}`);
  });
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

    default:
      printUsage();
  }
}

handleCommand(command, args);
