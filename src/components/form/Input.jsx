import { Slot } from "./Slot";

export function Input({value, onChange, children, ...props}) {

	let input = <input className="input-field" value={value} onChange={e => onChange(e.target.value, e)} {...props}/>

	let inputWrapped =
			<div className="input-field">
					<Slot name="prepend" content={children} required props={{className: "input-field__prepend"}} />
					{input}
					<Slot name="append" content={children} required props={{className: "input-field__append"}} />
			</div>

	if (Slot.exists(children, "prepend") || Slot.exists(children, "append"))
			return inputWrapped;

	return input;
}

Input.Prepend = () => null;
Input.Append = () => null;
