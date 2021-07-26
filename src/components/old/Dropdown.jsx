import { Children, useCallback, useState } from 'react';
import { useOutsideEventRef } from '../../hooks/useClickOutsideEvent';
import { callable } from '../../util';
import { css } from '@emotion/css';
import '../../Dropdown.css';
import { Slot } from '../core/Slot';


const containerStyle = css`
	position: relative;
`;

const contentStyle = css`
	position: absolute;
`;

export function useDropdown({show = true, onChange = () => {}}) {
	let [shown, setShown] = useState(show);

	let open = useCallback(() => {
		setShown(true);
		if (onChange) onChange(true);
	}, [onChange]);

	let close = useCallback(() => {
		setShown(false);
		if (onChange) onChange(false);
	}, [onChange]);

	let toggle = useCallback(() => {
		setShown(isOpen => {
			onChange(!isOpen);
			return !isOpen;
		});
	}, [onChange]);

	let closeOnOutsideClickRef = useOutsideEventRef('mousedown', (el) => close(), [close]);

	return { shown, open, close, toggle, containerStyle, closeOnOutsideClickRef };
}

export function Dropdown({as, openOn, shown: value, onToggle: onChange, children, ...props}) {
	let { shown, open, close, toggle, containerStyle, closeOnOutsideClickRef } = useDropdown({shown: value, onChange});

	openOn = openOn || 'onClick'

	if (openOn instanceof Array)
		openOn = openOn.reduce((acc, event) => ({...acc, [event]: () => onChange(true)}), {});
	else if (typeof openOn === 'string')
		openOn = { [openOn]: open };

	if (children instanceof Array) children = [children];

	children = Children.map(children, child => callable(child)({shown, open, close, toggle}));

	return (
		<div className="dropdown" {...props}>
			{ shown && <Slot $name="dropdown__toggler" $content={children}/> }
			<Slot $name="dropdown__content" $content={children}/>
		</div>
	);

}
