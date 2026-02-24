import { useCallback, useState } from "react";

export const useRefreshSignal = (initialValue = 0) => {
  const [signal, setSignal] = useState(initialValue);

  const triggerRefresh = useCallback(() => {
    setSignal((prev) => prev + 1);
  }, []);

  const resetRefresh = useCallback(() => {
    setSignal(initialValue);
  }, [initialValue]);

  return { signal, triggerRefresh, resetRefresh };
};
