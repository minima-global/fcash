import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

import MiColoredOverlay from "../../helper/layout/MiColoredOverlay";
import MiSwipeableCarousel from "../../helper/layout/carousel/MiCarousel";

import ForYourSelf from "../../intro/ForYourSelf";
import LockUpFundsNow from "../../intro/LockUpFundsNow";
import UnlockTheFuture from "../../intro/UnlockTheFuture";
import ToSaveInvestSecure from "../../intro/ToSaveInvestSecure";

import { CSSTransition } from "react-transition-group";

import styles from "./Intro.module.css";
import Button from "../../UI/Button";

export const displayIntroPages = [
  <LockUpFundsNow />,
  <ForYourSelf />,
  <ToSaveInvestSecure />,
  <UnlockTheFuture />,
];
const Intro = () => {
  const navigate = useNavigate();

  return (
    <>
      <CSSTransition
        in={true}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.backdropEnter,
          enterDone: styles.backdropEnterActive,
          exit: styles.backdropExit,
          exitActive: styles.backdropExitActive,
        }}
      >
        <MiColoredOverlay extraClass="bg-futurecash" center={true}>
          <div className={`${styles.intro_wrapper} mt-8`}>
            <MiSwipeableCarousel />

            <div className={styles["align"]}>
              <div />
              <div className="mt-8">
                <Button
                  extraClass="w-full mb-4 !bg-white !text-black !font-bold"
                  onClick={() => navigate("/dashboard/instructions#send")}
                >
                  Instructions
                </Button>
                <MiIntroActionsContainer>
                  <MiIntroSkipButton
                    onClick={() => navigate("/dashboard/send/0x00")}
                  >
                    Skip
                  </MiIntroSkipButton>
                </MiIntroActionsContainer>
              </div>
              <div />
            </div>
          </div>
        </MiColoredOverlay>
      </CSSTransition>
    </>
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
  background: #ffffff;
  color: #363a3f;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  text-align: center;

  font-weight: 800;
  font-size: 1.125rem;
  line-height: 21px;
  width: 100%;

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
  width: fit-content;

  :hover {
    transform: scale(0.989);
  }
`;

const MiIntroActionsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

export {
  MiIntroActionsButton,
  MiIntroSkipButton,
  MiIntroTitle,
  MiIntroActionsContainer,
};
