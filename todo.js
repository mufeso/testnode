'use strict';

const [, , command, ...args] = process.argv;

console.log({
  command: command || null,
  args
});
