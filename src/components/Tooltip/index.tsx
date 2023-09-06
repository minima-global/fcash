import styles from "./Tooltip.module.css";

interface IProps {
  content: string;
  position: number;
}
const Tooltip = ({ content, position }: IProps) => {
  return (
    <div className={styles["tooltip"]}>
      {content}
      <div
        className={styles["tooltip-hook"]}
        style={{ left: position + "px" }}
      ></div>
    </div>
  );
};

export default Tooltip;
