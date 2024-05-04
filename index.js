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
const isExistDir = {};

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

  const finallResult = dirStat.map(async (el) => {
    if (el.isDir) {
      await dirHandler(el.itemPath);
    } else {
      await fileHandler(el.itemPath);
    }
  });
  await Promise.allSettled(finallResult);
}

async function fileHandler(filePath) {
  const { ext, base } = path.parse(filePath);
  for (let key in dirDict) {
    if (dirDict[key].includes(ext)) {
      const sortedDir = path.join(targetPath, key);
      if (!isExistDir[key]) {
        isExistDir[key] = true;
        await fs.mkdir(sortedDir);
      }
      await fs.rename(filePath, path.join(sortedDir, base));
      return;
    }
  }
  const otherDir = path.join(targetPath, "other");
  if (!isExistDir["other"]) {
    isExistDir["other"] = true;
    await fs.mkdir(otherDir);
  }
  await fs.rename(filePath, path.join(otherDir, base));
  //write to  dir 'other'
}

dirHandler(targetPath);
