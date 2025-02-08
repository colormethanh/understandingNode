const fs = require("fs/promises");

// open (32) file descriptor
// read or write

(async () => {
  // Commands
  const CREATE_FILE = "create a file";
  // ex. command -> create a file file.js
  const DELETE_FILE = "delete the file";
  // ex. command -> delete the file file.js
  const RENAME_FILE = "rename a file";
  // ex. command -> rename a file file.js to renamedFile.js
  const ADD_TO_FILE = "add to the file";
  // ex. command -> add to the file file.js this content: renamedFile.js


  // Actions
  const createFile = async (path) => {
    console.log(path);
    try {
      const existingFileHandle = await fs.open(path, "r");
      await existingFileHandle.close();
      // we already have that file
      return console.log(`This file ${path} already exists`);
    } catch (e) {
      // We don't have the file, so now create it
      const newFileHandle = await fs.open(path, "w");
      console.log("a new file was successfully created.");
      await newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
    console.log("deleting", path);
    try {
      const existingFileHandle = await fs.open(path, "r");
      await existingFileHandle.close();
      await fs.rm(path);
    } catch {
      return console.log("File does not exist")
    }
  };

  const renameFile = async (oldPath, newPath) => {
    console.log(`Renaming ${oldPath} to ${newPath}`);
    try {
      const existingFileHandle = await fs.open(oldPath, "r");
      await existingFileHandle.close();
      fs.rename(oldPath, newPath);
    } catch {
      return console.log("File does not exist")
    }
  };

  const addToFile = async (path, contents) => {
    console.log(`Adding ${contents} to ${path}`);
    try {
      const existingFileHandle = await fs.open(path, "a");
      
      await existingFileHandle.write(contents);
      await existingFileHandle.close();
    } catch (err) {

      if (err.type === "ENOS") {
        return console.log("File does not exist")
      } else {
        console.log("An error occurred");
        return console.log(err);
      }
      
    }
  };


  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // Get size of our file
    const size = (await commandFileHandler.stat()).size;
    // allocate buffer with our file size
    const buff = Buffer.alloc(size);
    // Location in our buffer from which we want to write
    const offset = 0;
    // How many bytes we want to read
    const length = buff.byteLength;
    // Position that we want to start reading our file from
    const position = 0;

    // We always want to read the whole document (from beginning to end)
    await commandFileHandler.read(buff, offset, length, position);

    // Decode our contents
    const command = buff.toString("utf-8");

    // create a file:
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filepath = command.substring(CREATE_FILE.length + 1);
      createFile(filepath);
    }

    // Delete a file:
    // delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // Rename a fil:
    // rename a file <path>
    if (command.includes(RENAME_FILE)) {
      console.log("Renaming file");
      const index = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, index);
      const newFilePath = command.substring(index + 4);
      renameFile(oldFilePath, newFilePath);
    }

    // Add to file:
    // add to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const index = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, index);
      const contents = command.substring(index + 15);
      addToFile(filePath, contents);
    }
  });

  // Watcher
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }

  // commandFileHandler.close();
})();
