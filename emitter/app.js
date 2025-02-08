const EventEmitter = require("./events");
class Emitter extends EventEmitter {}

const myE = new Emitter();

myE.on("foo", () => {
  console.log("An event occurred.");
});

myE.on("foo", () => {
  console.log("An event occurred. 2");
});

myE.on("foo", (x) => {
  console.log("An event occurred with parameter:", x);
});

myE.emit("foo", "parameter text");
