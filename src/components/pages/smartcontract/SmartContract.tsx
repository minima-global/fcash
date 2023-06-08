import MiCard from "../../helper/layout/Card/MiCard";
import { futureCashScript } from "../../../minima/scripts";
import styled from "@emotion/styled";
import MiArrowDown from "../../helper/layout/svgs/MiArrowDown";
import { Box, CircularProgress, Stack } from "@mui/material";
import { getFutureCashScriptAddress } from "../../../minima/rpc-commands";
import React from "react";

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
    <MiCard>
      <MiSmartContractTitle>
        FutureCash uses the following Smart Contract script:
      </MiSmartContractTitle>
      <MiSmartContract>
        <Stack>
          <MiCode>{futureCashScript}</MiCode>
          <MiArrowWrapper>
            <MiArrowDown size={24} />
          </MiArrowWrapper>
          <MiCode>
            <Box
              sx={{
                textAlign: address.length === 0 ? "center" : "left",
              }}
            >
              {address.length > 0 ? (
                address
              ) : (
                <CircularProgress size={16} color="inherit" />
              )}
            </Box>
          </MiCode>
        </Stack>
      </MiSmartContract>
    </MiCard>
  );
};

export default SmartContract;
