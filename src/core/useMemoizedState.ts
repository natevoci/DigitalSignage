import { useState } from 'react';

const useMemoizedState = <T>(initialValue: T): [T, (val: T) => void] => {
  const [state, _setState] = useState<T>(initialValue);

  const setState = (newState: T) => {
    _setState((prev) => {
      if (JSON.stringify(newState) !== JSON.stringify(prev)) {
        return newState;
      } else {
        return prev;
      }
    });
  };

  return [state, setState];
};

export default useMemoizedState;