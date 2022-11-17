import { Stack } from "@mui/material";
import React from "react";
import MiCard from "../../helper/layout/MiCard";

import { Tabs, TabButton } from "../../helper/layout/MiTabs";
import styles from "./Instructions.module.css";
import styled from "@emotion/styled";

const MiInstructionTitle = styled("p")`
  font-family: Manrope-regular;
  font-weight: 700;
  font-size: 1rem;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #ff7358;
  padding: 0;
  margin: 0;
  text-align: left;
`;
const MiInstructionWrapper = styled("div")`
  padding: 0px 0px;
`;
const MiInstructionList = styled("ol")`
  padding-inline-start: 20px;

  > :last-of-type {
    margin-bottom: 0 !important;
  }
`;
const MiInstruction = styled("li")`
  font-family: Manrope-regular;
  font-weight: 400;
  font-size: 1rem;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #363a3f;
  padding: 0;
  margin: 0;
  text-align: left;
  margin-bottom: 8px;
`;

const dataTestIds = {
  tabSend: 'Instructions__tabSend',
  tabFuture: 'Instructions__tabFuture',
  send: 'Instructions__send',
  future: 'Instructions__future',
};

const Instructions = () => {
  const [tabOpen, setTabOpenIndex] = React.useState(0);
  const toggle = (i: number) => setTabOpenIndex(i);
  return (
    <>
      <Stack spacing={3}>
        <Tabs>
          <TabButton
            data-testid={dataTestIds.tabSend}
            onClick={() => toggle(0)}
            className={tabOpen === 0 ? styles["tab-open"] : undefined}
          >
            Send
          </TabButton>
          <TabButton
            data-testid={dataTestIds.tabFuture}
            onClick={() => toggle(1)}
            className={tabOpen === 1 ? styles["tab-open"] : undefined}
          >
            Future
          </TabButton>
        </Tabs>
        {tabOpen === 0 && (
          <MiCard>
            <MiInstructionWrapper data-testid={dataTestIds.send}>
              <MiInstructionTitle>
                How to send funds to the future
              </MiInstructionTitle>
              <MiInstructionList>
                <MiInstruction>Navigate to the Send page.</MiInstruction>
                <MiInstruction>Select a token to send.</MiInstruction>
                <MiInstruction>
                  Pick a date and time that you would like the tokens to become
                  unlocked.
                </MiInstruction>
                <MiInstruction>
                  Enter a Minima wallet address. This can be your wallet address
                  or the address of a third party.{" "}
                  <b>
                    <i>If you are choosing to lock funds for someone else.</i>
                  </b>
                </MiInstruction>
                <MiInstruction>
                  Choose how many tokens you would like to lock.
                </MiInstruction>
                <MiInstruction>
                  Then send those tokens to the future.
                </MiInstruction>
              </MiInstructionList>
            </MiInstructionWrapper>
          </MiCard>
        )}

        {tabOpen === 1 && (
          <MiCard>
            <MiInstructionWrapper data-testid={dataTestIds.future}>
              <MiInstructionTitle>Collecting funds</MiInstructionTitle>
              <MiInstructionList>
                <MiInstruction>Navigate to the Future page.</MiInstruction>
                <MiInstruction>
                  Tokens which have not reached their unlock date and time can
                  be found under the Pending tab.
                </MiInstruction>
                <MiInstruction>
                  To view more information, click on the token. Tokens which
                  have reached their unlock date and time can be found under the{" "}
                  <b>
                    <i>Ready</i>
                  </b>{" "}
                  tab.
                </MiInstruction>
                <MiInstruction>
                  Once a token is ready to collect, simply hit the Collect
                  button and the tokens will automatically unlock and appear in
                  the balance of the wallet address to which they were sent.
                </MiInstruction>
              </MiInstructionList>
            </MiInstructionWrapper>
          </MiCard>
        )}
      </Stack>
    </>
  );
};

export default Instructions;
