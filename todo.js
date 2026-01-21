'use strict';

const [, , command, ...args] = process.argv;

const tasks = [];

function printUsage() {
  console.log('Usage:');
  console.log('  node todo.js add <task>');
  console.log('  node todo.js list');
}

function addTask(title) {
  tasks.push({
    id: tasks.length + 1,
    title,
    completed: false
  });
}

function handleCommand() {
  if (command === 'add') {
    addTask(args.join(' '));
    console.log('Task added');
    return;
  }

  if (command === 'list') {
    console.log(tasks);
    return;
  }

  printUsage();
}

handleCommand();
