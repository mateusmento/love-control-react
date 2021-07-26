import { createContext, createElement, useContext } from "react";
import { childrenProcessing } from "../../functions/childrenProcessing";
import { stateful } from "../../functions/stateful";
import { useSelection } from "../../hooks/useSelection";
import { callable } from "../../util";

export function useSelectables({mode, ...selectionProps}) {
	let selection = useSelection(selectionProps);
	return { selection };
}

let SelectionContext = createContext();

export let Selection = ({items, selection, noDeselect, children}) => {
	let process = childrenProcessing({
		"selectable": (value) => ({
			onClick: (e) => {
				if (e.shiftKey) {
					selection.rangeSelect(value, items);
				} else if (e.altKey) {
					if (!noDeselect) selection.rangeDeselect(value, items);
				} else if (e.ctrlKey) {
					if (noDeselect) selection.select(value);
					else selection.toggle(value);
				} else {
					selection.clear();
					selection.singleSelect(value);
				}
			},
		}),
	});

	return (
		<SelectionContext.Provider value={{noDeselect, items, selection}}>
			{process(callable(children)(process))}
		</SelectionContext.Provider>
	);
}

Selection = stateful(useSelectables, Selection);

export let Selectable = ({as = "div", item, children}) => {
	let { noDeselect, items, selection } = useContext(SelectionContext);

	let onClick = (e) => {
		if (e.shiftKey) {
			selection.rangeSelect(item, items);
		} else if (e.altKey) {
			if (!noDeselect) selection.rangeDeselect(item, items);
		} else if (e.ctrlKey) {
			if (noDeselect) selection.select(item);
			else selection.toggle(item);
		} else {
			selection.singleSelect(item);
		}
	}

	return createElement(as, {onClick, children});
}
