import { css } from "@emotion/css";
import styled from '@emotion/styled';
import { useRef, useState } from "react";
import "./App.css";
import { ComboBox } from "./components/controller/ComboBox";
import { Dropdown } from "./components/controller/Dropdown";
import { Selection } from "./components/controller/Selection";
import { Template } from "./components/core/Template";
import { Input } from "./components/form/Input";
import { List } from "./components/layout/List";
import { Page } from "./components/models/Page";
import { comments } from "./data/comments";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import { usePagination } from "./hooks/usePagination";
import { useSearch } from "./hooks/useSearch";
import { useSelection } from "./hooks/useSelection";
import { callAll, classNames, mergeEvent } from "./util";

// async function fetchPlanets(pageIndex, query) {
// 	let url = `https://swapi.dev/api/planets?page=${pageIndex}&search=${query}`;
// 	return await fetchData(url);
// }

// async function fetchComments({pageIndex, pageSize, query}) {
// 	let criteria = (value) => String(value).toLowerCase().includes(query.toLowerCase());
// 	let searchOf = compositeGetter("email", "name");
// 	let options = comments.slice(0, 100);
// 	let results = options.filter(op => searchOf(op).some(value => criteria(value, query)));
// 	return new Promise((res) => setTimeout(() => res(results), 500));
// }

function Multiselect({options, onChange, ...props}) {
	let [selectedItems, setSelectedItems] = useState([]);

	let selection = useSelection({trackBy: "id", onSelectedItemsChange: mergeEvent(setSelectedItems, onChange)});
	let { paginate, setIndex } = usePagination(10, 0);

	let search = useSearch({
		options,
		searchBy: ["email", "name"],
		transform: paginate,
		onQueryChange: () => setIndex(0)
	});

	let { targetRef } = useIntersectionObserver(() => search.results.accumulateNext(), [search]);

	let inputRef = useRef();
	let blur = () => inputRef.current.blur();

	return (
		<Selection selection={selection} items={search.results instanceof Page ? search.results.results : search.results}>
			<ComboBox search={search} selection={selection} labelBy="email" trackBy="id">
				<Dropdown>
					{({ shown, open, close }) =>
						<div className={classNames({'combo-box--open': shown})} $combo-box $dropdown>
							<Input $combo-box__search $dropdown__opener="onFocus" onKeyDown={(e) => e.key === "Escape" && callAll(close, blur)()} placeholder="Search here..." ref={inputRef}>
								<SelectedItemList $append items={selectedItems} trackBy="id" labelBy="email">
									<li $item className={selectedItemStyle}>{({label, item}) => <>
										<span className={selectedItemLabelStyle}>{label}</span>
										<RemoveButton className="remove-item" onClick={() => selection.deselect(item)}>Remove</RemoveButton>
									</>}</li>
								</SelectedItemList>
							</Input>
							<ResultList $combo-box__results $dropdown__content>
								<li $item={(item) => selection.isSelected(item)} className="selected"/>
								<li $item className={hoverItemStyle}>
									{({label, item}) => <>
										<span $selectable={item}>{label}</span>
										<br/>
										<small $selectable={item}>{item.name}</small>
									</>}
								</li>
								<li $item={(_, index, results) => index === results.length - 1} className="last-item" ref={targetRef}/>
								<li $empty>No result</li>
							</ResultList>
						</div>
					}
				</Dropdown>
			</ComboBox>
		</Selection>
  );
}


export default function App() {
	let options = comments.slice(0, 100);
	let items = ["Item 1", "Item 2", "Item 3"];

	let selection = useSelection();

	return (
		<div className="App">
			learn react
			{/* <Multiselect options={options}/> */}

			<Selection selection={selection} items={items}>
				<ul>
					{items.map(item => <li $selectable={item} className={classNames({selected: selection.isSelected(item)})} key={item}>{item}</li>)}
				</ul>
			</Selection>

		</div>
	);
}

let hoverItemStyle = css`
	&:hover {
		background: #eee;
	}
`;

let ResultList = styled(List)`
	user-select: none;
`;

let SelectedItemList = styled(List)`
	padding-top: ${({items}) => items.length > 0 ? '5px' : 0};
`;

let RemoveButton = styled.small`
	cursor: pointer;
	background: red;
	color: white;
	padding: 5px;
	border-radius: 5px;
	margin-left: 10px;
`;

let selectedItemStyle = css`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 0;
	padding-right: 0;
	border: none;
	background: green;
	border-radius: 5px;
	padding: 5px;
	font-size: .75em;
	color: white;
	margin-top: 5px;

	&:not(:last-of-type) {
		margin-right: 5px;
	}
`;

let selectedItemLabelStyle = css`
  overflow: hidden;
  text-overflow: ellipsis;
	white-space: nowrap;
`;

// let cardStyle = css`
// 	width: 336px;
// 	margin: auto;
// `;
