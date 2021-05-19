import { useState, useEffect } from 'react';
import { useHistory } from 'umi';

export default function useURLParams(): [
  ParamsObjType,
  React.Dispatch<React.SetStateAction<ParamsObjType>>,
] {
  const [urlState, setURLState] = useState(search2Param);
  const history = useHistory();
  useEffect(() => {
    history.replace(param2Search(urlState));
  }, [urlState]);
  const setURL = (obj: ParamsObjType) => {
    const temp = { ...urlState };
    for (let [i, v] of Object.entries(obj)) {
      if (temp[i] && (v === null || v === undefined)) {
        delete temp[i];
      } else if (v !== null && v !== undefined) {
        temp[i] = v;
      }
    }
    setURLState(temp);
  };
  return [urlState, setURL];
}


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