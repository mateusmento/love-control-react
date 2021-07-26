import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

let Context = createContext();

export function RadioGroup({name, children}) {
	return <Context.Provider value={name}>{children}</Context.Provider>
}

export function RadioInput({...props}) {
	let name = useContext(Context);
	return <input {...props} type="radio" name={name}/>
}

<RadioGroup name="city">
	<label>
		<RadioInput />
		Rio de Janeiro
	</label>

	<label>
		<RadioInput />
		São Paulo
	</label>

	<label>
		<RadioInput />
		Recife
	</label>
</RadioGroup>

function Counter() {
	let [value, setValue] = useState(0);

	setValue(1); // Essa chamada causará loop infinito
	// useEffect(() => setValue(1)); // Essa chamada causará loop infinito
	useEffect(() => setValue(value + 1), [value]); // Essa chamada causará loop infinito

	return (
		<button onClick={() => setValue(value + 1)}>
			{value}
		</button>
	);
}

<Counter/>

ReactDOM.render(
	<App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
