import styled from "@emotion/styled";

import styles from "./styling/sendpage/TokenSelect.module.css";
import MinimaIcon from "./svgs/MinimaIcon";
import { MinimaToken } from "../../../minima/types/minima";
import React from "react";
import MiDismiss from "./svgs/MiDismiss";
import { Stack } from "@mui/system";
import MiSearch from "./svgs/MiSearch";
import { Avatar } from "@mui/material";

import {
  MiSearchBar,
  MiSearchBarWithIcon,
  MiTokenName,
  MiTokenNameTicker,
  MiTokenAmount,
  MiSkeleton,
  MiTokenListItem,
  NoResults,
} from "./MiToken";

import { containsText, numberWithCommas } from "../../../utils";
import MiArrow from "./svgs/MiArrow";

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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90vh;
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

const MiSelect = (props: any) => {
  const [isOpen, setOpen] = React.useState(false);
  const [filterWallet, setFilterWallet] = React.useState<MinimaToken[]>([]);
  const [filterText, setFilterText] = React.useState("");

  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  const [selectedOption, setSelectedOption] =
    React.useState<MinimaToken | null>(null);
  const toggling = () => setOpen(!isOpen);
  const onOptionClicked = (t: MinimaToken) => {
    props.resetForm();
    setSelectedOption(t);
    props.setFieldValue("token", t);
    setOpen(false);
  };

  React.useEffect(() => {
    if (selectedOption == null) {
      setSelectedOption(props.tokens[0]);
    } else {
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
                  sx={{ textOverflow: "ellipsis" }}
                >
                  <MiTokenName>
                    {typeof selectedOption.token == "string"
                      ? selectedOption.token
                      : selectedOption.token.name}
                  </MiTokenName>
                  <MiTokenNameTicker>
                    {selectedOption.tokenid == "0x00" ? (
                      "MINIMA"
                    ) : selectedOption.token.hasOwnProperty("ticker") ? (
                      selectedOption.token.ticker
                    ) : (
                      <MiSkeleton />
                    )}
                  </MiTokenNameTicker>
                  <MiTokenAmount>
                    {numberWithCommas(selectedOption.sendable)}
                  </MiTokenAmount>
                </Stack>
              </MiTokenListItem>
              <MiArrow size={10} color="black" />
            </>
          )}
          {!selectedOption && <p>No token selected.</p>}
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
                        <NoResults>
                          <h6>No results</h6>
                          <p>Please try your search again.</p>
                        </NoResults>
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
                              {t.tokenid == "0x00" ? (
                                "MINIMA"
                              ) : t.token.hasOwnProperty("ticker") ? (
                                t.token.ticker
                              ) : (
                                <MiSkeleton />
                              )}
                            </MiTokenNameTicker>
                            <MiTokenAmount>
                              {numberWithCommas(t.sendable)}
                            </MiTokenAmount>
                          </Stack>
                        </MiTokenListItem>
                      ))}
                      {/* DummyToken */}
                      {/* <MiTokenListItem key={Math.random() * 10000}>
                        <Avatar
                          sx={{
                            width: "56px",
                            height: "56px",
                            background: "#fff",
                          }}
                          className={styles["avatar"]}
                          variant="rounded"
                          src={`https://robohash.org/${0x00}`}
                        />
                        <Stack
                          spacing={0.3}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <MiTokenName>"dummyToken"</MiTokenName>

                          <MiTokenNameTicker>
                            <MiSkeleton />
                          </MiTokenNameTicker>
                          <MiTokenAmount>"dummy"</MiTokenAmount>
                        </Stack>
                      </MiTokenListItem>
                      <MiTokenListItem key={Math.random() * 10000}>
                        <Avatar
                          sx={{
                            width: "56px",
                            height: "56px",
                            background: "#fff",
                          }}
                          className={styles["avatar"]}
                          variant="rounded"
                          src={`https://robohash.org/${0x00}`}
                        />
                        <Stack
                          spacing={0.3}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <MiTokenName>"dummyToken"</MiTokenName>

                          <MiTokenNameTicker>
                            <MiSkeleton />
                          </MiTokenNameTicker>
                          <MiTokenAmount>"dummy"</MiTokenAmount>
                        </Stack>
                      </MiTokenListItem>
                      <MiTokenListItem key={Math.random() * 10000}>
                        <Avatar
                          sx={{
                            width: "56px",
                            height: "56px",
                            background: "#fff",
                          }}
                          className={styles["avatar"]}
                          variant="rounded"
                          src={`https://robohash.org/${0x00}`}
                        />
                        <Stack
                          spacing={0.3}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <MiTokenName>"dummyToken"</MiTokenName>

                          <MiTokenNameTicker>
                            <MiSkeleton />
                          </MiTokenNameTicker>
                          <MiTokenAmount>"dummy"</MiTokenAmount>
                        </Stack>
                      </MiTokenListItem>
                      <MiTokenListItem key={Math.random() * 10000}>
                        <Avatar
                          sx={{
                            width: "56px",
                            height: "56px",
                            background: "#fff",
                          }}
                          className={styles["avatar"]}
                          variant="rounded"
                          src={`https://robohash.org/${0x00}`}
                        />
                        <Stack
                          spacing={0.3}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <MiTokenName>"dummyToken"</MiTokenName>

                          <MiTokenNameTicker>
                            <MiSkeleton />
                          </MiTokenNameTicker>
                          <MiTokenAmount>"dummy"</MiTokenAmount>
                        </Stack>
                      </MiTokenListItem>
                      <MiTokenListItem key={Math.random() * 10000}>
                        <Avatar
                          sx={{
                            width: "56px",
                            height: "56px",
                            background: "#fff",
                          }}
                          className={styles["avatar"]}
                          variant="rounded"
                          src={`https://robohash.org/${0x00}`}
                        />
                        <Stack
                          spacing={0.3}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <MiTokenName>"dummyToken"</MiTokenName>

                          <MiTokenNameTicker>
                            <MiSkeleton />
                          </MiTokenNameTicker>
                          <MiTokenAmount>"dummy"</MiTokenAmount>
                        </Stack>
                      </MiTokenListItem>
                      <MiTokenListItem key={Math.random() * 10000}>
                        <Avatar
                          sx={{
                            width: "56px",
                            height: "56px",
                            background: "#fff",
                          }}
                          className={styles["avatar"]}
                          variant="rounded"
                          src={`https://robohash.org/${0x00}`}
                        />
                        <Stack
                          spacing={0.3}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <MiTokenName>"dummyToken"</MiTokenName>

                          <MiTokenNameTicker>
                            <MiSkeleton />
                          </MiTokenNameTicker>
                          <MiTokenAmount>"dummy"</MiTokenAmount>
                        </Stack>
                      </MiTokenListItem>
                      <MiTokenListItem key={Math.random() * 10000}>
                        <Avatar
                          sx={{
                            width: "56px",
                            height: "56px",
                            background: "#fff",
                          }}
                          className={styles["avatar"]}
                          variant="rounded"
                          src={`https://robohash.org/${0x00}`}
                        />
                        <Stack
                          spacing={0.3}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <MiTokenName>"dummyToken"</MiTokenName>

                          <MiTokenNameTicker>
                            <MiSkeleton />
                          </MiTokenNameTicker>
                          <MiTokenAmount>"dummy"</MiTokenAmount>
                        </Stack>
                      </MiTokenListItem>
                      <MiTokenListItem key={Math.random() * 10000}>
                        <Avatar
                          sx={{
                            width: "56px",
                            height: "56px",
                            background: "#fff",
                          }}
                          className={styles["avatar"]}
                          variant="rounded"
                          src={`https://robohash.org/${0x00}`}
                        />
                        <Stack
                          spacing={0.3}
                          flexDirection="column"
                          alignItems="flex-start"
                        >
                          <MiTokenName>"dummyToken"</MiTokenName>

                          <MiTokenNameTicker>
                            <MiSkeleton />
                          </MiTokenNameTicker>
                          <MiTokenAmount>"dummy"</MiTokenAmount>
                        </Stack>
                      </MiTokenListItem> */}
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
