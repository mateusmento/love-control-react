import { css } from "@emotion/css";
import { classNames, forwardRef } from "../../util";
import { Slot } from "../core/Slot";

export let Input = ({id, className, value, onChange, children, ...props}, ref) => {

	let input = <input className={inputStyle} value={value} onChange={e => onChange(e.target.value, e)} {...props} ref={ref}/>

	let inputWrapped =
		<div id={id} className={classNames("input-field", containerStyle, className)}>
				<Slot $name="prepend" $content={children} $required className="input-field__prepend" />
				{input}
				<Slot $name="append" $content={children} $required className="input-field__append" />
		</div>

	if (Slot.exists(children, "prepend") || Slot.exists(children, "append"))
			return inputWrapped;

	return input;
}

Input = forwardRef(Input);

Input.Prepend = () => null;
Input.Append = () => null;

let inputStyle = css`
	display: block;
	width: 100%;
	box-sizing: border-box;
	padding: 0;
	border: none;
	border-radius: none;
	background: inherit;
	font-size: inherit;

	&:focus {
		outline: none;
	}
`;

let containerStyle = css`
	&:focus-within {
		/* background-color: #eee; */
		box-shadow: 0 0 0 2pt rgba(0, 0, 0, 0.25);
	}
`;
