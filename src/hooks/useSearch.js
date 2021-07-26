import { useMemo, useState } from "react";
import { callAll, compositeGetter, getter } from "../util";

export function useSearch({options = [], searchBy, criteria, transform, onQueryChange}) {
	let [query, setQuery] = useState('');

	let search = useMemo(() => {

		let setQueryAndNotify = callAll(setQuery, onQueryChange);

		let searchOf = searchBy instanceof Array
			? compositeGetter(...searchBy)
			: getter(searchBy || (x => x));

		let defaultCriteria = (value, query) => String(value).toLowerCase().includes(query.toLowerCase());
		let isValid = criteria || defaultCriteria;

		let filter = (options) => {
			if (query === '' && isValid === defaultCriteria) return options;
			if (searchOf instanceof Array)
				return options.filter(op => searchOf(op).some(value => isValid(value, query)));
			return options.filter(option => isValid(searchOf(option), query));
		}

		let search = (options) => {
			let results = typeof options === 'function' ? options(query, filter) : filter(options);
			if (transform instanceof Function) results = transform(results);
			return results;
		}

		let results = search(options);

		return { results, filter: search, query, setQuery: setQueryAndNotify };
	}, [onQueryChange, searchBy, options, query, criteria, transform]);

	return search;
}
