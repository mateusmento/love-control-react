import { omit } from 'lodash';
import { Children, cloneElement, createElement, isValidElement } from 'react';
import { callable } from '../../util';


export function Slot({name, as, required, content, multiple, filterable, merge, data, props, children = []}) {
	content = content instanceof Array ? content : isValidElement(content) ? [content] : [];

	function findAndComputeNamedFillings() {
		let fillings = findFillingsByName(content, name, multiple, filterable, merge);
		fillings = fillings.length > 0 && merge ? fillings.reduce(merge) : fillings;
		return computeFillings(fillings, children, props, data);
	}

	let fillings = name ? findAndComputeNamedFillings() : findDefaultFillings(content);

	if (fillings.length > 0) return fillings;
	if (required) return null;

	if (children instanceof Function)
		return children({}, null, 0);

	return as ? createElement(as, props, children) : children;
}

Slot.exists = (children, name) => children.some(nameEqualsFactory(name));

let nameEqualsFactory = name => name instanceof Function
	? c => name(c.type, c.props, c.props.slot)
	: c => c.props.slot === name;

function findFillingsByName(content, name, multiple, filterable) {
	let nameEquals = nameEqualsFactory(name);
	let filter = ({props: {filter}}, data) => !filter || filter(...data);
	let filterContent = c => c.$$typeof && nameEquals(c) && (!filterable || filter(c, filterable))

	if (multiple)
		return content.filter(filterContent);

	let filling = content.find(filterContent);
	return filling ? [filling] : [];
}

function computeFillings(fillings, children, defaultProps, data) {
	let omitProps = props => omit(props, ['slot', 'filter', 'children']);

	function cloneFilling(fill) {
		let props = omitProps({...defaultProps, ...fill.props});
		let children = callable(fill.props.children)(data);
		return cloneElement(fill, props, children);
	}

	let renderChildren = ({props}) => children(omitProps(props), props.children, fillings.length);

	let map = children instanceof Function ? renderChildren : cloneFilling;
	return Children.map(fillings, map);
}

function findDefaultFillings(content) {
	return content.filter(c => !c.$$typeof || !c.props.slot);
}
