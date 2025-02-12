const fs = require('node:fs/promises');
const {pipeline} = require("node:stream");

// File size copied 1gb
// Memory Usage: 1GB;
// Execution Time: 1.7s;
// Large memory usage!!! 
// (async () => {
//   console.time("copy");
//   const destFile = await fs.open("text-copy.txt", "w");
//   const results = await fs.readFile("text-gigantic.txt");


//   await destFile.write(results);

//   console.log(results);
//   console.timeEnd("copy");
// })();



// File size copied 1gb
// Memory Usage: 20mb;
// Execution Time: 3.5s;
// Execution time went up BUT we are no longer limited by our memory so we are able to copy any file
// (async () => {
//   console.time("copy");
//   const srcFile = await fs.open("text-gigantic.txt", "r");
//   const destFile = await fs.open("text-copy.txt", "w");

//   let bytesRead = -1;
//   while (bytesRead !== 0) {
//     const readResult = await srcFile.read() // Not the difference b/w read and readFile
//     bytesRead = readResult.bytesRead;
//     if (bytesRead !== 16384) {
//       // Find the location of first zero (i.e., empty in our buffer)
//       const indexOfNotFilled = readResult.buffer.indexOf(0);

//       // Create a new buffer 
//       const newBuffer = Buffer.alloc(indexOfNotFilled);

//       // Copy into new buffer the info from readResults starting at index 0 up until the index of not filled 
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);

//       // Write the newBuffer to the destination file
//       destFile.write(newBuffer)
//     } else {
//       destFile.write(readResult.buffer);
//     }
//   }

//   console.timeEnd("copy");
//   setInterval(() => {}, 1000)
// })();

// File size copied 1gb
// Memory Usage: 26mb;
// Execution Time: 1.7s;
(async () => {
  console.time("copy");
  const srcFile = await fs.open("text-gigantic.txt", "r");
  const destFile = await fs.open("text-copy.txt", "w");
  
  const readStream = srcFile.createReadStream();
  const writeStream  = destFile.createWriteStream();

  // Must pass in a writable stream
  // Pipe automatically waits for draining and writes to the destination
  // readStream.pipe(writeStream);
  
  // readStream.on("end", () => {
  //   console.timeEnd("copy");
  // })


  pipeline(readStream, writeStream, (error) => {
    console.log(error);
    console.timeEnd("copy");
  }); 
})();