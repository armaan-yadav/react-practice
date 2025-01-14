import React, { useEffect, useState } from "react";

const CountDown = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div>
      <h1>{seconds} elapsed</h1>

      <span
        className="bg-blue-600 rounded-md px-4  py-1"
        onClick={() => {
          setIsRunning((prev) => !prev);
        }}
      >
        {isRunning ? "Pause" : "Resume"}
      </span>
    </div>
  );
};

export default CountDown;
