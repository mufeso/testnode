'use strict';

const [, , command, ...args] = process.argv;

function printUsage() {
  console.log('Usage:');
  console.log('  node todo.js add <task>');
  console.log('  node todo.js list');
}

function handleCommand() {
  if (!command) {
    printUsage();
    return;
  }

  console.log({
    command,
    args
  });
}

handleCommand();
