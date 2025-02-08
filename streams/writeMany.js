// const fs = require("fs/promises");

// Execution time: ~40s
// cpu 7%
// Memory 40mb

// (async () => {
//   console.time("writeMany")
//   const fileHandler =  await fs.open("random.txt", "w");
  
//   for (let i = 0; i < 1000000; i ++) {
//     await fileHandler.write(`${i} `);
//   }
//   console.timeEnd("writeMany")
// })();



// Execution time: 4.6 seconds
// CPU usage: 5%
// memory: 50mb
// const fs = require("node:fs");

// (() => {
//   console.time("writeMany")
//   fs.open("random.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i ++) {
//       fs.writeSync(fd, `${i} `);
//     }
//     console.timeEnd("writeMany")
//   });
  
// })();


// Execution time: ???
// CPU usage: 12%
// memory: 700mb
// The numbers written are out of order

// const fs = require("node:fs");

// (() => {
//   console.time("writeMany")
//   fs.open("random.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i ++) {
//       fs.write(fd, `${i} `, () => {});
//     }
//   });
//   console.timeEnd("writeMany")
// })();



// DON'T DO IT THIS WAY bc memory 
// Execution time: 450ms
// CPU usage: 2.6%
// memory: ~200mb
// const fs = require("fs/promises");

// (async () => {
//   console.time("writeMany")
//   const fileHandler =  await fs.open("random.txt", "w");
//   const stream = fileHandler.createWriteStream()
//   for (let i = 0; i < 1000000; i ++) {
//     const buff = Buffer.from(`${i} `, 'utf-8')
//     stream.write(buff);
//   }
//   console.timeEnd("writeMany")
// })();



// Fixing memory issue problem
const fs = require("fs/promises");

(async () => {
  console.time("writeMany")
  const fileHandler =  await fs.open("random.txt", "w");
  
  // 8 bits = 1 byte
  // 1000 bytes = 1 kilobyte
  // 1000 kilobytes = 1 megabyte 

  // 1a => 0001 1010

  const stream = fileHandler.createWriteStream();
  console.log(stream.writableHighWaterMark); 
  console.log(stream.writableLength);
  const buff = Buffer.alloc(16383, 10);
  console.log(stream.write(buff))
  console.log(stream.write(Buffer.alloc(1, "a")));

  stream.on("drain", () => {
    console.log("We are now safe to write more!")
  })
  setInterval(() => {}, 1000)
  // stream.write(buff)
  // for (let i = 0; i < 1000000; i ++) {
  //   const buff = Buffer.from(`${i} `, 'utf-8')
  //   stream.write(buff);
  // }
  console.timeEnd("writeMany")
  // fileHandler.close();
})();