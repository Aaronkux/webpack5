const { pathToRegexp } = require('path-to-regexp');
import { LayoutConfig } from '@/utils/config';
import { Pathname } from 'history';
import { IBestAFSRoute } from '@umijs/plugin-layout';
import { UserType } from '@/services/users';
import { IRoute } from '@umijs/core/lib/Route/types';

// query layout
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
/***
 * valid route rule
 * @route route config
 * @user user info
 */
function validNavRoute(route: IBestAFSRoute, user: UserType) {
  if (
    !route.hideInMenu &&
    (!route.access || user.access.includes(route.access)) &&
    route.path
  ) {
    return true;
  }
  return false;
}

// convert route config to navbar needed routelist
export function route2List(
  routeList: IBestAFSRoute[] | IRoute[],
  user: UserType,
): [Map<string, IBestAFSRoute>, Map<string, IBestAFSRoute>] {
  let res = new Map<string, IBestAFSRoute>();
  let list = new Map<string, IBestAFSRoute>();
  for (let route of routeList) {
    if (validNavRoute(route, user)) {
      const { name, path, icon, parentPath } = route;
      list.set(path as string, route);
      if (parentPath) {
        const item = res.get(parentPath);
        const parentName = item?.name;
        const parentIcon = item?.icon;
        const parentRoutes = item?.routes ?? [];
        res.set(parentPath, {
          name: parentName,
          path: parentPath,
          icon: parentIcon,
          routes: [...parentRoutes, { name, path, icon, parentPath }],
        });
      } else {
        res.set(path as string, { name, path, icon, parentPath });
      }
    }
    if (res.size == 0 && route.routes) {
      return route2List(route.routes, user);
    }
  }
  return [res, list];
}

/***
 * valid route rule
 * @route route config
 * @user user info
 */
function validBreadRoute(route: IBestAFSRoute, user: UserType) {
  if (
    (!route.access || user.access.includes(route.access)) &&
    route.component &&
    route.path
  ) {
    return true;
  }
  return false;
}

interface BreadcrumbType {
  [index: string]: string;
}

export function route2Bread(
  routeList: IBestAFSRoute[] | IRoute[],
  user: UserType,
): BreadcrumbType {
  let res: BreadcrumbType = {};
  for (let route of routeList) {
    if (validBreadRoute(route, user)) {
      const { name, path } = route;
      if (path) res[path] = name;
      if (route.routes) {
        res = Object.assign(res, route2Bread(route.routes, user));
      }
    }
    if (route.routes) {
      return Object.assign(res, route2Bread(route.routes, user));
    }
  }
  return res;
}

export const interopRequireDefault = (obj: any) => {
  return obj && obj.__esModule ? obj : { default: obj };
};

export interface ParamsObjType {
  [key: string]: any;
}

export const search2Param = (): ParamsObjType => {
  const search = window.location.search;
  if (!search) return {};
  if (search.charAt(0) !== '?') return {};

  const paramsArr = search.substring(1).split('&');
  let res: any = {};
  for (let param of paramsArr) {
    const temp = param.split('=');
    if (temp.length === 1 || temp[1].length === 0) {
      res[temp[0]] = undefined;
    }
    res[temp[0]] = temp[1];
  }
  return res;
};

export const param2Search = (params: ParamsObjType): string => {
  let res = '';
  let addSymbol = false;
  let hasValue = false;
  for (let [key, value] of Object.entries(params)) {
    if (key && !hasValue) {
      hasValue = true;
      res += '?';
    }
    // whether add & symbol
    if (!addSymbol && res !== '?') {
      addSymbol = true;
    }
    if (addSymbol) {
      res += '&';
    }
    if (value === undefined) {
      res += key;
      continue;
    }

    if (value === '') {
      res += `${key}=`;
      continue;
    }
    res += `${key}=${value}`;
  }
  return window.location.pathname + res;
};

export function isBlob(file: any) {
  return file instanceof Blob;
}

export function createFormData(data: {
  [props: string]: string | boolean | number | File | undefined;
}) {
  let formdata = new FormData();
  for (let [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'number' || typeof value === 'boolean') {
      formdata.append(key, value.toString());
      continue;
    }
    formdata.append(key, value);
  }
  return formdata;
}

export function imageFileProcesser(file: any) {
  if (isBlob(file)) {
    return file;
  } else if (file?.status === 'removed') {
    return '';
  } else {
    return undefined;
  }
}
