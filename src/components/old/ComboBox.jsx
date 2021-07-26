import { useCallback } from 'react';
import '../../ComboBox.css';
import { useArraySearch } from '../../hooks/useArraySearch';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { useSelection } from '../../hooks/useSelection';
import { classNames } from '../../util';
import { Dropdown, useDropdown } from './Dropdown';

export function ComboBox({items: itemPages}) {
	let { selection, select } = useSelection();
	let { items, query, setQuery } = useArraySearch(itemPages, (item, query) => item.email.includes(query));
	let { content, setIndex, next, accumulateNext } = usePaginatedList(items, 10);
	let { shown, open, closeOnOutsideClickRef, style } = useDropdown({show: false});

	let { targetRef } = useIntersectionObserver((observer, entry) => {
		let parent = entry.target.parentElement;

		if (parent === null)
			return console.log("Null parent: ") || console.dir(entry.target);

		if (parent.scrollHeight <= parent.offsetHeight) return;

		if (parent.scrollTop + parent.offsetHeight >= parent.scrollHeight)
			parent.scrollTop = parent.scrollTop - 1 - parent.lastElementChild?.offsetHeight || 0;

		accumulateNext();
		observer.disconnect();
	}, [next]);

	let onQueryChange = useCallback((e) => {
		setIndex(0);
		setQuery(e.target.value);
	}, [setIndex]);

	let itemClassNames = useCallback((item, lastItem) =>
		classNames(
			!lastItem ? "combo-box__item" : "combo-box__last-item",
			{ selected: selection.some(s => s === item.email) }
		)
	, [selection]);

	let lastItem = content[content.length - 1];

	return (
		<Dropdown className={classNames("combo-box", {"combo-box--open": shown})} css={style} ref={closeOnOutsideClickRef}>
			<input $dropdown_toggler value={query} onChange={onQueryChange} onFocus={open} className="combo-box__input"/>
			<ul $dropdown_content className="combo-box__list">
				{content.slice(0, content.length - 1).map((item, index) =>
					<li key={index} onClick={() => select(item)} className={itemClassNames(item, index === content.length - 1)}>{index+1}. ({item.id}) {item.email}</li>
				)}

				{lastItem &&
					<li onClick={() => select(lastItem)} className={itemClassNames(lastItem, true)} ref={targetRef}>{content.length}. ({lastItem.id}) {lastItem.email}</li>}
			</ul>
		</Dropdown>
  );
}
