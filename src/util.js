import _ from 'lodash';
import React, { useMemo, useRef, useState } from 'react';

export let callable = (value, ...initialArgs) => {
	if (typeof value !== 'function') return () => value;
	if (initialArgs.length === 0) return value;
	return (...args) => value(...initialArgs, ...args);
}

export let call = (value, ...args) => value instanceof Function ? value(...args) : value

export let callAll = (...funcs) => (...args) => funcs.forEach((func, i) => func(...args));

export let get = (object, path, defaultValue) =>
	path instanceof Function
		? path(object) || defaultValue
		: _.get(object, path) || defaultValue

export let getter = (path) => (object, defaultValue) => get(object, path, defaultValue);
export let getters = (...path) => path.map(getter);

export let compositeGetter = (...path) => {
	let composedGetters = getters(...path);
	return (object, defaultValue) => composedGetters.map(getter => getter(object, defaultValue));
}

export let accessor = ([value, setter]) => {
	let accessor = (...args) => {
		if (args.length > 0) {
			setter(args[0]);
			return args[0];
		}
		return value;
	}

	accessor.value = value;
	accessor.set = setter;

	return accessor;
}

export async function fetchData(url) {
	let res = await fetch(url);
	return await res.json();
}

export async function fetchPaginatedData(url) {
	let data = await fetchData(url);
	let next = () => fetchPaginatedData(data.next);
	let previous = () => fetchPaginatedData(data.previous);
	return { ...data, previous, next };
}

export function forwardRef(...args) {
	let name, component;

	if (args.length === 1) [component] = args;
	else [name, component] = args;

	let forwardRefComponent = React.forwardRef(component);
	forwardRefComponent.displayName = name || component.displayName || component.name;

	return forwardRefComponent;
}

export function useForceUpdate(){
	const [value, setValue] = useState(0);
	return { version: value, forceUpdate: () => setValue(value => value + 1) };
}

export function classNames(...classNames) {

	let resolveObjectEntries = (classNames) => Object.entries(classNames)
		.filter(([className, accepted]) => accepted && className)
		.map(([className]) => className)
		.join(" ");

	let result = classNames
		.map(className => className instanceof Object ? resolveObjectEntries(className) : className)
		.filter(className => className)
		.join(" ");

	return result;
}

export let mergeClassNames = (a = '', b = '') => [a || '', b || ''].join(' ').trim();

export let mergeProps = (left, right) => {
	let props = {...left, ...right};

	if (typeof left.id === 'string' && typeof right.id === 'string')
		props.id = mergeClassNames(left.id, right.id);

	if (typeof left.className === 'string' && typeof right.className === 'string')
		props.className = mergeClassNames(left.className, right.className);

	let events = Object.entries(left)
		.filter(([key]) => /^on[A-Z]/.test(key) && key instanceof Function);

	for (let [name, handler] of events)
		if (right[name] instanceof Function)
			props[name] = mergeEvent(handler, right[name]);

	let children = left.children || right.children;
	if (children) props.children = children;

	return props;
}

export function mergePropElements(a, b) {
	let element = { ...a, props: mergeProps(a.props, b.props) }
	let ref = b.ref || a.ref;
	if (ref) element.ref = ref;
	return element;
}

export let mergeRef = (...refs) => (el) => el && refs.forEach(ref => {
	if (ref instanceof Function) ref(el);
	else if (ref instanceof Object) ref.current = el;
})

export let mergeEvent = (a, b) => {
	return (...args) => {
		a && a(...args);
		b && b(...args);
	};
}

export function usePreviousMemo(...args) {
	let factory, initialValue, deps;

	if (args.length <= 2)
		[factory, deps] = args;
	else
		[initialValue, factory, deps] = args;

	let previous = useRef(initialValue);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	previous.current = useMemo(() => factory(previous.current), deps);
	return previous.current;
}
