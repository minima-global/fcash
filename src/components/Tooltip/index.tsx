import { useEffect } from "react";
import useDrawerAnimation from "../../hooks/useDrawerAnimation";
import styles from "./Tooltip.module.css";

interface IProps {
  active: boolean;
  content: string;
  position: number;
  onClose?: any;
}
const Tooltip = ({ onClose, active, content, position }: IProps) => {

  const {setActive, animated, springProps, dropdownRef} = useDrawerAnimation(onClose);

  useEffect(() => {
    setActive(active);
  }, [active])

  return (    
    <div ref={dropdownRef} className="relative">
      {active &&
        <animated.div style={springProps} className="break-words z-[20] absolute bg-white p-2 shadow-lg shadow-gray-300 top-0 left-0 max-w text-xs font-bold text-center">
          {content}
          <div
            className={styles["tooltip-hook"]}
            style={{ left: position+3 + "px" }}
          ></div>
        </animated.div>    
      }
    </div>
  );
};

export default Tooltip;
