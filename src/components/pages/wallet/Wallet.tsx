import { useAppSelector } from "../../../redux/hooks";
import { selectBalance } from "../../../redux/slices/minima/balanceSlice";

const Wallet = () => {
  const walletTokens = useAppSelector(selectBalance);

  return <div>Wallet</div>;
};

export default Wallet;
