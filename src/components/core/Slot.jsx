import { omit } from 'lodash';
import { Children, createElement, Fragment, isValidElement } from 'react';
import { callable, forwardRef, mergeProps, mergeRef } from '../../util';
import { Template } from './Template';

export let Slot = forwardRef("Slot", (props, ref) => {
	let {
		$name: name,
		$type: type,
		$condition: condition,
		$as: as = "div",
		$required: required,
		$content: content,
		$multiple: multiple,
		$filterable: filterable,
		$merge: merge,
		$data: data,
		children = [],
		...userProps
	} = props;

	content = Children.map(content, c => c);

	function findAndComputeNamedFillings() {
		let fillings = findFillingsByName(content, name, condition, multiple, filterable, merge);
		let finalFillings = fillings.length > 0 && merge ? fillings.reduce(merge) : fillings;
		return computeFillings(finalFillings, name, as, children, userProps, data, ref);
	}

	content = content instanceof Array ? content : isValidElement(content) ? [content] : [];

	let fillings = name ? findAndComputeNamedFillings() : findDefaultFillings(content);

	if (fillings.length > 0) return fillings;
	if (required) return null;

	if (children instanceof Function)
		return children({}, null, 0);

	return as ? createElement(as, userProps, children) : children;
});

Slot.exists = (children, name) => Children.toArray(children).some(nameEqualsExpression(name));

let nameEqualsExpression = (name, condition) => c => {
	let nameEquals = () => {
		if (typeof name === 'string')
			return `$${name}` in c.props;
		else if (typeof name === 'function')
			return name === c.type;
	}

	condition = typeof condition !== 'function' || condition(c.type, c.props);
	return nameEquals() && condition;
}

function findFillingsByName(content, name, condition, multiple, filterable) {
	let nameEquals = nameEqualsExpression(name, condition);
	let filter = ({props: {[`$${name}`]: filter, $filter}}, data) => {
		filter = filter instanceof Function ? filter : $filter;
		return typeof filter !== 'function' || filter(...data);
	};

	let filterContent = c => isValidElement(c) && nameEquals(c) && (!filterable || filter(c, filterable))

	if (multiple)
		return content.filter(filterContent);

	let filling = content.find(filterContent);
	return filling ? [filling] : [];
}

function computeFillings(fillings, name, as, children, defaultProps, data, ref) {
	let omitProps = props => omit(props, [`$${name}`, 'children', '$filter']);
	let buildProps = props => mergeProps(omitProps(props), defaultProps)

	function cloneFilling(fill) {
		let props = buildProps(fill.props);
		let children = callable(fill.props.children)(data, props);
		// let type = fill.type === Template ? as : fill.type;
		// type = type || Fragment;
		// if (type !== Fragment)
		// 	return createElement(type, {...props, ref: mergeRef(fill.ref, ref)}, children);
		// else
		// 	return <>{children}</>;
		return createElement(fill.type, {...props, ref: mergeRef(fill.ref, ref)}, children);
	}

	let renderChildren = ({type, props, ref}) => {
		// type = type === Template ? as || Template : type;
		return children(buildProps(props), props.children, {type, ref, count: fillings.length});
	};

	let map = children instanceof Function ? renderChildren : cloneFilling;

	return Children.map(fillings, map);
}

function findDefaultFillings(content) {
	return content.filter(c => !isValidElement(c) || !Object.keys(c.props).every(k => !k.startsWith("$")));
}
