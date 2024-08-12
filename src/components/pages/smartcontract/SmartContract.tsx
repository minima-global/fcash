import MiCard from "../../helper/layout/Card/MiCard";
import { futureCashScript } from "../../../minima/scripts";
import { getFutureCashScriptAddress } from "../../../minima/rpc-commands";
import React from "react";
import FadeIn from "../../UI/Animations/FadeIn";

const SmartContract = () => {
  const [address, setAddress] = React.useState("");

  React.useEffect(() => {
    getFutureCashScriptAddress()
      .then((script) => {
        setAddress(script);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <FadeIn isOpen={true}>
      <MiCard extraClass="align-self-start mt-4">
        <h1 className="text-base font-bold tracking-widest">
          FutureCash uses the following Smart Contract script
        </h1>
        <div className="mt-2">
            <code className="text-black font-bold">{futureCashScript}</code>
        </div>
        <div className="text-center mt-2 font-bold text-xl">
          {">>>>"}
        </div>
        <div className="my-4">
            <code className="text-black break-all">{address}</code>
        </div>
      </MiCard>
    </FadeIn>
  );
};

export default SmartContract;
