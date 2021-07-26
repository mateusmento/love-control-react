import { merge, omit } from "lodash";
import { Children, createElement, isValidElement } from "react";
import { Template } from "../components/core/Template";
import { callable, mergeProps, mergeRef } from "../util";

export function childrenProcessing(injections) {
  return function inject(children) {
    if (children instanceof Array) return Children.map(children, process);
    return process(children);

    function process(child) {
			// if (child instanceof Array) return children.map(process);
			if (child instanceof Function) return (...args) => inject(child(...args));
			if (!isValidElement(child)) return child;

      let names = Object.keys(child.props)
        .filter((propName) => propName.startsWith("$"))
        .map((propName) => propName.replace("$", ""))
        .filter((propName) => propName in injections);

      let mergeInjectionProps = () => {
        let props = names.map((name) => {
					let value = child.props[`$${name}`];
					return callable(injections[name])(value);
				});

        if (props.some((v) => v === false)) return false;
        return merge(...props);
      };

      let injectionProps = mergeInjectionProps();

      if (!injectionProps) return null;

      let props = omit(
        mergeProps(injectionProps, child.props),
        names.map((n) => "$" + n),
      );

			if (child.ref)
				props.ref = injectionProps.ref ? mergeRef(injectionProps.ref, child.ref) : child.ref;

			if (child.key)
				props.key = child.key;

			let mergeChildren = (children) => {
				if (!injectionProps.children) return children;
				children = callable(injectionProps.children)(children);
				if (isValidElement(children) && children.type === Template)
					return children.props.children;
				return children;
			}

      if (child.props.children) {
        let children = inject(child.props.children || []);
				children = mergeChildren(children);
        return createElement(child.type, props, children);
      }

			if (injectionProps.children)
				props.children = mergeChildren([]);

			return createElement(child.type, props);
    }
  };
}
