const { Buffer, constants } = require("buffer");

// const b = Buffer.alloc(1e9); // 1,000,000,000 bytes (1 GB)
// const b = Buffer.alloc(8e8); // 800,000,000 bytes (500 MB)
// const b = Buffer.alloc(1073741824); // 1 GiB
const b = Buffer.alloc(536870912); // 500 MiB

// The maximum number of bytes you can allocate to a buffer by default
console.log(constants.MAX_LENGTH);

setInterval(() => {
  // for (let i = 0; i < b.length; i++) { // b.length is the size of the buffer in bytes
  //   b[i] = 0x22;
  // }

  // This will do the exact same thing as the for loop, and it's more efficient
  b.fill(0x22);
}, 5000);
