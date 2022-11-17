import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./styling/BottomNavigation.module.css";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectMenuStateStatus,
  toggleState,
  updateState,
} from "../../../redux/slices/app/menuSlice";

const dataTestIds = {
  send: 'MiNavigation__send',
  future: 'MiNavigation__future',
  menu: 'MiNavigation__menu',
}

const MiNavigation = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const selectMenuState = useAppSelector(selectMenuStateStatus);

  const toggleNavigation = (page: string) => {
    navigate(page);
    // close Menu
    dispatch(toggleState(false));
  };

  return (
    <BottomNavigation
      className={styles["container"]}
      showLabels
      onChange={(evt, newValue) => setValue(newValue)}
    >
      <BottomNavigationAction
        className={styles["font"]}
        label="Send"
        data-testid={dataTestIds.send}
        onClick={() => toggleNavigation("/send")}
        sx={{
          color:
            location.pathname === "/send" && !selectMenuState
              ? "#FF7358!important"
              : "#16181C",
        }}
        icon={<SendIcon size={24} />}
      />
      <BottomNavigationAction
        className={styles["font"]}
        label="Future"
        data-testid={dataTestIds.future}
        onClick={() => toggleNavigation("/future")}
        sx={{
          color:
            location.pathname === "/future" && !selectMenuState
              ? "#FF7358!important"
              : "#16181C",
        }}
        icon={<FutureIcon size={24} />}
      />
      {!selectMenuState ? (
        <BottomNavigationAction
          className={styles["font"]}
          label="Menu"
          data-testid={dataTestIds.menu}
          sx={{ color: "#16181C" }}
          onClick={() => dispatch(toggleState(true))}
          icon={<MenuIcon size={24} />}
        />
      ) : (
        <BottomNavigationAction
          className={styles["font"]}
          label="Close"
          sx={{ color: "#FF7358!important" }}
          onClick={() => dispatch(toggleState(false))}
          icon={<DismissIcon size={24} />}
        />
      )}
    </BottomNavigation>
  );
};

export default MiNavigation;

const SendIcon = ({ size }: any) => {
  const location = useLocation();
  const selectMenuState = useAppSelector(selectMenuStateStatus);
  return (
    <svg
      width="24"
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1165_7687)">
        <path
          d="M3.4082 20V4L22.4082 12L3.4082 20ZM4.9082 17.675L18.5082 12L4.9082 6.25V10.45L10.9582 12L4.9082 13.5V17.675ZM4.9082 17.675V6.25V13.5V17.675Z"
          fill={
            location.pathname === "/send" && !selectMenuState
              ? "#FF7358"
              : "#91919D"
          }
        />
      </g>
      <defs>
        <clipPath id="clip0_1165_7687">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
const FutureIcon = ({ size }: any) => {
  const location = useLocation();

  const selectMenuState = useAppSelector(selectMenuStateStatus);

  return (
    <svg
      width="24"
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1165_7693)">
        <path
          d="M15.125 16.075L11.275 12.275V6.925H12.775V11.65L16.2 15L15.125 16.075ZM12.075 21C10.825 21 9.65 20.7625 8.55 20.2875C7.45 19.8125 6.4875 19.1667 5.6625 18.35C4.8375 17.5333 4.1875 16.575 3.7125 15.475C3.2375 14.375 3 13.2 3 11.95C3 10.7 3.2375 9.53333 3.7125 8.45C4.1875 7.36667 4.8375 6.42083 5.6625 5.6125C6.4875 4.80417 7.45 4.16667 8.55 3.7C9.65 3.23333 10.825 3 12.075 3C13.4083 3 14.6708 3.29167 15.8625 3.875C17.0542 4.45833 18.0833 5.25833 18.95 6.275V3.625H20.45V8.825H15.225V7.325H17.85C17.1167 6.475 16.2542 5.79167 15.2625 5.275C14.2708 4.75833 13.2083 4.5 12.075 4.5C9.99167 4.5 8.20833 5.2125 6.725 6.6375C5.24167 8.0625 4.5 9.80833 4.5 11.875C4.5 13.9917 5.23333 15.7917 6.7 17.275C8.16667 18.7583 9.95833 19.5 12.075 19.5C14.1583 19.5 15.9167 18.7667 17.35 17.3C18.7833 15.8333 19.5 14.0583 19.5 11.975H21C21 14.475 20.1333 16.6042 18.4 18.3625C16.6667 20.1208 14.5583 21 12.075 21Z"
          fill={
            location.pathname === "/future" && !selectMenuState
              ? "#FF7358"
              : "#91919D"
          }
        />
      </g>
      <defs>
        <clipPath id="clip0_1165_7693">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
const MenuIcon = ({ size }: any) => {
  const location = useLocation();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height={size}
      viewBox="0 0 25 24"
      fill="none"
    >
      <g clipPath="url(#clip0_1493_12826)">
        <path
          d="M3.5625 18.2617V16.7617H21.5625V18.2617H3.5625ZM3.5625 13.0117V11.5117H21.5625V13.0117H3.5625ZM3.5625 7.76172V6.26172H21.5625V7.76172H3.5625Z"
          fill={location.pathname === "/menu" ? "#FF7358" : "#91919D"}
        />
      </g>
      <defs>
        <clipPath id="clip0_1493_12826">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5625)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
interface IProps {
  color?: string;
  size: number;
}
const DismissIcon = ({ size, color = "#FF6B4E" }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height={size}
      viewBox="0 0 14 15"
    >
      <path
        d="M1.2248 14.6383L0.174805 13.5883L5.9498 7.81328L0.174805 2.03828L1.2248 0.988281L6.9998 6.76328L12.7748 0.988281L13.8248 2.03828L8.0498 7.81328L13.8248 13.5883L12.7748 14.6383L6.9998 8.86328L1.2248 14.6383Z"
        fill="#FF6B4E"
      />
    </svg>
  );
};
