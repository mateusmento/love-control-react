import { useState, Children, useEffect } from "react";
import { callable } from "../../util";

export let Await = ({children}) => null;
export let Then = ({children}) => null;
export let Catch = ({children}) => null;

export function Awaitable({value, provider: Provider, children}) {
  let awaitChild = Children.toArray(children).find(c => c.type === Await);
  let thenChild = Children.toArray(children).find(c => c.type === Then);
  let catchChild = Children.toArray(children).find(c => c.type === Catch);

  let [stage, setStage] = useState(() =>
    value instanceof Promise
      ? callable(awaitChild.props.children)
      : () => <Provider value={value}>{callable(thenChild.props.children)(value)}</Provider>
  );

  useEffect(() => {
    if (value instanceof Promise) {
      (async () => {
        try {
          let res = await value;
          setStage(() => () => <Provider value={res}>{callable(thenChild.props.children)(res)}</Provider>);
        } catch (err) {
          setStage(() => () => callable(catchChild.props.children)(err));
        }
      })();
    }
  }, [value]);

  return stage();
}
