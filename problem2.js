const fs = require("fs");
const path = require("path");

/*
    Problem 2:
    
    Using callbacks and the fs module's asynchronous functions, do the following:
        1. Read the given file lipsum.txt
        2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
        3. Read the new file and convert it to lower case. Then split the contents into sentences. Then write it to a new file. Store the name of the new file in filenames.txt
        4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt
        5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.
*/

// Solve using Promise

const lipsumFilePath = path.join(__dirname, "lipsum.txt");
const uppercaseLipsumPath = path.join(__dirname, "uppercaseLipsum.txt");
const lowercaseLipsumPath = path.join(__dirname, "lowercaseLipsum.txt");
const sortedLipsumPath = path.join(__dirname, "sortedLipsum.txt");
const filenamesPath = path.join(__dirname, "filenames.txt");

function problem2() {
  readFile(lipsumFilePath)
    .then((data) => {
      console.log("File read complete!");
      return contentToUppercase(data, uppercaseLipsumPath);
    })
    .then(() => {
      console.log("Content updated to uppercase!");
      return storeFileName(filenamesPath, uppercaseLipsumPath);
    })
    .then(() => {
      console.log("Uppercase file name saved!");
      return contentToLowerCase(uppercaseLipsumPath);
    })
    .then(() => {
      console.log("Content updated to lowercase");
      return storeFileName(filenamesPath, lowercaseLipsumPath);
    })
    .then(() => {
      console.log("File name saved!");
      return sortContent(lowercaseLipsumPath);
    })
    .then(() => {
      console.log("Content Sorted!");
      return storeFileName(filenamesPath, sortedLipsumPath);
    })
    .then(() => {
      console.log("Sorted content file name saved!");
      return deleteFiles();
    })
    .then(() => {
      console.log("All files deleted!");
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
}

// 1. Read the given file lipsum.txt

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// 2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
async function contentToUppercase(data, path) {
  const uppercaseData = data.toUpperCase();
  return writeFile(path, uppercaseData);
}

// Store file name
async function storeFileName(path, newPath) {
  // before store new file path, check if any other path is present?

  let allPaths = [];
  return readFile(path)
    .then((data) => {
      if (!data) {
        allPaths = [newPath];
      } else {
        allPaths = data.split("\n");
        allPaths = [...allPaths, newPath];
      }

      return writeFile(path, allPaths.join("\n"));
    })
    .catch((err) => {
      console.log("Error " + err);
      allPaths = [newPath];
      return writeFile(path, allPaths.join("\n"));
    });
}

// 3. Read the new file and convert it to lower case.
//       Then split the contents into sentences.
//       Then write it to a new file. Store the name of the new file in filenames.txt

function writeFile(newFilePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(newFilePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("");
      }
    });
  });
}

async function contentToLowerCase(uppercaseLipsum) {
  // read the uppercase file;
  const upperCaseData = await readFile(uppercaseLipsum);

  const lowercaseData = upperCaseData.toLowerCase();
  const splitedSentences = lowercaseData.split(/(?<=[.!?])\s+/);
  return writeFile(lowercaseLipsumPath, splitedSentences.join("\n"));
}

// 4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt

async function sortContent(lowercaseLipsumPath) {
  return readFile(lowercaseLipsumPath)
    .then((data) => {
      const sortedData = data.split(" ").sort((a, b) => a.localeCompare(b));
      return writeFile(sortedLipsumPath, sortedData.join("\n"));
    })
    .catch((err) => err);
}

// 5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.
async function deleteFiles() {
  return readFile(filenamesPath)
    .then((data) => {
      const allFileNames = data.split("\n");
      const deletedFiles = allFileNames.map(
        (filePath) =>
          new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          })
      );
      return Promise.all(deletedFiles);
    })
    .catch((err) => err);
}

module.exports = { problem2 };
