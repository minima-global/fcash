import MiCard from "../../helper/layout/Card/MiCard";
import { futureCashScript } from "../../../minima/scripts";
import styled from "@emotion/styled";
import MiArrowDown from "../../helper/layout/svgs/MiArrowDown";
import { Box, CircularProgress, Stack } from "@mui/material";
import { getFutureCashScriptAddress } from "../../../minima/rpc-commands";
import React from "react";
import FadeIn from "../../UI/Animations/FadeIn";

const MiSmartContractTitle = styled("p")`
  font-weight: 700;
  font-size: 1rem;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #ff7358;
  padding: 0;
  margin: 0;
  text-align: left;
  padding-bottom: 8px;
`;
const MiCode = styled("code")`
  text-align: left;
  word-break: break-all;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const MiSmartContract = styled("div")`
  margin: 8px;
  text-align: left;
  margin-bottom: 8px;
`;

const MiArrowWrapper = styled("div")`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  > svg {
    margin: 0;
    padding: 0;
  }
`;

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
        <h1 className="text-base font-bold color-futurecash">
          FutureCash uses the following Smart Contract script
        </h1>
        <MiSmartContract>
          <Stack>
            <code className="text-black font-bold">{futureCashScript}</code>
            <div className="w-full flex justify-center items-center my-4 text-center">
              <svg
                width="15"
                height="25"
                viewBox="0 0 15 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.79289 24.2306C7.18342 24.6211 7.81658 24.6211 8.20711 24.2306L14.5711 17.8666C14.9616 17.4761 14.9616 16.8429 14.5711 16.4524C14.1805 16.0619 13.5474 16.0619 13.1569 16.4524L7.5 22.1092L1.84315 16.4524C1.45262 16.0619 0.819456 16.0619 0.428931 16.4524C0.0384071 16.8429 0.0384071 17.4761 0.428931 17.8666L6.79289 24.2306ZM6.5 0.5L6.5 23.5234L8.5 23.5234L8.5 0.5L6.5 0.5Z"
                  fill="black"
                />
              </svg>
            </div>

            <code className="text-black break-all">{address}</code>
          </Stack>
        </MiSmartContract>
      </MiCard>
    </FadeIn>
  );
};

export default SmartContract;
