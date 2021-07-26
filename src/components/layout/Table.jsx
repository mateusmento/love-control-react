import { Slot } from '../core/Slot';
import { get, useForceUpdate } from '../../util';
import { useCallback, useMemo } from 'react';
import { useState } from 'react';


export let Column = () => null;
export let Head = (props) => <th {...props}/>;
export let Cell = (props) => <td {...props}/>;
export let Rows = () => null;
export let RowDetails = () => null;

function mergeClassNames(a = '', b = '') {
	return [a || '', b || ''].join(' ');
}

let mergeProps = (a, b) => ({
	...a,
	props: {
		...a.props,
		...b.props,
		className: mergeClassNames(a.props.className, b.props.className)
	}
});

export function Table({items, children, ...props}) {
	let columnsCount = children.filter(c => c.type === Column).length;

	let { forceUpdate } = useForceUpdate();

	let metas = useMemo(() => items.map(() => ({})), [items]);
	let setMeta = useCallback((i) => (value) => (metas[i] = value) && forceUpdate(), [metas, forceUpdate]);

	return (
		<table {...props}>
			<Slot $required $name={Column} $condition={(t, p) => p.title} $content={children}>{ () =>
				<thead>
					<tr>
						<Slot $required $name={Column} $content={children} $multiple>{
							({title}, children) =>
								<Slot $name={Head} $as="th" $content={children} $data={{title}}>{title}</Slot>
						}</Slot>
					</tr>
				</thead>
			}</Slot>
			<Slot $required $name={Column} $content={children}>{ () =>
				<tbody>{
					items.map((item, i) =>
						<Slot key={i} $name={Rows} $content={children} $multiple $filterable={[item, i, metas[i]]} $merge={mergeProps}>{
							({onClick = () => {}, ...props}) => <>
								<tr {...props} onClick={e => onClick(e, {item, meta: metas[i], setMeta: setMeta(i)})}>
									<Slot $required $name={Column} $content={children} $multiple>{
										({field}, children) => {
											let value = get(item, field);
											return <Slot $name={Cell} $as="td" $content={children} $data={{value, item, index: i, meta: metas[i], setMeta: setMeta(i)}}>{value}</Slot>
										}
									}</Slot>
								</tr>

								<Slot $required $name={RowDetails} $content={children} $filterable={[item, i, metas[i]]}>{
									(props, children) => <tr {...props}><td colSpan={columnsCount}>{children}</td></tr>
								}</Slot>
							</>
						}</Slot>
					)
				}</tbody>
			}</Slot>
		</table>
	);
}

let Table = ({items, trackBy, children}) =>
	<table>
		<thead>
			<tr>
				<Slot $selector={Column} $multiple $content={children}>
					{({title}, children) =>  (
						<Slot $selector={Head} $content={children}>
							{(props, children, ref) => (
								<th {...props} ref={ref}>{children || title}</th>
							)}
						</Slot>
					)}
				</Slot>
			</tr>
		</thead>
		<tbody>
			{items.map(item => (
				<tr key={item[trackBy]}>
					<Slot $selector={Column} $multiple $content={children}>
						{({field}, children) =>  (
							<Slot $selector={Cell} $content={children}>
								{(props, children, ref) =>  (
									<td {...props} ref={ref}>
										{children instanceof Function
											? children(item[field])
											: children || item[field]}
									</td>
								)}
							</Slot>
						)}
					</Slot>
				</tr>
			))}
		</tbody>
	</table>


function Table() {

	<table>
		<thead>
			<tr>
				<th>Nome</th>
				<th>Preço</th>
				<th>Quantidade</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			{products.map(product => (
				<tr>
					<td>{product.name}</td>
					<td>{product.price}</td>
					<td>{product.quantity}</td>
					<td>{product.description}</td>
				</tr>
			))}
		</tbody>
	</table>


	return (
		<Table items={products}>
			<Column title="Nome" field="name"/>
			<Column field="price">
				<Head className="price-head">Preço</Head>
				<Cell>{(value) => `R$ ${value}`}</Cell>
			</Column>
			<Column title="Quantidade" field="quantity">
		<Cell>
			{(value) => value === 1
				? `${value} unidades`
				: `${value} unidade`}
		</Cell>
			</Column>
			<Column title="Descrição" field="description"/>
		</Table>
	);
}


function DropdownMenuButton({label, children}) {
	let [shown, setShown] = useState(false);
	let toggle = () => setShown(!shown);

	return (
		<div class="dropdown-menu-button">
			<Slot
				$selector="button"
				$as="button"
				$content={children}
				onClick={toggle}
			>
				{label || "Opções"}
			</Slot>

			{shown &&
				<Slot $selector="menu" $as="ul" $content={children}>
					<li>Nenhuma opção disponível</li>
				</Slot>
			}
		</div>
	);
}

<DropdownMenuButton>
	<button $button>Opções</button>
	<ul $menu>
		<li>Perfil</li>
		<li>Medias</li>
		<li>Configurações</li>
		<li>Sair</li>
	</ul>
</DropdownMenuButton>
