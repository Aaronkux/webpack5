import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'umi';
import { search2Param, param2Search, ParamsObjType } from '@/utils';

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
