const {Writable, Readable, Transform, Duplex} = require("node:stream");
const fs = require("node:fs");

// We are copying this 
// const stream = fs.createWriteStream("file.txt")


class FileWriteStream extends Writable {

  constructor({highWaterMark, fileName}) {
    super({highWaterMark});
    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.writesCount = 0;
  }

  // Run after normal constructor is run and will put off calling all other methods
  // until it's callback is called
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) =>{
      if (err) {
        // If error is passed into callback, stream will auto handle the error
        callback(err);
      } else {
        this.fd = fd;
        // when we're done, we should call the callback function w/o arguments
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    // Add chunk to this.chunks
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    // check the size of chunks 
    if (this.chunkSize > this.writableHighWaterMark) {
      // Do out write operation
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err)
        }
        this.chunks = [];
        this.chunkSize = 0; 
        ++ this.writesCount;
        callback(); 
      })
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);
      this.chunks = [];
      callback();
    })
  }

  _destroy(error, callback) {
    console.log("Number of writes: ", this.writesCount)
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error)
      })
    } else {
      callback(error);
    }
  }
}

// const stream = new FileWriteStream({highWaterMark: 1800, fileName: "text.txt"});
// stream.write(Buffer.from("This is some string"));
// stream.end(Buffer.from("Our Last Write"));
// stream.on("finish", ()=> {
//   console.log("stream has finished")
// });

(async () => {
  console.time("writeMany")
  
  const stream = new FileWriteStream({highWaterMark: 1800, fileName: "text.txt"});

  let i = 0;
  const numberOfWrites = 1000000

  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from( ` ${i} `);
      
      if (i ===  numberOfWrites - 1){
        return stream.end(buff);
      }

      // IF stream.write returns false stop loop
      if (!stream.write(buff)){
        i++;
        break;
      };
      i++
    }
    return;
  }
  writeMany();
  
  // Resume our loop once we are done draining
  stream.on("drain", () => {
    writeMany();
  });
  
  // When we are finished writing, we will close the file and end timer
  stream.on("finish", () => {
    console.timeEnd("writeMany");
  })

})();

