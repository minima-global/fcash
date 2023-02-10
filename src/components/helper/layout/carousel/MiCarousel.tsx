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
  const inMotion = React.useRef(false);
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [numberOfSlides, setNumberOfSlide] = React.useState(0);
  const attribute = 'data-slide';

  React.useEffect(() => {
    const elements = document.querySelectorAll('[data-slide]');
    const elementIndices: Record<string, number> = {};

    const observer = new IntersectionObserver(function(entries, observer) {
      if (!inMotion.current) {
        const activated = entries.reduce(function (max, entry) {
          return (entry.intersectionRatio > max.intersectionRatio) ? entry : max;
        });

        if (activated.intersectionRatio > 0 && activated && activated.target.getAttribute(attribute)) {
          setCurrentIndex(elementIndices[activated.target.getAttribute(attribute) as string]);
        }
      }
    }, {
      root: ref.current,
      threshold: 0.5,
    });


    for (let i = 0; i < elements.length; i++) {
      if (elements[i].getAttribute(attribute) as string) {
        const index = elements[i].getAttribute(attribute);
        elementIndices[index as string] = i;

        observer.observe(elements[i]);
      }
    }

    return () => {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute(attribute) as string) {
          const index = elements[i].getAttribute(attribute);
          elementIndices[index as string] = i;

          observer.unobserve(elements[i]);
        }
      }
    }
  }, []);

  // sets number of slides as a usable variable
  React.useEffect(() => {
    const elements = document.querySelectorAll('[data-slide]');
    setNumberOfSlide(Array.from(elements).length);
  }, []);

  React.useEffect(() => {
    dispatch(setPage(currentIndex));
  }, [dispatch, currentIndex]);

  const handleOnClick = (page: number) => {
    inMotion.current = true;
    const scrollLeft = Math.floor(ref.current.scrollWidth * (page / numberOfSlides));
    smoothScroll(ref.current, scrollLeft, true);
    dispatch(setPage(page));
    setTimeout(() => {
      inMotion.current = false;
    }, 2000);
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
