const fs = require("node:fs/promises");

// Works pretty fast, faster than our writeMany since the chunk sizes are larger.
// E.G., 3 Bytes at for a time, vs 64 * 2024 bytes
// (async ( ) => {

//   const fileHandleRead = await fs.open("src.txt", "r");
//   const fileHandleWrite = await fs.open("dest.txt", "w");

//   const streamRead = fileHandleRead.createReadStream({
//     highWaterMark: 64 * 1024 // This high watermark is larger than the default for write streams
//   });
//   const streamWrite = fileHandleWrite.createWriteStream();

//   streamRead.on("data", (chunk) => {
//     // console.log("--------------------------------------");
//     // console.log(chunk);

//     streamWrite.write(chunk);
//   });

// })();

(async () => {
  console.time("readBig");
  const fileHandleRead = await fs.open("src.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024, // This high watermark is larger than the default for write streams
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  let split = "";
  streamRead.on("data", (chunk) => {
    // console.log("--------------------------------------");

    const numbers = chunk.toString("utf-8").split("  ");

    // check if first chunk is split
    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) numbers[0] = split + numbers[0];
    }

    // check if last numbers is split
    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }

    // Loop through the numbers and only write the even ones
    numbers.forEach((number) => {
      const n = Number(number);

      if (n % 2 === 0) {
        if (!streamWrite.write(" " + n + " ")) {
          streamRead.pause();
        }
      }
    });
  });
  
  streamWrite.on("drain", () => {
    streamRead.resume();
  });
  
  streamRead.on("end", () => {
    console.log("Done reading.");
    console.timeEnd("readBig");
  })
})();
