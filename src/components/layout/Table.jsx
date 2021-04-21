import { Slot } from '../core/Slot';
import { get, useForceUpdate } from '../../util';
import { useCallback, useMemo } from 'react';


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
