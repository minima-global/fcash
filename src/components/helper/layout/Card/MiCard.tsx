import styles from "./Card.module.css";

const MiCard = ({ children }: any) => {
  return (
    <div className={styles["card"]}>
      <div>{children}</div>
    </div>
  );
};

export default MiCard;
