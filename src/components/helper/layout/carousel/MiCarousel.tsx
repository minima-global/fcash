import React from "react";
import { Box } from "@mui/material";

import ForYourSelf from "../../../intro/ForYourSelf";
import LockUpFundsNow from "../../../intro/LockUpFundsNow";
import ToSaveInvestSecure from "../../../intro/ToSaveInvestSecure";
import UnlockTheFuture from "../../../intro/UnlockTheFuture";

import styles from "./MiCarousel.module.css";
import { useAppDispatch } from "../../../../redux/hooks";
import { setPage } from "../../../../redux/slices/app/introSlice";
import MiPagination from "../MiPagination";
import smoothScroll from "../../smoothScroll";

const MiSwipeableCarousel = () => {
  const ref = React.useRef<any>();
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [numberOfSlides, setNumberOfSlide] = React.useState(0);

  React.useEffect(() => {
    const carousel = ref.current;
    const elements = document.querySelectorAll('[data-slide]');
    const elementIndices: Record<string, number> = {};

    const observer = new IntersectionObserver(function(entries, observer) {
      const activated = entries.reduce(function (max, entry) {
        return (entry.intersectionRatio > max.intersectionRatio) ? entry : max;
      });

      if (activated.intersectionRatio > 0 && activated && activated.target.getAttribute("id")) {
        setCurrentIndex(elementIndices[activated.target.getAttribute("id") as string]);
      }
    }, {
      root: carousel,
      threshold: 0.5,
    });

    for (let i = 0; i < elements.length; i++) {
      if (elements[i].getAttribute("id") as string) {
        const index = elements[i].getAttribute("id");
        elementIndices[index as string] = i;
        observer.observe(elements[i]);
      }
    }

    setNumberOfSlide(Array.from(elements).length);
  }, []);

  React.useEffect(() => {
    dispatch(setPage(currentIndex));
  }, [dispatch, currentIndex]);

  const handleOnClick = (page: number) => {
    const scrollLeft = Math.floor(ref.current.scrollWidth * (page / numberOfSlides));
    smoothScroll(ref.current, scrollLeft, true);
  }

  return (
    <div>
      <Box data-slide-id="parent" ref={ref} className={styles["carousel__container"]}>
        <ul className={styles["carousel__wrapper"]}>
          <li data-slide="1" className={styles["slide"]}>
            <LockUpFundsNow />
          </li>
          <li data-slide="2" className={styles["slide"]}>
            <ForYourSelf />
          </li>
          <li data-slide="3" className={styles["slide"]}>
            <ToSaveInvestSecure />
          </li>
          <li data-slide="4" className={styles["slide"]}>
            <UnlockTheFuture />
          </li>
        </ul>
      </Box>
      <MiPagination onClick={handleOnClick} />
    </div>
  );
};

export default MiSwipeableCarousel;
