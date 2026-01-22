'use strict';

const [, , command, ...args] = process.argv;

const tasks = [];

function printUsage() {
  console.log('Usage:');
  console.log('  node todo.js add <task>');
  console.log('  node todo.js list');
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
    console.log(`${task.id}. ${task.title}`);
  });
}

function handleCommand() {
  if (command === 'add') {
    const task = addTask(args.join(' '));
    console.log(`Task added: ${task.title}`);
    return;
  }

  if (command === 'list') {
    listTasks();
    return;
  }

  printUsage();
}

handleCommand();
