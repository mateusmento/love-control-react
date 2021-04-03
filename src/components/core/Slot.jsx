import { Children, cloneElement, createElement, isValidElement } from 'react';
import { callable } from '../../util';


export function Slot({name, as, required, content, multiple, data, props: defaultProps, children: defaultChildren = []}) {
	content = content instanceof Array ? content : isValidElement(content) ? [content] : [];

	function findAndComputeNamedFillings() {
		let fillings = findFillingsByName(content, name, multiple)
		return computeFillings(fillings, defaultChildren, defaultProps, data);
	}

	let fillings = name ? findAndComputeNamedFillings() : findDefaultFillings(content);

	if (fillings.length > 0) return fillings;
	if (required) return null;

	if (defaultChildren instanceof Function)
		return defaultChildren({}, null, 0);

	return as ? createElement(as, defaultProps, defaultChildren) : defaultChildren;
}

Slot.exists = (children, name) => children.some(nameEqualsFactory(name));


let nameEqualsFactory = name => name instanceof Function
	? c => name(c.type, c.props, c.props.slot)
	: c => c.props.slot === name;


function findFillingsByName(content, name, multiple) {
	let nameEquals = nameEqualsFactory(name);
	let fillings = multiple
		? content.filter(c => c.$$typeof && nameEquals(c))
		: [content.find(c => c.$$typeof && nameEquals(c))].filter(c => c);
	return fillings;
}

function computeFillings(fillings, defaultChildren, {children, ...defaultProps} = {}, data) {
	let computeFilling = ({props: {children, ...props}}) =>
		defaultChildren({...props, slot: undefined}, children, fillings.length)

	let mergeProps = ({props}) => ({...defaultProps, ...props, slot: undefined});
	let computeChildren = ({props}) => callable(props.children)(data);
	let cloneFilling = (fill) => cloneElement(fill, mergeProps(fill), computeChildren(fill));

	if (defaultChildren instanceof Function)
		return Children.map(fillings, computeFilling);
	return Children.map(fillings, cloneFilling);
}

function findDefaultFillings(content) {
	return content.filter(c => !c.$$typeof || !c.props.slot);
}
