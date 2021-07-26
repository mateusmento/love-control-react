import React, { Children, createContext, useState } from "react";
import { callable } from "../../util";
import { List } from "../layout/List";
import { Input } from "./Input";

let ComboBoxContext = createContext();

ComboBox.Input = () => null;
ComboBox.List = () => null;
ComboBox.Items = ({onSelected: onSelected2 = () => {}, ...props}) =>
	<ComboBoxContext.Consumer>{
		({onSelected}) => <>
			<List.Items onSelected={e => {onSelected(e); onSelected2(e)}} {...props}/>
		</>
	}</ComboBoxContext.Consumer>

export function ComboBox({options, trackBy, labelBy, multiselect, selection, onSelectionChange, children}) {
	let [query, setQuery] = useState('');

	let list = Children.toArray(children).find(c => c.type === ComboBox.List) || {};
	let input = Children.toArray(children).find(c => c.type === ComboBox.Input) || {};

	let { children: listChildren, listProps } = list.props || {};
	let { value = query, onChange, ...inputProps } = input.props || {};
	let items = callable(options)(query);

	let onSelected = multiselect ? (e) => onSelectionChange([...selection, e]) : (e) => onSelectionChange(e);

	return (
		<ComboBoxContext.Provider value={{onSelected}}>
			<div className="combo-box">
				<Input value={value} onChange={e => { setQuery(e); onChange(e); }} {...inputProps}/>

				<List items={items} trackBy={trackBy} labelBy={labelBy} {...listProps}>
					{listChildren || <ComboBox.List.Items/>}
				</List>
			</div>
		</ComboBoxContext.Provider>
	);
}


export function ComboBoxDemo() {
	let [query, setQuery] = useState('');
	let [isOpen, setIsOpen] = useState(false);
	let [selection, setSelection] = useState([]);

	return (
		<ComboBox options={fetchProducts} trackBy={x => x} labelBy={x => x} selection={selection} onSelectionChange={setSelection} multiselect>
			<ComboBox.Input onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)} value={query} onChange={setQuery}>
				<Input.Prepend>Search here:</Input.Prepend>
				<Input.Append>{selection.join(', ')}</Input.Append>
			</ComboBox.Input>

			<ComboBox.List>
					<List.Await>Loading</List.Await>
					<ComboBox.Items/>
					<List.Empty>No content</List.Empty>
					<List.Catch>Error</List.Catch>
			</ComboBox.List>
		</ComboBox>
	);
}
