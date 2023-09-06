import React, { useContext } from "react";
import { MinimaToken } from "../../../minima/@types/minima";
import { containsText } from "../../../utils";
import FadeIn from "../../UI/Animations/FadeIn";
import { appContext } from "../../../AppContext";
import Input from "../../UI/Input";
import styles from "./Wallet.module.css";

const Wallet = () => {
  const { wallet } = useContext(appContext);
  const [filterText, setFilterText] = React.useState("");
  const [filterWallet, setFilterWallet] = React.useState<MinimaToken[]>([]);

  React.useEffect(() => {
    setFilterWallet(
      wallet.filter(
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
  }, [wallet, filterText]);

  return (
    <FadeIn isOpen={true}>
      <div className={styles["dd"]}>
        <Input
          extraClass={`w-full mt-8`}
          id="search"
          name="search"
          disabled={false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilterText(e.target.value)
          }
          type="search"
          placeholder="Search token"
        />
      </div>
      <ul className="mt-6">
        {wallet
          .filter(
            (t: MinimaToken) =>
              containsText(
                t.tokenid === "0x00"
                  ? t.token
                  : "name" in t.token
                  ? t.token.name
                  : "",
                filterText
              ) || containsText(t.tokenid, filterText)
          )
          .map((t: MinimaToken) => (
            <li
              className="hover:bg-slate-200 hover:cursor-pointer bg-white flex rounded-lg gap-4 truncate mb-4"
              key={t.tokenid}
            >
              {t.tokenid === "0x00" && (
                <svg
                  className="rounded-l-lg"
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
                  className="rounded-l-lg w-[80px] h-[80px]"
                  alt="token-icon"
                  src={
                    "url" in t.token && t.token.url.length
                      ? t.token.url
                      : `https://robohash.org/${t.tokenid}`
                  }
                />
              )}

              <div className="my-auto truncate max-w-[200px]">
                {t.tokenid === "0x00" && (
                  <h6 className="font-bold truncate">Minima</h6>
                )}
                {t.tokenid !== "0x00" && (
                  <h6 className="font-bold">
                    {t.token && "name" in t?.token
                      ? t?.token.name
                      : "Name not available"}
                  </h6>
                )}

                <p className="font-normal truncate">{t.sendable}</p>
              </div>
            </li>
          ))}
        {!wallet.filter(
          (t: MinimaToken) =>
            containsText(
              t.tokenid === "0x00"
                ? t.token
                : "name" in t.token
                ? t.token.name
                : "",
              filterText
            ) || containsText(t.tokenid, filterText)
        ).length && (
          <li>
            <h1 className="text-sm text-center">No results found</h1>
          </li>
        )}
      </ul>
    </FadeIn>
  );
};

export default Wallet;
