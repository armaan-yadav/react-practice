import { useState } from "react";

// the state change  triggers the re render and re-render does the actual dom manipulation

const Counter = () => {
  const [count, setCount] = useState<number>(0);

  console.log(count);

  const increment = () => {
    setCount((prev) => prev + 1); //triggering the re-render
  };

  const decrement = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
    }
  };

  return (
    <>
      <Button count={count} increment={increment} decrement={decrement} />
    </>
  );
};

const Button = (props: any) => (
  <>
    <div className="flex gap-3">
      <button
        className="rounded-md bg-black text-white px-3"
        onClick={props.increment}
      >
        inc
      </button>
      <h1 className="text-lg font-extrabold">Count : {props.count}</h1>
      <button
        className="rounded-md bg-black text-white px-3"
        onClick={props.decrement}
      >
        dec
      </button>
    </div>
  </>
);

export default Counter;
