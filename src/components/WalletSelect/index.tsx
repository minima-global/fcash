import { useState, useContext, useEffect } from "react";

import styles from "./WalletSelect.module.css";
import { MinimaToken } from "../../minima/@types/minima";

import { CSSTransition } from "react-transition-group";
import { appContext } from "../../AppContext";
import { containsText } from "../../utils";
import { useFormikContext } from "formik";
import Input from "../UI/Input";
import { useSearchParams } from "react-router-dom";

const WalletSelect = () => {
  const { wallet: balance } = useContext(appContext);
  const [searchText, setSearchText] = useState("");
  const [active, setActive] = useState(false);
  const formik: any = useFormikContext();

  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (balance.length && formik.values.token) {
      const currentToken = balance.find(
        (t: MinimaToken) => t.tokenid === formik.values.token.tokenid
      );
      if (currentToken) {
        formik.setFieldValue("token", currentToken);
      }
    }
  }, [balance, formik.values]);

  useEffect(() => {
    const requestingTokenID = searchParams.get("tokenid");
    const requestingAmount = searchParams.get("amount");
    const requestingBurn = searchParams.get("burn");
    if (balance.length) {
      if (requestingTokenID !== null) {
        const fetchToken = balance.find(
          (t: MinimaToken) => t.tokenid === requestingTokenID
        );

        if (fetchToken) {
          formik.setFieldValue("token", fetchToken);
        }
      }
      if (requestingTokenID === null) {
        formik.setFieldValue("token", balance[0]);
      }
    }

    if (requestingAmount !== null) {
      formik.setFieldValue("amount", requestingAmount);
    }

    if (requestingBurn !== null) {
      formik.setFieldValue("burn", requestingBurn);
    }
  }, [
    balance,
    searchParams.get("tokenid"),
    searchParams.get("amount"),
    searchParams.get("burn"),
  ]);

  const handleSelection = (token: MinimaToken) => {
    formik.setFieldValue("token", token);

    setActive(false);
  };

  return (
    <>
      {formik.values.token && (
        <>
          <div
            onClick={() => (formik.isSubmitting ? null : setActive(true))}
            className={`${
              styles.select
            } hover:bg-slate-200 hover:cursor-pointer ${
              formik.isSubmitting ? "bg-slate-50" : ""
            }`}
          >
            {formik.values.token.tokenid === "0x00" && (
              <svg
                width="80"
                height="81"
                viewBox="0 0 80 81"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="80"
                  height="80"
                  transform="translate(0 0.550781)"
                  fill="#08090B"
                />
                <path
                  d="M52.3627 30.187L50.5506 37.9909L48.2331 28.5753L40.1133 25.3689L37.9178 34.8015L35.9836 23.7402L27.8638 20.5508L19.5 56.5508H28.3691L30.9305 45.4895L32.8646 56.5508H41.7512L43.9292 47.1182L46.2467 56.5508H55.1158L60.5 33.3764L52.3627 30.187Z"
                  fill="white"
                />
              </svg>
            )}
            {formik.values.token.tokenid !== "0x00" && (
              <img
                alt="token-icon"
                src={
                  "url" in formik.values.token.token &&
                  formik.values.token.token.url.length
                    ? formik.values.token.token.url
                    : `https://robohash.org/${formik.values.token.tokenid}`
                }
              />
            )}
            <div>
              {formik.values.token.tokenid === "0x00" && <h6>Minima</h6>}
              {formik.values.token.tokenid !== "0x00" && (
                <h6>
                  {formik.values.token && "name" in formik.values.token.token
                    ? formik.values.token.token.name
                    : "Name not available"}
                </h6>
              )}

              <p>{formik.values.token.sendable}</p>
            </div>

            <svg
              className={`${active ? styles.active : ""} my-auto`}
              width="32"
              height="33"
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_2226_53255"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="32"
                height="33"
              >
                <rect y="0.550781" width="32" height="32" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_2226_53255)">
                <path
                  d="M16.0004 20.6172L8.4668 13.0508L9.6668 11.8844L16.0004 18.2172L22.334 11.8844L23.534 13.0844L16.0004 20.6172Z"
                  fill="#08090B"
                />
              </g>
            </svg>
          </div>

          <CSSTransition
            in={!!active}
            unmountOnExit
            timeout={0}
            classNames={{
              enter: styles.backdropEnter,
              enterDone: styles.backdropEnterActive,
              exit: styles.backdropExit,
              exitActive: styles.backdropExitActive,
            }}
          >
            <div className={styles["backdrop"]} />
          </CSSTransition>
          <CSSTransition
            in={!!active}
            unmountOnExit
            timeout={200}
            classNames={{
              enter: styles.ddMenuEnter,
              enterDone: styles.ddMenuEnterActive,
              exit: styles.ddMenuExit,
              exitActive: styles.ddMenuExitActive,
            }}
          >
            <div className={styles["dd"]}>
              <div>
                <h6>Select token</h6>
                <svg
                  onClick={() => setActive(false)}
                  className="cursor-pointer"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.84014 16.5L0.609375 15.2692L7.3786 8.5C4.73506 5.85645 3.25292 4.37432 0.609375 1.73077L1.84014 0.5L8.60937 7.26923L15.3786 0.5L16.6094 1.73077L9.84014 8.5L16.6094 15.2692L15.3786 16.5L8.60937 9.73077L1.84014 16.5Z"
                    fill="#08090B"
                  />
                </svg>
              </div>
              <Input
                extraClass="w-full"
                id="search"
                name="search"
                disabled={false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchText(e.target.value)
                }
                type="search"
                placeholder="Search token"
              />

              {balance.filter(
                (t: MinimaToken) =>
                  containsText(
                    t.tokenid === "0x00"
                      ? t.token
                      : "name" in t.token
                      ? t.token.name
                      : "",
                    searchText
                  ) || containsText(t.tokenid, searchText)
              ).length > 0 && (
                <ul>
                  {balance
                    .filter(
                      (t: MinimaToken) =>
                        containsText(
                          t.tokenid === "0x00"
                            ? t.token
                            : "name" in t.token
                            ? t.token.name
                            : "",
                          searchText
                        ) || containsText(t.tokenid, searchText)
                    )
                    .map((t: MinimaToken) => (
                      <li
                        className="hover:bg-slate-200 hover:cursor-pointer"
                        key={t.tokenid}
                        onClick={() => handleSelection(t)}
                      >
                        {t.tokenid === "0x00" && (
                          <svg
                            width="80"
                            height="81"
                            viewBox="0 0 80 81"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="80"
                              height="80"
                              transform="translate(0 0.550781)"
                              fill="#08090B"
                            />
                            <path
                              d="M52.3627 30.187L50.5506 37.9909L48.2331 28.5753L40.1133 25.3689L37.9178 34.8015L35.9836 23.7402L27.8638 20.5508L19.5 56.5508H28.3691L30.9305 45.4895L32.8646 56.5508H41.7512L43.9292 47.1182L46.2467 56.5508H55.1158L60.5 33.3764L52.3627 30.187Z"
                              fill="white"
                            />
                          </svg>
                        )}
                        {t.tokenid !== "0x00" && (
                          <img
                            alt="token-icon"
                            src={
                              "url" in t.token && t.token.url.length
                                ? t.token.url
                                : `https://robohash.org/${t.tokenid}`
                            }
                          />
                        )}

                        <div>
                          {t.tokenid === "0x00" && <h6>Minima</h6>}
                          {t.tokenid !== "0x00" && (
                            <h6>
                              {t.token && "name" in t?.token
                                ? t?.token.name
                                : "Name not available"}
                            </h6>
                          )}

                          <p>{t.sendable}</p>
                        </div>
                      </li>
                    ))}
                </ul>
              )}

              {balance.filter(
                (t: MinimaToken) =>
                  containsText(
                    t.tokenid === "0x00"
                      ? t.token
                      : "name" in t.token
                      ? t.token.name
                      : "",
                    searchText
                  ) || containsText(t.tokenid, searchText)
              ).length === 0 && (
                <div>
                  <p className={styles["no-contracts"]}>No results</p>
                </div>
              )}
            </div>
          </CSSTransition>
        </>
      )}
    </>
  );
};

export default WalletSelect;
