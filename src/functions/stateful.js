import { createElement } from "react";
import { forwardRef } from "../util";

export function stateful(...args) {
	let name, component, makeState;

	if (args.length <= 2) [makeState, component] = args;
	else [makeState, name, component] = args;

	name = name || component.displayName || component.name;

	let statefulComponent = (props, ref) => {
		let state = makeState(props, ref);
		return createElement(component, {...state, ...props, ref});
	};

	return forwardRef(name, statefulComponent);
}
