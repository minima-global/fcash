import { useState, useContext, useEffect } from "react";
import { MinimaToken } from "../../minima/@types/minima";
import { appContext } from "../../AppContext";
import { containsText } from "../../utils";
import { useFormikContext } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDrawerAnimation from "../../hooks/useDrawerAnimation";
import CaretIcon from "../UI/Icons/CaretIcon";

const WalletSelect = () => {
  const formik: any = useFormikContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { active, toggleDrawer, animated, springProps, dropdownRef } =
    useDrawerAnimation();
  const [searchText, setSearchText] = useState("");
  const { wallet: balance } = useContext(appContext);

  const { token: currentSelectedToken } = formik.values;

  const handleSelection = (id: string) => {
    try {
      navigate("/dashboard/send?tokenid="+id);
      toggleDrawer();
    } catch (error) {
      console.error(error);
      // do something
    }
  };


  useEffect(() => {

    if (!balance) return;

    const requestingToken = searchParams.get("tokenid");
    const requestingAmount = searchParams.get("amount");
    const requestingBurn = searchParams.get("burn");

    if (requestingToken) {
      formik.setFieldValue("token", balance.find((t:any) => t.tokenid === requestingToken));
    } else {
      navigate("?tokenid=0x00");
      formik.setFieldValue("token", balance[0]);    
    }
    
    if (requestingAmount) {      
      formik.setFieldValue("amount", requestingAmount);
    }
    
    if (requestingBurn) {      
      formik.setFieldValue("burn", requestingBurn);
    }

  }, [
    balance,
    searchParams
  ]);

  return (
    <>
      <div ref={dropdownRef} className={`relative inline-block w-full ${active && "outline outline-sky-300 rounded-lg"}`}>
        {currentSelectedToken && (
          <div
            onClick={toggleDrawer}
            className="w-full bg-white grid grid-cols-[auto_1fr_auto] overflow-hidden truncate rounded-lg"
          >
            {currentSelectedToken.tokenid === "0x00" && (
              <>
                <img
                  src="./assets/token.svg"
                  alt="minima-token"
                  className="rounded-l-lg w-[56px] h-[56px]"
                />
                <div className="my-auto ml-2 grid">
                  <p className="font-bold p-0 text-base">Minima</p>
                  <input
                    readOnly
                    className="focus:outline-none bg-transparent overflow-hidden truncate text-base"
                    value={
                      currentSelectedToken.unconfirmed !== "0"
                        ? currentSelectedToken.sendable +
                          "/" +
                          currentSelectedToken.unconfirmed
                        : currentSelectedToken.sendable
                    }
                  />
                </div>
              </>
            )}
            {currentSelectedToken.tokenid !== "0x00" && (
              <>
                <img
                  src={
                    "url" in currentSelectedToken.token &&
                    currentSelectedToken.token.url.length
                      ? currentSelectedToken.token.url
                      : `https://robohash.org/${currentSelectedToken.tokenid}`
                  }
                  alt="custom-token"
                  className="rounded-l-lg w-[56px] h-[56px]"
                />
                <div className="my-auto ml-2 grid">
                  <p className="font-bold p-0 text-base">
                    {"name" in currentSelectedToken.token
                      ? currentSelectedToken.token.name
                      : "N/A"}
                  </p>
                  <input
                    readOnly
                    className="focus:outline-none bg-transparent overflow-hidden truncate text-base"
                    value={
                      currentSelectedToken.unconfirmed !== "0"
                        ? currentSelectedToken.sendable +
                          "/" +
                          currentSelectedToken.unconfirmed
                        : currentSelectedToken.sendable
                    }
                  />
                </div>
              </>
            )}

            <span className="my-auto mr-2">
              <CaretIcon
                extraClass={`transition-transform ${active && "rotate-180 "}`}
              />
            </span>
          </div>
        )}

        {active && (
          <animated.div
            style={springProps}
            className="origin-top-right z-[50] w-full absolute right-0 mt-2 rounded-md shadow-lg bg-white border-l-2 border-r-2 border-sky-300"
          >
            <div className="bg-white rounded-lg px-4 py-3">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="search"
                placeholder="Search for token by ID or name"
                className="w-full text-sm p-2 bg-[#1B1B1B] bg-opacity-10 focus:outline focus:outline-sky-300"
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
              ).length === 0 && (
                <div className="text-center">
                  <p className="text-xs py-6 opacity-80 font-bold tracking-wide">
                    No results found
                  </p>
                </div>
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
              ).length > 0 && (
                <ul className="grid gap-2 py-3 max-h-[400px] overflow-y-scroll">
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
                    .map((tkn: any) => (
                      <li onClick={() => handleSelection(tkn.tokenid)} key={tkn.tokenid} className="hover:bg-opacity-20 cursor-pointer grid grid-cols-[auto_1fr] items-center bg-[#1B1B1B] bg-opacity-10 rounded-r-lg">
                        {tkn.tokenid === "0x00" && (
                          <>
                            <img
                              src="./assets/token.svg"
                              alt="minima-token"
                              className="rounded-l-lg w-[56px] h-[56px]"
                            />
                            <div className="my-auto ml-2 grid">
                              <p className="font-bold p-0 text-base">Minima</p>
                              <input
                                readOnly
                                className="focus:outline-none bg-transparent overflow-hidden truncate text-base cursor-pointer"
                                value={
                                  tkn.unconfirmed !== "0"
                                    ? tkn.sendable +
                                      "/" +
                                      tkn.unconfirmed
                                    : tkn.sendable
                                }
                              />
                            </div>
                          </>
                        )}
                        {tkn.tokenid !== "0x00" && (
                          <>
                            <img
                              src={
                                "url" in tkn.token &&
                                tkn.token.url.length
                                  ? tkn.token.url
                                  : `https://robohash.org/${tkn.tokenid}`
                              }
                              alt="custom-token"
                              className="rounded-l-lg w-[56px] h-[56px]"
                            />
                            <div className="my-auto ml-2 grid">
                              <p className="font-bold p-0 text-base">
                                {"name" in tkn.token
                                  ? tkn.token.name
                                  : "N/A"}
                              </p>
                              <input
                                readOnly
                                className="focus:outline-none bg-transparent overflow-hidden truncate text-base cursor-pointer"
                                value={
                                  tkn.unconfirmed !== "0"
                                    ? tkn.sendable +
                                      "/" +
                                      tkn.unconfirmed
                                    : tkn.sendable
                                }
                              />
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </animated.div>
        )}
      </div>      
    </>
  );
};

export default WalletSelect;
