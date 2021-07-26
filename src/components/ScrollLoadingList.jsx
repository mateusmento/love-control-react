import { useCallback, useEffect, useState } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver.js";
import { callable } from "../util.js";

export function ScrollLoading({next, children}) {
  let [{pages}, setPagination] = useState({ lastPageIndex: 0, pages: [] });

  let setNextPage = useCallback(() => {
    setPagination(({pages, lastPageIndex}) => ({
      lastPageIndex: lastPageIndex + 1,
      pages: [...pages, next(lastPageIndex + 1)],
    }));
  }, [setPagination]);

  let { listRef, lastItemRef } = useIntersectionObserver(() => setNextPage(), [setNextPage]);

  useEffect(() => {
    setNextPage();
  }, [setPagination]);

  return callable(children)({listRef, lastItemRef, pages})
}
