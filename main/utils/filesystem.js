const path = require('path');
const fs = require('fs-extra');
const fsPromises = require('fs/promises');
const { dialog } = require('electron');
const isValidPathname = require('is-valid-path');

const exists = async p => {
  try {
    await fsPromises.access(p);
    return true;
  } catch (_) {
    return false;
  }
};

const isSymbolicLink = filepath => {
  try {
    return fs.existsSync(filepath) && fs.lstatSync(filepath).isSymbolicLink();
  } catch (_) {
    return false;
  }
};

const isFile = filepath => {
  try {
    return fs.existsSync(filepath) && fs.lstatSync(filepath).isFile();
  } catch (_) {
    return false;
  }
};

const isDirectory = dirPath => {
  try {
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
  } catch (_) {
    return false;
  }
};

const normalizeAndResolvePath = pathname => {
  if (isSymbolicLink(pathname)) {
    const absPath = path.dirname(pathname);
    const targetPath = path.resolve(absPath, fs.readlinkSync(pathname));
    if (isFile(targetPath) || isDirectory(targetPath)) {
      return path.resolve(targetPath);
    }
    console.error(`Cannot resolve link target "${pathname}" (${targetPath}).`)
    return '';
  }
  return path.resolve(pathname);
};

const writeFile = async (pathname, content) => {
  try {
    fs.writeFileSync(pathname, content, {
      encoding: "utf8"
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

const hasYamlExtension = filename => {
  if (!filename || typeof filename !== 'string') return false
  return ['yml', 'yaml'].some(ext => filename.toLowerCase().endsWith(`.${ext}`))
}

const createDirectory = async (dir) => {
  if(!dir) {
    throw new Error(`directory: path is null`);
  }

  if (fs.existsSync(dir)){
    throw new Error(`directory: ${dir} already exists`);
  }

  return fs.mkdirSync(dir);
};

const browseDirectory = async (win) => {
  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'createDirectory']
  });

  if (!filePaths || !filePaths[0]) {
    return false;
  }

  const resolvedPath = normalizeAndResolvePath(filePaths[0]);
  return isDirectory(resolvedPath) ? resolvedPath : false;
};

module.exports = {
  isValidPathname,
  exists,
  isSymbolicLink,
  isFile,
  isDirectory,
  normalizeAndResolvePath,
  writeFile,
  hasYamlExtension,
  createDirectory,
  browseDirectory
};
