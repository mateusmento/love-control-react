import { createContext, useContext, useEffect, useState } from "react";
import { callable, get } from "../../util";


let AsyncContext = createContext();

export function Await({path, children = null}) {
	let { value, mode, isRawValue } = useContext(AsyncContext);
	let [isLoading, setIsLoading] = useState(isRawValue ? false : true);

	useEffect(() => {
		(async () => {
			if (isRawValue) return;
			setIsLoading(true);

			try {
				if (mode === 'all' && value instanceof Array) {
					await Promise.all(value);
				} else if (mode === 'race' && value instanceof Object) {
					if (path)
						await get(value, path);
					else
						await Promise.race(Object.values(value));
				} else {
					await value;
				}
			} catch(err) {
			} finally {
				setIsLoading(false);
			}

		})();
	}, [value, mode, path, isRawValue]);

	return isLoading ? callable(children)() : null;
}

export function Then({path, children = null}) {
	let { value, mode, isRawValue } = useContext(AsyncContext);

	let [result, setResult] = useState(isRawValue ? value : null);
	let [isResolved, setIsResolved] = useState(isRawValue);

	useEffect(() => {
		(async() => {
			let setInnerResult = (k, v) => setResult(result => ({...result, [k]: v}));

			if (isRawValue) return;
			setIsResolved(false);

			try {
				if (mode === 'all' && value instanceof Array) {
					setResult(await Promise.all(value));
				} else if (mode === 'race' && value instanceof Object) {
					if (path) {
						setResult({[path]: await get(value, path)});
					} else {
						// TODO: not sure if this is the right kind of functionality.
						// Maybe having mode and paths props in <Then/> to wait for all paths
						let promises = Object.entries(value)
							.map(async ([key, value]) => setInnerResult(key, await value));
						await Promise.race(promises);
					}
				} else {
					setResult(await value);
				}

				setIsResolved(true);
			} catch(err) {
			}

		})();
	}, [value, mode, path, isRawValue]);

	return isResolved ? callable(children)(result) : null;
}

export function Catch({path, children = null}) {
	let { value, mode, isRawValue } = useContext(AsyncContext);
	let [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			if (isRawValue) return;

			setError(null);

			try {
				if (mode === 'all' && value instanceof Array) {
					await Promise.all(value);
				} else if (mode === 'race' && value instanceof Object) {
					if (path)
						await get(value, path);
					else
						// TODO: not working...
						await Promise.race(Object.values(value));
				} else {
					await value;
				}
			} catch(err) {
				setError(err);
			}

		})();
	}, [value, mode, path, isRawValue]);

	if (!error) return null;

	children = children instanceof Array ? children : [children];
	return error ? children.map((child) => callable(child)(error)) : null;
}

export function Async({value, mode, children, ...props}) {
	let isRawValue = !(value instanceof Promise) && !['all','race'].includes(mode);

	return (
		<AsyncContext.Provider value={{value, mode, isRawValue}}>
			{children instanceof Function ? <Then {...props}>{children}</Then> : children}
		</AsyncContext.Provider>
	);
}
