import { omit } from 'lodash';
import { Children, createElement, isValidElement } from 'react';
import { callable, forwardRef, mergeProps, mergeRef } from '../../util';


export let Slot = forwardRef("Slot", (props, ref) => {
	let {
		$name: name,
		$condition: condition,
		$as: as,
		$required: required,
		$content: content,
		$multiple: multiple,
		$filterable: filterable,
		$merge: merge,
		$data: data,
		children = [],
		...userProps
	} = props;

	function findAndComputeNamedFillings() {
		let fillings = findFillingsByName(content, name, condition, multiple, filterable, merge);
		fillings = fillings.length > 0 && merge ? fillings.reduce(merge) : fillings;
		return computeFillings(fillings, name, children, userProps, data, ref);
	}

	content = content instanceof Array ? content : isValidElement(content) ? [content] : [];

	let fillings = name ? findAndComputeNamedFillings() : findDefaultFillings(content);

	if (fillings.length > 0) return fillings;
	if (required) return null;

	if (children instanceof Function)
		return children({}, null, 0);

	return as ? createElement(as, userProps, children) : children;
});

Slot.exists = (children, name) => children.some(nameEqualsExpression(name));

let nameEqualsExpression = (name, condition) => c => {
	let nameEquals = () => {
		if (typeof name === 'string')
			return `$${name}` in c.props;
		else if (typeof name === 'function')
			return name === c.type;
	}

	condition = !condition || condition(c.type, c.props);
	return nameEquals() && condition;
}

function findFillingsByName(content, name, condition, multiple, filterable) {
	let nameEquals = nameEqualsExpression(name, condition);
	let filter = ({props: {[`$${name}`]: filter}}, data) => typeof filter !== 'function' || filter(...data);
	let filterContent = c => c.$$typeof && nameEquals(c) && (!filterable || filter(c, filterable))

	if (multiple)
		return content.filter(filterContent);

	let filling = content.find(filterContent);
	return filling ? [filling] : [];
}

function computeFillings(fillings, name, children, defaultProps, data, ref) {
	let omitProps = props => omit(props, [`$${name}`, 'children']);

	function cloneFilling(fill) {
		let props = mergeProps(omitProps(fill.props), defaultProps);
		let children = callable(fill.props.children)(data);
		return createElement(fill.type, {...props, ref: mergeRef(fill.ref, ref)}, children);
	}

	let renderChildren = ({props, ref}) => children(omitProps(props), props.children, {ref, count: fillings.length});

	let map = children instanceof Function ? renderChildren : cloneFilling;
	return Children.map(fillings, map);
}

function findDefaultFillings(content) {
	return content.filter(c => !c.$$typeof || !c.props.slot);
}
