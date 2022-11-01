import { Stack } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectPageSelector } from "../../../redux/slices/app/introSlice";
import MiPaginationIcon from "./svgs/MiPaginationIcon";

import styles from "../layout/styling/intro/index.module.css";
import { setPage } from "../../../redux/slices/app/sendFormSlice";

import { displayIntroPages } from "../../pages/intro/Intro";

const MiPagination = () => {
  const dispatch = useAppDispatch();
  const selectIntro = useAppSelector(selectPageSelector);

  React.useEffect(() => {
    console.log("MiPagination re-rendered");
  }, [dispatch, selectIntro]);

  const onClickHandler = (currPage: number) => {
    console.log("onClick");
    dispatch(setPage(currPage));
  };

  return (
    <div className={styles["root"]}>
      <Stack flexDirection="row" alignItems="center" justifyContent="center">
        {displayIntroPages.map((p, i) => (
          <MiPaginationIcon
            key={"MiPaginationIcon-" + i}
            onClickHandler={() => onClickHandler(i)}
            fill={selectIntro.page == i ? "#FF7358" : "#91919D"}
          />
        ))}
      </Stack>
    </div>
  );
};

export default MiPagination;
