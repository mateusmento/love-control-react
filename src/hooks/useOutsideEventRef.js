import { useEffect, useRef } from "react";

export function useOutsideEventRef(event, handler, deps) {
	let ref = useRef();

	useEffect(() => {
		let listener = (el) => {
			if (ref.current && !ref.current.contains(el.target))
			handler(el);
		}

		window.addEventListener(event, listener);
		return () => window.removeEventListener(event, listener);
	}, [event, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

	return ref;
}
