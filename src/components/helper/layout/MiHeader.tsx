import { Menu, MenuItem, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import { updateDisplayChainHeight } from "../../../redux/slices/minima/statusSlice";

import styles from "./styling/Header.module.css";
import MiHeaderBlockStatus from "./svgs/MiHeaderBlockStatus";
import MiHeaderOptions from "./svgs/MiHeaderOptions";

const MiHeader = () => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const toggleBlockHeightComponent = () => {
    dispatch(updateDisplayChainHeight(true));
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <header>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          className={styles["content"]}
        >
          <h6 className={styles["font"]}>FutureCash</h6>
          <Stack
            flexDirection="row"
            alignItems="center"
            className={styles["actions"]}
          >
            <MiHeaderBlockStatus onClickHandler={toggleBlockHeightComponent} />
            <MiHeaderOptions onClickHandler={handleClick} />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/instructions");
                }}
              >
                Instructions
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/smartcontract");
                }}
              >
                Smart Contract
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </header>
    </>
  );
};

export default MiHeader;
