import { Stack, styled } from "@mui/material";

import styles from "./Menu.module.css";

import MiSmartContractIcon from "../../helper/layout/svgs/MiSmartContractIcon";
import MiBalance from "../../helper/layout/svgs/MiBalance";
import MiCurrentBlock from "../../helper/layout/svgs/MiCurrentBlock";
import MiInstructions from "../../helper/layout/svgs/MiInstructions";
import { useAppDispatch } from "../../../redux/hooks";
import { updateDisplayChainHeight } from "../../../redux/slices/minima/statusSlice";
import { useNavigate } from "react-router-dom";
import { updateState } from "../../../redux/slices/app/menuSlice";

const BackDrop = styled("div")`
  background: rgba(0, 0, 0, 0.6);
  z-index: 994;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 56px;
`;
const MenuContainer = styled("div")`
  z-index: 995;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 70vh;
  width: 100%;
  background-color: #fff;
  padding: 38px 0px;
  box-shadow: 0px 4px 10px 4px rgba(0, 0, 0, 0.05);
  background: #ffede9;
`;
const MenuTitle = styled("h6")`
  font-family: Manrope-regular;
  font-weight: 700;
  font-size: 2rem;
  line-height: 44px;
  color: #16181c;
  text-align: left;
  padding: 0;
  margin: 0;
  padding-left: 64px;
`;

const MenuList = styled("ul")`
  padding: 0;
  margin: 0;
  > li {
    margin-bottom: 8;
  }
  > :last-of-type {
    margin-bottom: 0;
  }
  > :first-of-type {
    margin-top: 8px;
  }
  padding-left: calc(64px - 16px);
`;

const MenuListItem = styled("li")`
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  padding: 16px;
  padding-left: 16px;
  margin-right: 64px;

  cursor: pointer;
  font-family: Manrope-regular;
  font-weight: 700;
  font-size: 1rem;
  line-height: 20px;
  color: #16181c;

  :hover {
    background: #ffdcd5;
    border-radius: 12px;
  }

  > svg {
    margin-right: 16px;
  }
`;

const Menu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleBlockHeightComponent = () => {
    dispatch(updateDisplayChainHeight(true));
    // close Menu
    dispatch(updateState(false));
  };

  const toggleNavigateBalance = () => {
    // navigate..
    navigate("/wallet");
    // close Menu
    dispatch(updateState(false));
  };

  const toggleNavigateInstructions = () => {
    // navigate..
    navigate("/instructions");
    // close Menu
    dispatch(updateState(false));
  };

  const toggleNavigateSmartContract = () => {
    // navigate..
    navigate("/smartcontract");
    // close Menu
    dispatch(updateState(false));
  };

  return (
    <BackDrop>
      <MenuContainer>
        <MenuTitle>Menu</MenuTitle>
        <MenuList>
          <MenuListItem onClick={toggleNavigateBalance}>
            <MiBalance size={19} color="#16181c" />
            Balance
          </MenuListItem>
          <MenuListItem onClick={toggleBlockHeightComponent}>
            <MiCurrentBlock size={19} color="#16181C" />
            Current block
          </MenuListItem>
          <MenuListItem onClick={toggleNavigateInstructions}>
            <MiInstructions size={19} />
            Instructions
          </MenuListItem>
          <MenuListItem onClick={toggleNavigateSmartContract}>
            <MiSmartContractIcon size={19} color="#16181c" />
            Smart contract
          </MenuListItem>
        </MenuList>
      </MenuContainer>
    </BackDrop>
  );
};
export default Menu;
