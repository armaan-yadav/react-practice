import { useEffect, useState } from "react";

const Banana = () => {
  const [showBox, setShowBox] = useState<boolean>(false);

  return (
    <div>
      <div>
        Show Box
        <input
          type="checkbox"
          checked={showBox}
          onChange={(e) => {
            setShowBox(e.target.checked);
          }}
        />
      </div>
      {showBox && <Box />}
    </div>
  );
};

const Box = () => {
  useEffect(() => {
    console.log("mai aa  gaya :)");

    return () => {
      console.log("mai chala gya :(");
    };
  }, []);

  return <div className="size-[100px] bg-red-700"> I am a box</div>;
};

export default Banana;
