import { css } from "@emotion/css";
import { classNames } from "../../util";
import { Component } from "../core/Component";

export function Card({as = "div", children, className, ...props}) {
	return (
		<Component as={as} className={classNames(style, className)} {...props}>{children}</Component>
	)
}

let style = css`
	border: 1px solid grey;
	border-radius: 10px;

	:first-child {
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
	}

	:first-child {
		border-bottom-left-radius: inherit;
		border-bottom-right-radius: inherit;
	}
`;
