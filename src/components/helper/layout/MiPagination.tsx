import { Stack } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setPage, selectPageSelector } from "../../../redux/slices/app/introSlice";
import MiPaginationIcon from "./svgs/MiPaginationIcon";
import styles from "../layout/styling/intro/index.module.css";

import { displayIntroPages } from "../../pages/intro/Intro";

type MiPaginationProps = {
    onClick?: Function;
};

const MiPagination: React.FC<MiPaginationProps> = ({ onClick }) => {
  const dispatch = useAppDispatch();
  const selectIntroPage = useAppSelector(selectPageSelector);

  const onClickHandler = (currPage: number) => {
      if (onClick) {
          onClick(currPage)
      } else {
          dispatch(setPage(currPage));
      }
  };

  return (
    <div className={styles["root"]}>
      <Stack flexDirection="row" alignItems="center" justifyContent="center">
        {displayIntroPages.map((p, i) => (
          <MiPaginationIcon
            key={"MiPaginationIcon-" + i}
            onClickHandler={() => onClickHandler(i)}
            fill={selectIntroPage === i ? "#16181C" : "#FFDCD5"}
          />
        ))}
      </Stack>
    </div>
  );
};

export default MiPagination;
