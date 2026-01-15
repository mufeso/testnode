'use strict';

const [, , command, ...args] = process.argv;

function printUsage() {
  console.log('Usage: node todo.js <command> [arguments]');
}

if (!command) {
  printUsage();
} else {
  console.log({
    command,
    args
  });
}
