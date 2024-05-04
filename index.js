import path from "path";
import fs from "fs/promises";

const targetPath = path.resolve("downloads");

async function dirHandler(dirPath) {
  const data = await fs.readdir(dirPath);
  console.log(data);

  const pathList = data.map((el) => path.join(dirPath, el));
  console.log(pathList);

  const promiseList = pathList.map(async (pathItem) => {
    return {
      isDir: (await fs.stat(pathItem)).isDirectory(),
      itemPath: pathItem,
    };
  });

  const result = await Promise.allSettled(promiseList);

  const dirStat = result.map(({ value }) => value);
}

dirHandler(targetPath);
