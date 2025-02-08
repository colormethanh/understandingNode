const { Buffer } = require("buffer");

const memoryContainer = Buffer.alloc(4);

memoryContainer[0] = 0xf4;
memoryContainer[1] = 123;

console.log(memoryContainer);
