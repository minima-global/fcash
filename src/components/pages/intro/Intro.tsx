import { useAppSelector } from "../../../redux/hooks";
import { selectPageSelector } from "../../../redux/slices/app/introSlice";
import ForYourSelf from "../../intro/ForYourSelf";
import LockUpFundsNow from "../../intro/LockUpFundsNow";
import SplashScreen from "../../intro/SplashScreen";
import ToSaveInvestSecure from "../../intro/ToSaveInvestSecure";
import UnlockTheFuture from "../../intro/UnlockTheFuture";

const Intro = () => {
  const selectIntro = useAppSelector(selectPageSelector);

  const displayPage = [
    <SplashScreen />,
    <LockUpFundsNow />,
    <ForYourSelf />,
    <ToSaveInvestSecure />,
    <UnlockTheFuture />,
  ];

  return <>{displayPage[selectIntro.page]}</>;
};

export default Intro;
