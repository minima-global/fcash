import useGetInnerHeight from "../../hooks/useGetInnerHeight";
import styles from "./AppGrid.module.css";

const AppGrid = ({ children }: any) => {
  const innerHeight = useGetInnerHeight();

  return (
    <div
      className={`${styles.app_grid}`}
      style={{ height: `${innerHeight}px` }}
    >
      <header />
      <main>
        <section>{children}</section>
      </main>
      <footer />
    </div>
  );
};

export default AppGrid;
