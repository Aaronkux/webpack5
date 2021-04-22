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
  const setURL = useCallback((obj: ParamsObjType) => {
    setURLState({ ...urlState, ...obj });
  }, []);
  return [urlState, setURL];
}
