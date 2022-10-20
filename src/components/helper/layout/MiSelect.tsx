import styled from "@emotion/styled";

import styles from "../../styling/sendForm/TokenSelect.module.css";
import MinimaIcon from "../../svgs/MinimaIcon";
import { MinimaToken } from "../../../minima/types/minima";
import React from "react";
import MiDismiss from "../../svgs/MiDismiss";
import { Stack } from "@mui/system";
import MiSearch from "../../svgs/MiSearch";
import { Avatar, ListItemAvatar } from "@mui/material";

import { containsText, numberWithCommas } from "../../../utils";
import MiArrow from "../../svgs/MiArrow";

const DropDownContainer = styled("div")`
  width: 100%;
  margin: 0 auto;
  background: #ffede9;
  border: 1px solid #ffb9ab;
  border-radius: 8px;
`;
const DropDownHeader = styled("div")`
  min-height: 72px;
  background: #ffede9;
  margin: 0 auto;

  border: 1px solid #ffb9ab;
  border-radius: 8px;
  position: relative;
  * {
    margin: 0 !important;
    border: none !important;
  }
  > svg {
    position: absolute;
    right: 16px;
    top: 50%;
  }
`;
const DropDownListContainer = styled("div")`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70vh;
  background: #fff;
  border-radius: 24px 24px 0px 0px;
  z-index: 1000;
  overflow: auto;
  display: flex;
  flex-direction: column;

  padding-top: 32px;
  padding-left: 16px;
  padding-right: 16px;
`;
const BackDrop = styled("div")`
  background: rgba(0, 0, 0, 0.6);
  height: 100vh;
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const DropDownList = styled("ul")`
  padding: 0;
  margin-top: 24px;
  list-style: none;
`;
const Scroller = styled("div")`
  overflow: auto;
  flex-grow: 1;
`;
const MiTokenListItem = styled("li")`
  background: #ffede9;
  margin-bottom: 8px;
  min-height: 72px;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  border: 1px solid #ffb9ab;

  * {
    padding: 0 8px;
  }
`;
const DropDownListHeader = styled("h6")`
  font-family: Manrope-regular;
  font-size: 24px;
  font-weight: 700;
  line-height: 33px;
  letter-spacing: 0.02em;
  text-align: center;
  padding: 0;
  margin: 0;
`;
const MiSearchBar = styled("input")`
  margin-top: 22px;
  border: 1px solid #bdbdc4;
  border-radius: 8px;
  min-height: 48px;
  padding: 0px 16px;
  padding-right: 44px;
  font-family: Manrope-regular;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.01em;
  text-align: left;
  width: 100%;
`;
const MiSearchBarWithIcon = styled("div")`
  width: 100%;
  position: relative;
  & > svg {
    position: absolute;
    right: 16px;
    top: 36px;
    transition: 0.3s;
  }
`;

const MiTokenName = styled("p")`
  padding: 0;
  margin: 0;
  font-family: Manrope-regular;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 19px;
  letter-spacing: 0.02em;
  text-align: left;
  color: #ff6b4e;
`;
const MiTokenNameTicker = styled("p")`
  padding: 0;
  margin: 0;
  font-size: 0.75rem;
  font-family: Manrope-regular;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.02em;
  color: #363a3f;
`;
const MiTokenAmount = styled("p")`
  padding: 0;
  margin: 0;
  font-family: Manrope-regular;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.02em;
  font-variant: tabular-nums;
  color: #363a3f;
`;

const NoResults = styled("p")`
  font-family: Manrope-regular;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 16px;
  text-align: left;
`;

const MiSelect = (props: any) => {
  const [isOpen, setOpen] = React.useState(false);
  const [filterWallet, setFilterWallet] = React.useState<MinimaToken[]>([]);
  const [filterText, setFilterText] = React.useState("");

  const [selectedOption, setSelectedOption] =
    React.useState<MinimaToken | null>(null);
  const toggling = () => setOpen(!isOpen);
  const onOptionClicked = (t: MinimaToken) => {
    setSelectedOption(t);
    props.setFormTokenId("tokenid", t.tokenid);
    setOpen(false);
  };

  React.useEffect(() => {
    console.log("re-render MiSelect");
    if (selectedOption == null) {
      setSelectedOption(props.tokens[0]);
    } else {
      console.log(
        props.tokens.find(
          (i: MinimaToken) => i.tokenid == selectedOption.tokenid
        )
      );
      setSelectedOption(
        props.tokens.find(
          (i: MinimaToken) => i.tokenid == selectedOption.tokenid
        )
      );
    }

    setFilterWallet(
      props.tokens.filter(
        (m: MinimaToken) =>
          containsText(
            typeof m.token == "string"
              ? m.token
              : typeof m.token.name == "string"
              ? m.token.name
              : null,
            filterText
          ) || containsText(m.tokenid, filterText)
      )
    );
  }, [props.tokens, filterText]);

  return (
    <>
      <DropDownContainer>
        <DropDownHeader onClick={toggling}>
          {selectedOption && (
            <>
              <MiTokenListItem>
                <Avatar
                  sx={{
                    width: "56px",
                    height: "56px",
                    background: "#fff",
                  }}
                  className={styles["avatar"]}
                  variant="rounded"
                  src={`https://robohash.org/${selectedOption.tokenid}`}
                />
                <Stack
                  spacing={0.3}
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <MiTokenName>
                    {typeof selectedOption.token == "string"
                      ? selectedOption.token
                      : selectedOption.token.name}
                  </MiTokenName>
                  <MiTokenNameTicker>
                    {selectedOption.tokenid == "0x00"
                      ? "MINIMA"
                      : selectedOption.token.hasOwnProperty("ticker")
                      ? selectedOption.token.ticker
                      : null}
                  </MiTokenNameTicker>
                  <MiTokenAmount>
                    {numberWithCommas(selectedOption.sendable)}
                  </MiTokenAmount>
                </Stack>
              </MiTokenListItem>
              <MiArrow size={10} color="black" />
            </>
          )}
          {!selectedOption && <NoResults>No token selected.</NoResults>}
        </DropDownHeader>
        {isOpen && (
          <>
            <BackDrop className={styles["fadeIn"]}>
              <DropDownListContainer
                className={isOpen ? styles["slideIn"] : styles["slideOut"]}
              >
                <Stack flexDirection="column">
                  <Stack flexDirection="row" justifyContent="flex-end">
                    <MiDismiss
                      size={16}
                      onClick={toggling}
                      className={styles["dismiss"]}
                    />
                  </Stack>
                  <DropDownListHeader>Select token</DropDownListHeader>
                  <MiSearchBarWithIcon>
                    <MiSearchBar
                      value={filterText}
                      onChange={(v: any) => {
                        setFilterText(v.target.value);
                      }}
                      placeholder="Search by name or tokenid"
                    />
                    <MiSearch color="#fff" size={20} />
                  </MiSearchBarWithIcon>

                  <Scroller>
                    <DropDownList>
                      {filterWallet.length == 0 ? (
                        <NoResults>No results</NoResults>
                      ) : null}
                      {filterWallet.map((t: MinimaToken) => (
                        <MiTokenListItem
                          key={t.tokenid}
                          onClick={() => onOptionClicked(t)}
                        >
                          <Avatar
                            sx={{
                              width: "56px",
                              height: "56px",
                              background: "#fff",
                            }}
                            className={styles["avatar"]}
                            variant="rounded"
                            src={`https://robohash.org/${t.tokenid}`}
                          />
                          <Stack
                            spacing={0.3}
                            flexDirection="column"
                            alignItems="flex-start"
                          >
                            <MiTokenName>
                              {typeof t.token == "string"
                                ? t.token
                                : t.token.name}
                            </MiTokenName>
                            <MiTokenNameTicker>
                              {t.tokenid == "0x00"
                                ? "MINIMA"
                                : t.token.hasOwnProperty("ticker")
                                ? t.token.ticker
                                : null}
                            </MiTokenNameTicker>
                            <MiTokenAmount>
                              {numberWithCommas(t.sendable)}
                            </MiTokenAmount>
                          </Stack>
                        </MiTokenListItem>
                      ))}
                    </DropDownList>
                  </Scroller>
                </Stack>
              </DropDownListContainer>
            </BackDrop>
          </>
        )}
      </DropDownContainer>
    </>
  );
};

export default MiSelect;

const whatImageToDisplay = (t: MinimaToken) => {
  // minima token
  if (t.tokenid == "0x00") {
    return <MinimaIcon />;
  }
  // custom token
  if (t.token.hasOwnProperty("url")) {
    return t.token.url;
  }
  // nft
  if (t.token.hasOwnProperty("image")) {
    return t.token.image;
  }

  return;
};

/**
 
<select
        id={props.id}
        name={props.name}
        onChange={props.onChange}
        className={styles["selectWrapper"]}
      >
        {props.tokens.map((t: MinimaToken) => (
          <option value={t.tokenid}>
            <Stack>
              <Avatar variant="rounded">
                {t.tokenid == "0x00" ? <MinimaIcon /> : null}

                {t.tokenid !== "0x00" && t.token.hasOwnProperty() ? (
                  <img src={t.token.url} />
                ) : null}

                {t.tokenid !== "0x00" ? <img src={t.token.url} /> : null}
              </Avatar>
              {typeof t.token === "string" ? t.token : t.token.name}
            </Stack>
          </option>
        ))}
      </select>
 */
