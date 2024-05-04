import path from "path";
import fs from "fs/promises";

const targetPath = path.resolve("downloads");

const dirDict = {
  documents: [".txt", ".doc", ".pdf", ".docx"],
  images: [".png", ".jpg", ".webp", ".svg", ".ico"],
  videos: [".mp3", ".mp4", ".avi", ".mkv"],
  archives: [".zip", ".rar"],
  others: [],
};

async function dirHandler(dirPath) {
  const data = await fs.readdir(dirPath);

  const pathList = data.map((el) => path.join(dirPath, el));

  const promiseList = pathList.map(async (itemPath) => {
    return {
      isDir: (await fs.stat(itemPath)).isDirectory(),
      itemPath,
    };
  });

  const result = await Promise.allSettled(promiseList);

  const dirStat = result.map(({ value }) => value);

  dirStat.forEach((el) => {
    if (el.isDir) {
      dirHandler(el.itemPath);
    } else {
      fileHandler(el.itemPath);
    }
  });
}

async function fileHandler(filePath) {
  const { ext } = path.parse(filePath);
  for (let key in dirDict) {
    if (dirDict[key].includes(ext)) {
      // write to dir 'key'
      return;
    }
  }
  //write to  dir 'other'
}

dirHandler(targetPath);
