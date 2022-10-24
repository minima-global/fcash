import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../theme";

import styles from "./styling/BottomNavigation.module.css";

const MiNavigation = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      className={styles["container"]}
      showLabels
      onChange={(evt, newValue) => setValue(newValue)}
    >
      <BottomNavigationAction
        className={styles["font"]}
        label="Send"
        onClick={() => navigate("/send")}
        icon={<SendIcon size={24} color={theme.palette.primary} />}
      />
      <BottomNavigationAction
        className={styles["font"]}
        label="Future"
        onClick={() => navigate("/future")}
        icon={<FutureIcon size={24} color={theme.palette.primary} />}
      />
      <BottomNavigationAction
        className={styles["font"]}
        label="Balance"
        onClick={() => navigate("/wallet")}
        icon={<BalanceIcon size={24} color={theme.palette.primary} />}
      />
    </BottomNavigation>
  );
};

export default MiNavigation;

const SendIcon = ({ color, size }: any) => {
  return (
    <svg
      width="24"
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1165_7687)">
        <path
          d="M3.4082 20V4L22.4082 12L3.4082 20ZM4.9082 17.675L18.5082 12L4.9082 6.25V10.45L10.9582 12L4.9082 13.5V17.675ZM4.9082 17.675V6.25V13.5V17.675Z"
          fill="#FF7358"
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
const FutureIcon = ({ color, size }: any) => {
  return (
    <svg
      width="24"
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1165_7693)">
        <path
          d="M15.125 16.075L11.275 12.275V6.925H12.775V11.65L16.2 15L15.125 16.075ZM12.075 21C10.825 21 9.65 20.7625 8.55 20.2875C7.45 19.8125 6.4875 19.1667 5.6625 18.35C4.8375 17.5333 4.1875 16.575 3.7125 15.475C3.2375 14.375 3 13.2 3 11.95C3 10.7 3.2375 9.53333 3.7125 8.45C4.1875 7.36667 4.8375 6.42083 5.6625 5.6125C6.4875 4.80417 7.45 4.16667 8.55 3.7C9.65 3.23333 10.825 3 12.075 3C13.4083 3 14.6708 3.29167 15.8625 3.875C17.0542 4.45833 18.0833 5.25833 18.95 6.275V3.625H20.45V8.825H15.225V7.325H17.85C17.1167 6.475 16.2542 5.79167 15.2625 5.275C14.2708 4.75833 13.2083 4.5 12.075 4.5C9.99167 4.5 8.20833 5.2125 6.725 6.6375C5.24167 8.0625 4.5 9.80833 4.5 11.875C4.5 13.9917 5.23333 15.7917 6.7 17.275C8.16667 18.7583 9.95833 19.5 12.075 19.5C14.1583 19.5 15.9167 18.7667 17.35 17.3C18.7833 15.8333 19.5 14.0583 19.5 11.975H21C21 14.475 20.1333 16.6042 18.4 18.3625C16.6667 20.1208 14.5583 21 12.075 21Z"
          fill="#91919D"
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
const BalanceIcon = ({ color, size }: any) => {
  return (
    <svg
      width="24"
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1165_7699)">
        <path
          d="M2 21V19.5H11.25V7.4C10.8167 7.25 10.4292 7.00417 10.0875 6.6625C9.74583 6.32083 9.5 5.93333 9.35 5.5H5.375L8.5 13.05C8.48333 13.8 8.1625 14.4375 7.5375 14.9625C6.9125 15.4875 6.15 15.75 5.25 15.75C4.35 15.75 3.5875 15.4875 2.9625 14.9625C2.3375 14.4375 2.01667 13.8 2 13.05L5.125 5.5H3V4H9.35C9.55 3.41667 9.89167 2.9375 10.375 2.5625C10.8583 2.1875 11.4 2 12 2C12.6 2 13.1417 2.1875 13.625 2.5625C14.1083 2.9375 14.45 3.41667 14.65 4H21V5.5H18.875L22 13.05C21.9833 13.8 21.6625 14.4375 21.0375 14.9625C20.4125 15.4875 19.65 15.75 18.75 15.75C17.85 15.75 17.0875 15.4875 16.4625 14.9625C15.8375 14.4375 15.5167 13.8 15.5 13.05L18.625 5.5H14.65C14.5 5.93333 14.2542 6.32083 13.9125 6.6625C13.5708 7.00417 13.1833 7.25 12.75 7.4V19.5H22V21H2ZM16.875 13H20.625L18.75 8.4L16.875 13ZM3.375 13H7.125L5.25 8.4L3.375 13ZM12 6C12.35 6 12.6458 5.875 12.8875 5.625C13.1292 5.375 13.25 5.08333 13.25 4.75C13.25 4.4 13.1292 4.10417 12.8875 3.8625C12.6458 3.62083 12.35 3.5 12 3.5C11.6667 3.5 11.375 3.62083 11.125 3.8625C10.875 4.10417 10.75 4.4 10.75 4.75C10.75 5.08333 10.875 5.375 11.125 5.625C11.375 5.875 11.6667 6 12 6Z"
          fill="#91919D"
        />
      </g>
      <defs>
        <clipPath id="clip0_1165_7699">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
