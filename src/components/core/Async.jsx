import { createContext, useContext, useEffect, useState } from "react";
import { callable } from "../../util";

const AsyncContext = createContext();

export function Await({children}) {
	let value = useContext(AsyncContext);
	let [content, setContent] = useState(value instanceof Promise ? callable(children)() : null);

	useEffect(() => {
		if (value instanceof Promise)
			value.catch(() => {}).finally(() => setContent(null))
	}, [value]);

	return content;
}

export function Then({children}) {
	children = callable(children);

	let value = useContext(AsyncContext);

	let [content, setContent] = useState(value instanceof Promise ? null : children(value));

	useEffect(() => {
		if (value instanceof Promise)
			value.then(res => setContent(children(res))).catch(() => {});
		else
			setContent(children(value));
	}, [value, children]);

	return content;
}

export function Catch({children}) {
	let value = useContext(AsyncContext);
	let [content, setContent] = useState(null);

	useEffect(() => {
		if (value instanceof Promise)
			value.catch(err => setContent(callable(children)(err)));
	}, [value, children]);

	return content;
}

export function Async({value, children}) {
	return (
		<AsyncContext.Provider value={value}>{
			children instanceof Function
				? <Then>{children}</Then>
				: children
		}</AsyncContext.Provider>
	);
}
