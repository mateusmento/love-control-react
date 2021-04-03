import { createContext, Fragment, useCallback, useContext } from "react";
import { callable, getters, forwardRef } from "../../util";
import { Async, Await, Catch, Then } from "./Async";
import { Component } from "../Component";

let ListContext = createContext();
let ItemsContext = createContext();

export let List = function List({items, trackBy, labelBy, groupBy, flat, as, onSelected, children, ...props}, ref) {
	let itemsContext = useContext(ItemsContext);

	if (itemsContext) {
		items = items || itemsContext.items;
		trackBy = trackBy || itemsContext.trackBy;
		labelBy = labelBy || itemsContext.labelBy;
	}

	return (
		<Component as={flat ? Fragment : (as || 'ul')} {...props} ref={ref}>
			<ListContext.Provider value={{trackBy, labelBy, groupBy, onSelected}}>{
				<Async value={items}>
					{children}
				</Async>
			}</ListContext.Provider>
		</Component>
	);
}

List = forwardRef(List);

export let Items = function Items({filter, flat, as, children, onClick = () => {}, onSelected = () => {}, ...props}, ref) {
	let { trackBy, labelBy, groupBy } = useContext(ListContext);
	let [ trackOf, labelOf ] = getters(trackBy, labelBy);

	// TODO: group by function
	// _.groupBy(items, item => groupOf(item))

	let onItemClick = (item, i, e) => {
		onSelected(item, i);
		onClick(e);
	};

	let filtered = useCallback((items) => filter && Array.isArray(items) ? items.filter(filter) : items, [filter]);

	return (
		<Then>{(items) =>
			<ItemsContext.Provider value={{items: filtered(items), trackBy, labelBy, groupBy}}>{
				children
					?	<Component as={flat ? Fragment : (as || 'li')} {...props} ref={ref}> {children} </Component>
					: items.map((item, i) =>
						<Component as={flat ? Fragment : (as || 'li')} {...props} onClick={e => onItemClick(item, i, e)} key={trackOf(item)} ref={ref}>
							{labelOf(item)}
						</Component>
					)
			}</ItemsContext.Provider>
		}</Then>
	);
}

Items = forwardRef(Items);

export let Empty = ({as, children}, ref) => {
	return (
		<Then>{ items =>
			items.length === 0
				? <Component as={as || 'li'} ref={ref}>{children}</Component>
				: null
		}</Then>
	);
}

Empty = forwardRef(Empty);

List.Items = Items
List.Empty = Empty;

List.Await = ({as, ...props}, ref) =>
	<Await>
		<Component as={as || 'li'} {...props} ref={ref}/>
	</Await>

List.Await = forwardRef(List.Await);


List.Catch = ({as, children, ...props}, ref) =>
	<Catch>{err =>
		<Component as={as || 'li'} {...props} ref={ref}>
			{callable(children)(err)}
		</Component>
	}</Catch>

List.Catch = forwardRef(List.Catch);
