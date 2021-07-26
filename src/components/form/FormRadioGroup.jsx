import { createContext, useContext } from "react";

let RadioGroupContext = createContext();

export function RadioInput({label, type, ...props}) {
	let {name} = useContext(RadioGroupContext);

	if (!label)
		return <input type="radio" name={name} {...props}/>;

	return (
		<label>
			<input type="radio" name={name} {...props}/>
			{label}
		</label>
	);
}

export function RadioGroup({name, children}) {
	return <RadioGroupContext.Provider value={name}>{children}</RadioGroupContext.Provider>
}
