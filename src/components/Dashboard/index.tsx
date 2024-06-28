import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import useGetInnerHeight from "../../hooks/useGetInnerHeight";
import styles from "./Grid.module.css";
import useIsMinimaBrowser from "../../hooks/useIsMinimaBrowser";
import Menu from "../pages/menu/Menu";
import { appContext } from "../../AppContext";
import RefreshIcon from "../UI/Icons/RefreshIcon";
import SendIcon from "../UI/Icons/SendIcon";
import MenuIcon from "../UI/Icons/MenuIcon";
import CloseIcon from "../UI/Icons/CloseIcon";

const Dashboard = () => {
  const innerHeight = useGetInnerHeight();
  const openTitleBar = useIsMinimaBrowser();

  const location = useLocation();
  const navigate = useNavigate();

  const { displayMenu, setDisplayMenu } = useContext(appContext);

  const isActive = (_current: string) => {
    return location.pathname.includes(_current)
      ? "!text-sky-500"
      : "";
  };

  return (
    <div className={styles["grid"]} style={{ height: `${innerHeight}px` }}>
      <header
        className="bg-futurecash text-[15px] flex pl-4 items-center gap-2 text-white font-bold"
        onClick={openTitleBar}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 38 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.231 23.9854L10.0153 20.0298L8.74902 27.9844L7.48145 35.9377L14.9634 31.94L22.4454 27.9411L16.231 23.9854Z"
            fill="white"
          />
          <path
            d="M6.33401 0.16626L0 39.9354L7.48196 35.9377L10.0158 20.0298L11.2834 12.0765L29.9278 23.9434L37.4098 19.9444L6.33401 0.16626Z"
            fill="white"
          />
        </svg>
        <span className="font-bold tracking-wider">Future Cash</span>
      </header>

      <main>
        <section>
          <Outlet />
        </section>
      </main>

      <footer className="bg-black grid grid-cols-[1fr_minmax(0,_560px)_1fr]">
        <div />
        <nav className={`grid grid-cols-3 ${displayMenu && "grid-cols-1"}`}>
          {!displayMenu && (
            <>
              <div onClick={() => navigate("/dashboard/send")} className={`text-white font-bold flex flex-col items-center my-auto ${isActive("/dashboard/send")}`}>
                <SendIcon />
                Send</div>
              <div onClick={() => navigate("/dashboard/future#pending")} className={`text-white font-bold flex flex-col items-center my-auto ${isActive("/dashboard/future")}`}>
                <RefreshIcon fill="currentColor" extraClass="" />
                Future
              </div>
            </>
          )}
          {displayMenu &&          
          <div/>
          }
          <div onClick={() => setDisplayMenu((prevState: boolean) => !prevState)} className="z-[60] text-white font-bold flex flex-col items-center my-auto">
            {!displayMenu && <MenuIcon fill="currentColor" extraClass="" />}
            {displayMenu && <CloseIcon fill="currentColor" extraClass="" />}
            {!displayMenu && "Menu"}
            {displayMenu && "Close"}
          </div>
        </nav>
        <div />
      </footer>

      <Menu />
    </div>
  );
};

export default Dashboard;
