import { render, screen } from '@testing-library/react';
import { mergePropElements } from '../../util';
import { Slot } from './Slot';
import { Template } from './Template';
import { Selection } from '../controller/Selection';
import userEvent from '@testing-library/user-event';


function Card({children}) {
	return (
		<div>
			<Slot $name="header" $content={children}/>
			<Slot $name="content" $content={children}/>
		</div>
	);
}

test('renders named slots', () => {
	render(
		<Card>
			<header $header>Welcome!!</header>
			<main $content>Hello world!</main>
		</Card>
	);

	let header = screen.queryByText("Welcome!!");
	expect(header).toBeInTheDocument();

	let main = screen.queryByText("Hello world!");
	expect(main).toBeInTheDocument();
});


function List({children}) {
	return (
		<ul>
			<Slot $name="listitem" $multiple $content={children} className="list-item"/>
		</ul>
	);
}

test('renders multiple instance of a named slot', () => {
	render(
		<List>
			<li $listitem>Hello World</li>
			<li $listitem>Olá Mundo</li>
			<li $listitem>Bonjour le monde</li>
		</List>
	);

	let items = screen.queryAllByRole("listitem");
	expect(items).toHaveLength(3);

	for (let item of items)
		expect(item).toHaveClass("list-item");

});

function Login({children}) {
	return (
		<form>
			<Slot $name="email-label" $as="label" $content={children} htmlFor="Email">Email</Slot>
			<Slot $name="email-input" $as="input" $content={children} type="email" id="Email"/>

			<Slot $name="password-label" $as="label" $content={children}>
				Password
				<Slot $name="password-input" $as="input" $content={children} type="password"/>
			</Slot>

			<Slot $name="submit" $as="button" $content={children} type="submit">Login</Slot>
		</form>
	);
}

test('renders slots with default props and children and specified props and children', () => {

	render(
		<Login>
			<label $email-label>Your email account:</label>
			<input $email-input className="form-control" placeholder="Email..."/>
			<input $password-input className="form-control"/>
			<button $submit className="submit-button"/>
		</Login>
	);

});


function Tree({items, trackBy = x => x.id, labelBy = x => x.label, childrenBy = x => x.children, children}) {
	return (
		<ul>
			{items.map(item =>
				<li key={trackBy(item)}>
					{labelBy(item)}
					{childrenBy(item) &&  <Tree items={childrenBy(item)}/>}
				</li>
			)}
		</ul>
	);
}


test("render nested lists", () => {
	let items = [
		{ id: 1, label: 'Your account' },
		{
			id: 2,
			label: 'Quick configuration',
			children: [
				{ id: 1, label: 'Change password' },
				{ id: 2, label: 'Privacy' },
			],
		},
	];

	render(<Tree items={items}/>);
});


function DataList({items = [], trackBy = x => x, labelBy = x => x, children}) {
	return (
		<ul>
			{items.map(item =>
				<Slot key={trackBy(item)} $name="list-item" $as="li" $multiple $content={children} $merge={mergePropElements} $data={{item}} className="list-item">
				</Slot>
			)}
		</ul>
	);
}

test("render Template", () => {

	let onSelectedItemsChange = jest.fn();
	let items = [1, 2, 3];

	render(
		<Selection onSelectedItemsChange={onSelectedItemsChange} items={items}>
			<DataList items={items}>
				{/* <li $list-item $$selectable={scoped(({item}) => item)}/> */}

				<Template $list-item className="selectable">{({item}, props) =>
					<li tabIndex={item} $selectable={item} {...props}>{item}</li>
				}</Template>
			</DataList>
		</Selection>
	);

	screen.debug();

	userEvent.click(screen.getByText("1"));
	expect(onSelectedItemsChange).toHaveBeenLastCalledWith([1]);

	userEvent.click(screen.getByText("3"), {shiftKey: true});
	expect(onSelectedItemsChange).toHaveBeenLastCalledWith([1, 2, 3]);

	userEvent.click(screen.getByText("2"), {ctrlKey: true});
	expect(onSelectedItemsChange).toHaveBeenLastCalledWith([1, 3]);
});


test("", () => {
	let Component = ({children}) =>
		<Slot $content={children}/>

	render(
		<Component>
			<input/>
			<hr/>
			<button>Ok</button>
		</Component>
	);

	screen.debug();
});

test("", () => {
	let Component = ({children}) =>
		<Slot $content={children}>Hello world</Slot>

	render(
		<Component></Component>
	);

	screen.debug();
});


let c = () => [
	// default slot

	<Slot $content={children}/>, // place children entirely
	<Slot $content={children}>
		Hello world
	</Slot>, // place children entirely, in case no fill found then place "Hello world"
	<Slot $content={children}>{
		(props, children, {type, ref, count}) =>
			<li {...props} ref={ref}>{children}</li>
	}</Slot>, // always place the computed li for every child in children, if no fill found then place li with no custom props, children and ref


	<Slot $as="li" $content={children}/>, // place children entirely, if no fill found then place a li with no content
	<Slot $as="li" $content={children}>
		Hello world
	</Slot>, // place children entirely, in case no fill found then place a li with content "Hello world"
	<Slot $as="li" $content={children}>{
		(props, children, {type, ref, count}) =>
			<li {...props} ref={ref}>{children}</li>
	}</Slot>, // always place the computed li for every child in children, no fill found then place li with no custom props, children and ref



	<Slot $name="name" $content={children}/>,
	<Slot $name="name" $content={children}>
		Hello world
	</Slot>,
	<Slot $name="name" $content={children}>{
		(props, children, {type, ref, count}) =>
			<li {...props} ref={ref}>{children}</li>
	}</Slot>,



	<Slot $name="name" $as="li" $content={children}/>,
	<Slot $name="name" $as="li" $content={children}>
		Hello world
	</Slot>,
	<Slot $name="name" $as="li" $content={children}>{
		(props, children, {type, ref, count}) =>
			<li {...props} ref={ref}>{children}</li>
	}</Slot>,
]
