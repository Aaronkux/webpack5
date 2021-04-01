const { pathToRegexp } = require('path-to-regexp');
import { LayoutConfig } from '@/utils/config';
import { Pathname } from 'history';
import { IBestAFSRoute } from '@umijs/plugin-layout';
import { UserType } from '@/services/user';

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

function validNavRoute(route: IBestAFSRoute, user: UserType) {
  if (
    !route.hideInMenu &&
    (!route.access || user.access.includes(route.access))
  ) {
    return true;
  }
  return false;
}

// convert route config to navbar needed routelist
export function route2List(
  routeList: IBestAFSRoute[],
  user: UserType,
): IBestAFSRoute[] {
  let res = [];
  for (let route of routeList) {
    if (validNavRoute(route, user)) {
      const { name, path, icon } = route;
      let childRoutes: IBestAFSRoute[] = [];
      if (route.routes) {
        for (let childRoute of route.routes) {
          if (validNavRoute(childRoute, user)) {
            const { name, path, icon } = childRoute;
            childRoutes.push({ name, path, icon });
          }
        }
      }
      if (childRoutes.length > 0) {
        res.push({ name, path, icon, routes: childRoutes });
      } else {
        res.push({ name, path, icon });
      }
    }
  }
  return res;
}
