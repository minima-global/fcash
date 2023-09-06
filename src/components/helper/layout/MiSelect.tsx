import { createPortal } from "react-dom";

import styled from "@emotion/styled";
import styles from "./styling/sendpage/TokenSelect.module.css";
import { MinimaToken } from "../../../minima/@types/minima";
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

import { containsText } from "../../../utils";
import MiArrow from "./svgs/MiArrow";
import MinimaLogoSquare from "../../../assets/images/minimaLogoSquare.png";
import { MINIMA__TOKEN_ID } from "../../../minima/constants";

import SlideUp from "../../UI/Animations/SlideUp";
import FadeIn from "../../UI/Animations/FadeIn";
import { useFormikContext } from "formik";

const MiSelect = () => {
  const [isOpen, setOpen] = React.useState(false);
  const [filterWallet, setFilterWallet] = React.useState<MinimaToken[]>([]);
  const [filterText, setFilterText] = React.useState("");
  const formik: any = useFormikContext();

  const [selectedOption, setSelectedOption] =
    React.useState<MinimaToken | null>(null);
  // const toggling = () => setOpen(!isOpen);
  // const onOptionClicked = (t: MinimaToken) => {
  //   formik.resetForm();
  //   setSelectedOption(t);
  //   formik.setFieldValue("token", t);
  //   setOpen(false);
  // };

  // React.useEffect(() => {
  //   if (selectedOption == null) {
  //     setSelectedOption(formik.values.tokens[0]);
  //   } else {
  //     setSelectedOption(
  //       formik.values.tokens.find(
  //         (i: MinimaToken) => i.tokenid == selectedOption.tokenid
  //       )
  //     );
  //   }

  //   setFilterWallet(
  //     formik.values.tokens.filter(
  //       (m: MinimaToken) =>
  //         containsText(
  //           typeof m.token == "string"
  //             ? m.token
  //             : typeof m.token.name == "string"
  //             ? m.token.name
  //             : null,
  //           filterText
  //         ) || containsText(m.tokenid, filterText)
  //     )
  //   );
  // }, [formik.values.tokens, filterText]);

  return (
    <>
      <div className="flex flex-col">
        <img />
        <div>
          <h1>Minima</h1>
          <p>24.99</p>
        </div>
      </div>
      {/* <DropDownContainer> */}
      {/* <DropDownHeader onClick={() => setOpen}>
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
                  src={
                    selectedOption.tokenid === MINIMA__TOKEN_ID
                      ? MinimaLogoSquare
                      : selectedOption.token.url &&
                        selectedOption.token.url.length
                      ? selectedOption.token.url
                      : `https://robohash.org/${selectedOption.tokenid}`
                  }
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
                  <MiTokenAmount>{selectedOption.sendable}</MiTokenAmount>
                </Stack>
              </MiTokenListItem>
              <MiArrow size={10} color="black" />
            </>
          )}
          {!selectedOption && <p>No token selected.</p>}
        </DropDownHeader> */}

      {/* {isOpen &&
          createPortal(
            <div className={styles["grid"]}>
              <header></header>

              <main>
                <section className={"!h-screen"}>
                  <FadeIn isOpen={isOpen}>
                    <div className={styles["backdrop"]} />
                  </FadeIn>
                  <SlideUp isOpen={isOpen}>
                    <DropDownListContainer>
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
                                onClick={() => {
                                  if (t.sendable === "0") {
                                    return;
                                  }
                                  onOptionClicked(t);
                                }}
                                className={
                                  t.sendable === "0" ? styles["disabled"] : ""
                                }
                              >
                                <Avatar
                                  sx={{
                                    width: "56px",
                                    height: "56px",
                                    background: "#fff",
                                  }}
                                  className={styles["avatar"]}
                                  variant="rounded"
                                  src={
                                    t.tokenid === MINIMA__TOKEN_ID
                                      ? MinimaLogoSquare
                                      : t.token.url && t.token.url.length
                                      ? t.token.url
                                      : `https://robohash.org/${t.tokenid}`
                                  }
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
                                  <MiTokenAmount>{t.sendable}</MiTokenAmount>
                                </Stack>
                              </MiTokenListItem>
                            ))}
                          </DropDownList>
                        </Scroller>
                      </Stack>
                    </DropDownListContainer>
                  </SlideUp>
                </section>
              </main>

              <footer></footer>
            </div>,
            document.body
          )} */}
      {/* </DropDownContainer> */}
    </>
  );
};

export default MiSelect;
