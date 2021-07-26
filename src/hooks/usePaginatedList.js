import { useCallback, useMemo, useState } from "react";
import { callable, usePreviousMemo } from "../util";

export function usePaginatedList(items, pageSize, initialIndex = 0) {
	let pageCount = Math.ceil(items.length / pageSize);

	let [{index, accumulate}, setPagination] = useState({index: initialIndex, accumulate: false});

	let content = usePreviousMemo([], (page) => {
		let nextPage = items.slice(index * pageSize, index * pageSize + pageSize);
		return accumulate ? [...page, ...nextPage] : nextPage;
	}, [items, index, pageSize, accumulate]);

	let setIndex = useCallback((value) => setPagination((p) => {
		value = callable(value)(p.index);
		return value === p.index ? p : {index: value, accumulate: false};
	}), []);

	let next = useCallback((accumulate) => {
		setPagination((p) => p.index < pageCount - 1 ? {index: p.index + 1, accumulate} : p)
	}, [pageCount]);

	return useMemo(() => ({
		content,
		index,
		pageCount,
		hasNext: index < pageCount - 1,
		hasPrevious: index > 0,
		next: () => next(false),
		previous: () => setPagination((p) => p.index > 0 ? {index: p.index - 1, accumulate} : p),
		setIndex,
		accumulateNext: () => next(true),
	}), [
		content,
		index,
		pageCount,
		next,
		accumulate,
		setIndex,
	]);
}
