import { Card, CardContent } from "@mui/material";
import styles from "./styling/Card.module.css";

const MiCard = ({ children }: any) => {
  return (
    <Card className={styles["card"]} variant="outlined">
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default MiCard;
