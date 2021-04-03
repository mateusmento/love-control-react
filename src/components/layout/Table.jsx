import { Slot } from '../core/Slot';
import { get } from '../../util';


export let Column = () => null;
export let Head = (props) => <th {...props}/>;
export let Cell = (props) => <td {...props}/>;
export let Rows = () => null;
export let RowDetails = () => null;



export function Table({items, children}) {
	let columnsCount = children.filter(c => c.type === Column).length;

	return (
		<table>
			<Slot required name={(t, p) => t === Column && p.title} content={children}>{ () =>
				<thead>
						<tr>
							<Slot required name={t => t === Column} content={children} multiple>{
								({title}, children) =>
									<Slot name={t => t === Head} as="th" content={children} data={{title}}>{title}</Slot>
							}</Slot>
						</tr>
				</thead>
			}</Slot>
			<Slot required name={(t, p) => t === Column} content={children}>{ () =>
				<tbody>{
						items.map((item, i) =>
							<Slot key={i} name={t => t === Rows} content={children} filterable={[item, i, items]} multiple>{
								({filter, ...props}) => <>
									<tr {...props}>
										<Slot required name={t => t === Column} content={children} multiple>{
											({field}, children) => {
												let value = get(item, field);
												return <Slot name={t => t === Cell} as="td" content={children} data={{value, item, index: i}}>{value}</Slot>
											}
										}</Slot>
									</tr>

									<Slot required name={t => t === RowDetails} content={children} filterable={[item, i, items]}>{
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
