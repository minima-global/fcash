import { NavLink, Outlet } from "react-router-dom";
import { useContext } from "react";
import useGetInnerHeight from "../../hooks/useGetInnerHeight";
import styles from "./Grid.module.css";
import useIsMinimaBrowser from "../../hooks/useIsMinimaBrowser";
import Menu from "../pages/Menu/Menu";
import { appContext } from "../../AppContext";

const Dashboard = () => {
  const innerHeight = useGetInnerHeight();
  const openTitleBar = useIsMinimaBrowser();

  const { displayMenu, setDisplayMenu } = useContext(appContext);

  return (
    <div className={styles["grid"]} style={{ height: `${innerHeight}px` }}>
      <header
        className="bg-futurecash text-[15px] flex pl-4 items-center gap-2 text-white font-bold"
        onClick={openTitleBar}
      >
        <svg
          width="38"
          height="40"
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
        Future Cash
      </header>

      <main>
        <section>
          <Outlet />
        </section>
      </main>

      <footer className="bg-black">
        <div />
        <nav>
          {!displayMenu && (
            <NavLink
              to="/dashboard/send"
              className={({ isActive }) =>
                isActive ? styles.active : styles.passive
              }
            >
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_2226_57261"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="25"
                  height="24"
                >
                  <rect x="0.625" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_2226_57261)">
                  <path
                    d="M6.02453 19.6538L4.9707 18.6L16.8207 6.74995H9.87455V5.25H19.3745V14.75H17.8746V7.80378L6.02453 19.6538Z"
                    fill="white"
                  />
                </g>
              </svg>

              <p>Send</p>
            </NavLink>
          )}
          {!displayMenu && (
            <NavLink
              to="/dashboard/future#pending"
              className={({ isActive }) =>
                isActive ? styles.active : styles.passive
              }
            >
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2801_9366)">
                  <path
                    d="M15.125 16.6258L11.275 12.8258V7.47578H12.775V12.2008L16.2 15.5508L15.125 16.6258ZM12.075 21.5508C10.825 21.5508 9.65 21.3133 8.55 20.8383C7.45 20.3633 6.4875 19.7174 5.6625 18.9008C4.8375 18.0841 4.1875 17.1258 3.7125 16.0258C3.2375 14.9258 3 13.7508 3 12.5008C3 11.2508 3.2375 10.0841 3.7125 9.00078C4.1875 7.91745 4.8375 6.97161 5.6625 6.16328C6.4875 5.35495 7.45 4.71745 8.55 4.25078C9.65 3.78411 10.825 3.55078 12.075 3.55078C13.4083 3.55078 14.6708 3.84245 15.8625 4.42578C17.0542 5.00911 18.0833 5.80911 18.95 6.82578V4.17578H20.45V9.37578H15.225V7.87578H17.85C17.1167 7.02578 16.2542 6.34245 15.2625 5.82578C14.2708 5.30911 13.2083 5.05078 12.075 5.05078C9.99167 5.05078 8.20833 5.76328 6.725 7.18828C5.24167 8.61328 4.5 10.3591 4.5 12.4258C4.5 14.5424 5.23333 16.3424 6.7 17.8258C8.16667 19.3091 9.95833 20.0508 12.075 20.0508C14.1583 20.0508 15.9167 19.3174 17.35 17.8508C18.7833 16.3841 19.5 14.6091 19.5 12.5258H21C21 15.0258 20.1333 17.1549 18.4 18.9133C16.6667 20.6716 14.5583 21.5508 12.075 21.5508Z"
                    fill="#91919D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2801_9366">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0 0.550781)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <p>Future</p>
            </NavLink>
          )}
          <NavLink
            to={"/dashboard/menu"}
            onClick={(e: any) => {
              e.preventDefault();

              setDisplayMenu((prevState: boolean) => !prevState);
            }}
            className={() => (displayMenu ? styles.active : styles.passive)}
          >
            {!displayMenu && (
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2801_9372)">
                  <path
                    d="M3 18.8125V17.3125H21V18.8125H3ZM3 13.5625V12.0625H21V13.5625H3ZM3 8.3125V6.8125H21V8.3125H3Z"
                    fill="#91919D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2801_9372">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0 0.550781)"
                    />
                  </clipPath>
                </defs>
              </svg>
            )}

            {!!displayMenu && (
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2806_13180)">
                  <path
                    d="M6.7248 19.2828L5.6748 18.2328L11.4498 12.4578L5.6748 6.68281L6.7248 5.63281L12.4998 11.4078L18.2748 5.63281L19.3248 6.68281L13.5498 12.4578L19.3248 18.2328L18.2748 19.2828L12.4998 13.5078L6.7248 19.2828Z"
                    fill="#FF6B4E"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2806_13180">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5 0.746094)"
                    />
                  </clipPath>
                </defs>
              </svg>
            )}

            <p>{displayMenu ? "Close" : "Menu"}</p>
          </NavLink>
        </nav>
        <div />
      </footer>

      <Menu />
    </div>
  );
};

export default Dashboard;
