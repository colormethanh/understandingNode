const { Duplex } = require("node:stream");
const fs = require("node:fs");

class DuplexStream extends Duplex {
  constructor({
    writeableHighWaterMark,
    readableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ readableHighWaterMark, writeableHighWaterMark });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.readFd = null;
    this.writeFd = null;
    this.chunks = [];
    this.chunkSize = 0;
  }

  _construct(callback) {
    fs.open(this.readFileName, "r", (err, readFd) => {
      if (err) return callback(err);
      this.readFd = readFd;
      fs.open(this.writeFileName, "w", (err, writeFd) => {
        if (err) return callback(err);
        this.writeFd = writeFd;
        callback();
      })
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
      if (err) this.destroy(err);
      // Null indicates end of the stream
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _write(chunk, encoding, callback) {
    // Add chunk to this.chunks
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    // check the size of chunks
    if (this.chunkSize > this.writeableHighWaterMark) {
      // Do out write operation
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunkSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);
      this.chunks = [];
      callback();
    });
  }

  _destroy(err, callback) {
    callback(err)
  }
}

const duplex = new DuplexStream({
  readFileName: "read.txt", 
  writeFileName: "write.txt"
});

duplex.write(Buffer.from("Writing 1 \n"))
duplex.write(Buffer.from("Writing 2 \n"))
duplex.write(Buffer.from("Writing 3 \n"))
duplex.end(Buffer.from("Done writing \n"))

duplex.on('data', (chunk) => {
  console.log(chunk.toString("utf-8"));
})
