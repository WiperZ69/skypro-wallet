import { Header } from "../Header/Header";
import styles from "./Layout.module.scss";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className={styles.layout}>{children}</main>
    </>
  );
};
