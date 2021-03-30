const { pathToRegexp } = require('path-to-regexp');
import { LayoutConfig } from '@/utils/config';
import { Pathname } from 'history';

export function queryLayout(layouts: LayoutConfig[], pathname: Pathname) {
  let result: 'public' | 'primary' = 'public';

  const isMatch = (regepx: RegExp | string) => {
    return regepx instanceof RegExp
      ? regepx.test(pathname)
      : pathToRegexp(regepx).exec(pathname);
  };

  for (const item of layouts) {
    let include = false;
    let exclude = false;
    if (item.include) {
      for (const regepx of item.include) {
        if (isMatch(regepx)) {
          include = true;
          break;
        }
      }
    }

    if (include && item.exclude) {
      for (const regepx of item.exclude) {
        if (isMatch(regepx)) {
          exclude = true;
          break;
        }
      }
    }

    if (include && !exclude) {
      result = item.name;
      break;
    }
  }

  return result;
}
