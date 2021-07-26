import { useMemo, useState } from 'react';

export function useArraySearch(items, condition, initialQuery = '') {
	let [query, setQuery] = useState(initialQuery);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	items = useMemo(() => items.filter((item) => condition(item, query)), [query, items]);
	return { items, query, setQuery };
}
