import React from "react";
import styled from "@emotion/styled";
import { setPage } from "../../../redux/slices/app/introSlice";

import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";

import MiPagination from "../../helper/layout/MiPagination";
import MiColoredOverlay from "../../helper/layout/MiColoredOverlay";
import MiSwipeableCarousel from "../../helper/layout/carousel/MiCarousel";

import ForYourSelf from "../../intro/ForYourSelf";
import LockUpFundsNow from "../../intro/LockUpFundsNow";
import UnlockTheFuture from "../../intro/UnlockTheFuture";
import ToSaveInvestSecure from "../../intro/ToSaveInvestSecure";

export const displayIntroPages = [
  <LockUpFundsNow />,
  <ForYourSelf />,
  <ToSaveInvestSecure />,
  <UnlockTheFuture />,
];
const Intro = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <MiColoredOverlay color="light-orange" center={true}>
      <MiSwipeableCarousel />

      <MiIntroActionsContainer>
        <MiIntroActionsButton
          onClick={() => {
            navigate("/instructions");
            dispatch(setPage(-1));
          }}
        >
          Instructions
        </MiIntroActionsButton>

        <MiIntroSkipButton onClick={() => dispatch(setPage(-1))}>
          Skip
        </MiIntroSkipButton>
      </MiIntroActionsContainer>
    </MiColoredOverlay>
  );
};

export default Intro;

const MiIntroTitle = styled("div")`
  font-weight: 700;
  font-size: 2rem;
  line-height: 40px;
  margin-top: 5%;
  text-align: center;
  letter-spacing: 0.02em;

  color: #ffffff;
`;

const MiIntroActionsButton = styled("button")`
  background: #fff;
  color: #363a3f;
  border: none;
  border-radius: 6px;
  height: 54px;

  font-weight: 800;
  font-size: 1.125rem;
  line-height: 21px;
  width: 100%;
  text-align: center;

  cursor: pointer;

  :hover {
    transform: scale(0.989);
    background: rgba(255, 255, 255, 0.99);
  }
`;

const MiIntroSkipButton = styled("div")`
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 30px;
  background: none;
  cursor: pointer;
  text-align: center;
  color: #ffffff;

  border-bottom: 1px solid #fff;
  min-width: 25vw;

  :hover {
    transform: scale(0.989);
  }
`;

const MiIntroActionsContainer = styled("div")`
  margin-top: 92px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: relative;

  margin: 0 32px;

  > :nth-of-type(1) {
    margin-top: 37px;
  }

  > :nth-of-type(2) {
    margin-top: 8px;
  }
`;

export {
  MiIntroActionsButton,
  MiIntroSkipButton,
  MiIntroTitle,
  MiIntroActionsContainer,
};
