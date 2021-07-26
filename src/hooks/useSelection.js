import { differenceBy, partition, uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import { getter } from '../util';

export function useSelection({trackBy = (x => x), selectedItems: initialItems = [], onSelectedItemsChange, onSelect, onDeselect} = {}) {
	let [items, setItems] = useState(initialItems);
	let [lastSelectedItem, setLastSelectedItem] = useState();
	let [lastDeselectedItem, setLastDeselectedItem] = useState();

	let selection = useMemo(() => {
		let trackOf = getter(trackBy);

		let isSelected = (item) => items.some(s => trackOf(s) === trackOf(item));

		let clear = () => setItems([]);

		let select = (item) => {
			let selection = uniqBy([...items, item], trackBy);
			setItems(selection);
			setLastSelectedItem(item);
			if (onSelect) onSelect(item);
			if (onSelectedItemsChange) onSelectedItemsChange(selection);
			return selection;
		}

		let deselect = (item) => {
			let deselection = differenceBy(items, [item], trackBy);
			setItems(deselection);
			setLastDeselectedItem(item);
			if (onSelectedItemsChange) onSelectedItemsChange(deselection);
			if (onDeselect) onDeselect(item);
			return deselection;
		}

		let toggle = (item) => {
			if (!isSelected(item)) return select(item);
			else return deselect(item);
		}

		let singleSelect = (item) => {
			let selection = [item];
			setItems(selection);
			setLastSelectedItem(item);
			if (onSelect) onSelect(item);
			if (onSelectedItemsChange) onSelectedItemsChange(selection);
			return selection;
		}

		let singleToggle = (item) => {
			if (!isSelected(item)) return singleSelect(item);
			else return deselect(item);
		}

		let selectAll = (selectedItems) => {
			let selection = uniqBy([...items, ...selectedItems], trackBy);
			if (selection.length === items.length) return selectedItems;
			setItems(selection);
			if (onSelectedItemsChange) onSelectedItemsChange(selection);
			if (onSelect) selectedItems.forEach(item => onSelect(item));
			return selection;
		}

		let deselectAll = (deselectedItems) => {
			let deselection = differenceBy(items, deselectedItems, trackBy);
			if (deselection.length === items.length) return items;
			setItems(deselection);
			if (onSelectedItemsChange) onSelectedItemsChange(deselection);
			if (onDeselect) deselectedItems.forEach(item => onDeselect(item));
			return deselection;
		}

		let toggleAll = (toggledItems) => {
			let [selectedItems, deselectedItems] = partition(toggledItems, value => !isSelected(value));
			let deselection = differenceBy(items, deselectedItems, trackBy);
			let toggling = [...deselection, ...selectedItems];
			setItems(toggling);
			if (onSelectedItemsChange) onSelectedItemsChange(toggling);
			if (onSelect) selectedItems.forEach(item => onSelect(item));
			if (onDeselect) deselectedItems.forEach(item => onDeselect(item));
		}

		let findRange = (lastItem, item, itemsSource) => {
			let findIndex = item => itemsSource.findIndex(sourceItem => trackOf(sourceItem) === trackOf(item));
			let lastItemIndex = findIndex(lastItem);
			let itemIndex = findIndex(item);
			if (lastItemIndex > itemIndex)
				return [itemIndex, lastItemIndex + 1];
			return [lastItemIndex + 1, itemIndex + 1];
		}

		let rangeSelect = (item, itemsSource) => {
			let [lastItemIndex, itemIndex] = findRange(lastSelectedItem, item, itemsSource);
			setLastSelectedItem(item);
			return selectAll(itemsSource.slice(lastItemIndex, itemIndex));
		}

		let rangeDeselect = (item, itemsSource) => {
			let [lastItemIndex, itemIndex] = findRange(lastDeselectedItem, item, itemsSource);
			setLastDeselectedItem(item);
			return deselectAll(itemsSource.slice(lastItemIndex, itemIndex));
		}

		let rangeToggle = (item, itemsSource) => {
			let [lastItemIndex, itemIndex] = findRange(lastSelectedItem, item, itemsSource);
			setLastSelectedItem(item);
			return toggleAll(itemsSource.slice(lastItemIndex, itemIndex));
		}

		return {
			items: items,
			isSelected,
			clear,
			select,
			deselect,
			toggle,
			selectAll,
			deselectAll,
			toggleAll,
			rangeSelect,
			rangeDeselect,
			rangeToggle,
			singleSelect,
			singleToggle,
		};

	}, [items, trackBy, onSelectedItemsChange, onSelect, onDeselect, lastDeselectedItem, lastSelectedItem]);

	return selection;
}
