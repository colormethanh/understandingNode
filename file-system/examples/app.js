const fs = require("fs");

const contents = fs.readFileSync("./text.txt");

console.log(contents);
