import { css } from "@emotion/css";
import { Children, Fragment } from "react";
import { childrenProcessing } from "../../functions/childrenProcessing";
import { useSelection } from "../../hooks/useSelection";
import { useSearch } from "../../hooks/useSearch";
import { callable, classNames } from "../../util";
import { Template } from "../core/Template";
import { stateful } from "../../functions/stateful";
import { Page } from "../models/Page";

export function useComboBox({options, searchBy, trackBy, selectedItems, onSelectedItemsChange, onSelect, onDeselect, query, onQueryChange}) {
	let search = useSearch({ options, searchBy, query, onQueryChange });
	let selection = useSelection({trackBy, selectedItems, onSelectedItemsChange, onSelect, onDeselect});
	return { search, selection };
}

export let ComboBox = stateful(useComboBox, "ComboBox", ({ trackBy, labelBy, search, selection, noDeselect, children }) => {
	let { results, query, setQuery } = search;

	results = results instanceof Page ? results.results : results;

  let process = childrenProcessing({
		"combo-box": {
			className: classNames("combo-box", comboBoxStyle),
		},
		"combo-box__search": {
      value: query,
      onChange: (e) => setQuery(typeof e === 'string' ? e : e.target.value),
			className: classNames("combo-box__search", searchStyle),
    },
    "combo-box__results": {
      items: results,
			labelBy,
			trackBy,
			className: classNames("combo-box__results", resultsStyle),
			// onSelect: (item, i, e) => {
			// 	if (e.shiftKey) {
			// 		selection.rangeSelect(item, results);
			// 	} else if (e.altKey) {
			// 		if (!noDeselect) selection.rangeDeselect(item, results);
			// 	} else if (e.ctrlKey) {
			// 		if (noDeselect) selection.select(item);
			// 		else selection.toggle(item);
			// 	} else {
			// 		selection.clear();
			// 		selection.singleSelect(item);
			// 	}
			// },
			children: (children) => (
				<Template>
					<li $item={(_, index, results) => index !== results.length - 1} className="combo-box__result"/>
					<li $item={(_, index, results) => index === results.length - 1} className="combo-box__last-result"/>
					{/* <li $item={(item) => selection.isSelected(item)} className="selected"/> */}
					{children}
				</Template>
			),
    },
  });

	let callChild = child => callable(child)(search, process);

	if (children instanceof Array) children = Children.map(children, callChild);
	else children = callChild(children);

	children = process(children);

  return <Fragment>{children}</Fragment>;
});

let comboBoxStyle = css`
	width: 400px;
	margin: 20px auto;
	border-radius: 10px;
	background: white;

	&.combo-box--open .combo-box__search {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	&.combo-box--open .combo-box__results {
		max-height: 336px;
	}
`;

let searchStyle = css`
	display: block;
	width: 100%;
	box-sizing: border-box;
	padding: 10px 15px;
	border: 1px solid grey;
	border-radius: inherit;
	background: inherit;
	font-size: 1em;
	transition: box-shadow 200ms;
	z-index: 10;

	&:focus {
		outline: none;
		background-color: #eee;
		box-shadow: 0 0 0 2pt rgba(0, 0, 0, 0.25);
	}
`;

let resultsStyle = css`
	display: block;
	box-sizing: border-box;
	width: 100%;
	// height: 0;
	transition: height 200ms;
	padding: 0;
	margin: 0;
	border: 1px solid grey;
	border-top: none;
	/* border-radius: inherit; */
	border-bottom-left-radius: inherit;
	border-bottom-right-radius: inherit;
	overflow-y: auto;
	/* top: calc(100% + 10px); */
	background: inherit;

	.combo-box__result, .combo-box__last-result {
		display: block;
		box-sizing: border-box;
		padding: 10px 15px;
		cursor: pointer;
		border-bottom: 1px solid grey;
	}

	.combo-box__last-result {
		border-bottom: none;
	}

	.combo-box__result.selected, .combo-box__last-result.selected {
		background: #ddd;
	}

	.combo-box__end-anchor {
		display: block;
		padding: 0;
		height: 0;
	}

	&::-webkit-scrollbar {
		width: 15px;
		border-left: 1px solid grey;
		background-color: #ddd;
		border-bottom-right-radius: inherit;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(0,0,0,0.35);
		border: 4px solid transparent;
		background-clip: padding-box;
		border-radius: 10px;
	}
`;
