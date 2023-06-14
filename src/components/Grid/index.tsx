import useGetInnerHeight from "../../hooks/useGetInnerHeight";
import styles from "./Grid.module.css";

interface IProps {
  header: any;
  content: any;
  footer: any;

  fullHeight?: boolean;
}
const Grid = ({ header, content, footer, fullHeight = false }: IProps) => {
  const innerHeight = useGetInnerHeight();

  return (
    <div className={styles["grid"]} style={{ height: ` ${innerHeight}px` }}>
      <header>{header}</header>

      <main>
        <section className={fullHeight ? "!h-screen" : ""}>{content}</section>
      </main>

      <footer>{footer}</footer>
    </div>
  );
};

export default Grid;
