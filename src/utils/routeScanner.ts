import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const extractModuleName = (controllerDir: string) => {
  const normalizedPath = controllerDir.replace(/\\/g, '/');
  const match = normalizedPath.match(/modules\/([^/]+)\/controller/);
  return match?.[1] || '';
};

const generateRoutePrefix = (filePath: string, moduleName: string) => {
  let prefix = filePath
    .replace(/\.[^/.]+$/, '')
    .replace(/\\/g, '/')
    .replace('/index', '')
    .replace(/^[/]*/, '')
    .replace(/[/]*$/, '');

  if (moduleName) {
    prefix = prefix ? `/${moduleName}/${prefix}` : `/${moduleName}`;
  } else if (prefix) {
    prefix = `/${prefix}`;
  }

  return prefix || '/';
};

const normalizeRouteModule = (routeModule: any): AppRouter.RouteModule | null => {
  if (!routeModule) {
    return null;
  }

  const normalized = routeModule.default || routeModule;
  if (typeof normalized?.controller !== 'function' || !normalized?.method) {
    return null;
  }

  return normalized;
};

export const scanDirModules = (pattern: string): AppRouter.ScanRouteResult => {
  const matchedDirs = glob.sync(pattern.replace(/\\/g, '/'));
  const modules: AppRouter.ScanRouteResult = {};

  matchedDirs.forEach((controllerDir) => {
    if (!fs.existsSync(controllerDir)) {
      return;
    }

    const moduleName = extractModuleName(controllerDir);
    let fileNames = fs.readdirSync(controllerDir);

    while (fileNames.length) {
      const relativeFilePath = fileNames.shift();
      if (!relativeFilePath) {
        continue;
      }

      const absFilePath = path.join(controllerDir, relativeFilePath);
      if (fs.statSync(absFilePath).isDirectory()) {
        const subFiles = fs.readdirSync(absFilePath).map((name) => path.join(relativeFilePath, name));
        fileNames = fileNames.concat(subFiles);
        continue;
      }

      if (!/\.(js|ts|mjs)$/.test(absFilePath)) {
        continue;
      }

      const prefix = generateRoutePrefix(relativeFilePath, moduleName);
      const routeModule = normalizeRouteModule(require(absFilePath));
      if (routeModule) {
        modules[prefix] = routeModule;
      }
    }
  });

  return modules;
};
