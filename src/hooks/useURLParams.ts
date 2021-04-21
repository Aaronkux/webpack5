import { useState, useEffect } from 'react';
import { useHistory } from 'umi';
import { search2Param, param2Search, ParamsObjType } from '@/utils';

export default function useURLParams(): [
  ParamsObjType,
  React.Dispatch<React.SetStateAction<ParamsObjType>>,
] {
  const [pageState, setPageState] = useState(search2Param);
  const history = useHistory();
  useEffect(() => {
    history.replace(param2Search(pageState));
  }, [pageState]);
  return [pageState, setPageState];
}
