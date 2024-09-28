const fs = require("fs");
const path = require("path");
const directoryFilesPath = path.join(__dirname, "json-files");

/*
    Problem 1:
    
    Using callbacks and the fs module's asynchronous functions, do the following:
        1. Create a directory of random JSON files
        2. Delete those files simultaneously 

    Solve using Promise
*/

async function createAndDelete(numberOfFiles = 1) {
  try {
    await createDirectory(directoryFilesPath);
    console.log("Direcotry created!");
    const paths = await createJsonFiles(numberOfFiles, directoryFilesPath);
    console.log("Files are generated!");
    await deleteJsonFiles(paths);
    console.log("Files are deleted!");
  } catch (error) {
    console.log("Filed to perform task!");
    console.log(error);
  }
}

function createDirectory(directoryFilesPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(directoryFilesPath, (err, _data) => {
      if (err) {
        reject(err);
      } else {
        resolve("");
      }
    });
  });
}

function generateRandomJsonValues() {
  return JSON.stringify({
    id: Math.floor(Math.random() * 100000),
    user: `User${Math.floor(Math.random() * 1000)}`,
    value: Math.random() * 10,
  });
}

async function createJsonFiles(numberOfFiles, directoryPath) {
  const allPromise = [];
  for (let index = 1; index <= numberOfFiles; index++) {
    const fileName = path.join(directoryPath, `file${index}.json`);
    const jsonData = generateRandomJsonValues();
    const p = new Promise((resolve, reject) => {
      fs.writeFile(fileName, jsonData, (err, _data) => {
        if (err) {
          reject(err);
        } else {
          resolve(fileName);
        }
      });
    });
    allPromise.push(p);
  }

  return Promise.all(allPromise);
}

async function deleteJsonFiles(paths) {
  const deleteFiles = paths.map(
    (file) =>
      new Promise((resolve, reject) => {
        fs.unlink(file, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
  );
  return Promise.all(deleteFiles);
}

module.exports = { createAndDelete };
