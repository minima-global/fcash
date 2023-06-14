import styles from "./styling/ColoredOverlay.module.css";

const MiColoredOverlay = ({ children }: any) => {
  const base = `${styles.grid}`;

  return (
    <>
      <div className={styles["backdrop"]} />
      <div className={base}>
        <header />
        <main>
          <section>{children}</section>
        </main>
      </div>
    </>
  );
};

export default MiColoredOverlay;
