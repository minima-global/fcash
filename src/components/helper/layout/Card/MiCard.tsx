import styles from "./Card.module.css";

const MiCard = ({ children, extraClass }: any) => {
  let base = `${styles.card} ${extraClass}`;

  return (
    <div className={base}>
      <div>{children}</div>
    </div>
  );
};

export default MiCard;
