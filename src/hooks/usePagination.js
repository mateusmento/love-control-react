import { useCallback, useMemo, useState } from "react";
import { Page } from "../components/models/Page";

export function PageIndexRange(min, max) {
	this.min = min;
	this.max = max;
}

export function usePagination(...args) {
	let items, initialPageSize, initialIndex;

	if (args.length <= 2)
		[initialPageSize, initialIndex = 0] = args;
	else
		[items, initialPageSize, initialIndex = 0] = args;

	items = useMemo(() => items || [], [items]);

	let [index, setIndex] = useState(initialIndex);
	let [pageSize, setPageSize] = useState(initialPageSize);

	let paginate = useCallback((items) => {
		let pageCount = Math.ceil(items.length / pageSize);

		let hasNext = (index) => {
			let value = index instanceof PageIndexRange ? index.max : index;
			return value < pageCount - 1;
		};

		let hasPrevious = (index) => {
			let value = index instanceof PageIndexRange ? index.min : index;
			return value > 0;
		};

		let next = () => setIndex(index => {
			if (!hasNext(index)) return index;
			if (index instanceof PageIndexRange) return index.max + 1;
			return index + 1;
		});

		let previous = () => setIndex(index => {
			if (!hasPrevious(index)) return index;
			if (index instanceof PageIndexRange) return index.min - 1;
			return index - 1;
		});

		let accumulateNext = () => setIndex(index => {
			if (!hasNext(index)) return index;
			if (index instanceof PageIndexRange) return new PageIndexRange(index.min, index.max + 1);
			return new PageIndexRange(index, index + 1);
		});

		let accumulatePrevious = () => setIndex(index => {
			if (!hasPrevious(index)) return index;
			if (index instanceof PageIndexRange) return new PageIndexRange(index.min - 1, index.max);
			return new PageIndexRange(index - 1, index);
		});

		let results = index instanceof PageIndexRange
			? items.slice(index.min * pageSize, index.max * pageSize + pageSize)
			: items.slice(index * pageSize, index * pageSize + pageSize);

		return new Page({
			results,
			index,
			setIndex,
			hasNext: hasNext(index),
			next,
			accumulateNext,
			hasPrevious: hasPrevious(index),
			previous,
			accumulatePrevious,
			pageCount,
		});

	}, [index, pageSize]);

	let pagination = useMemo(() => ({
		page: paginate(items),
		paginate,
		index,
		setIndex,
		pageSize,
		setPageSize
	}), [paginate, items, index, pageSize]);

	return pagination;
}
