import React from "react";
import Spending from "../components/Spending/Spending";
import { Header } from "../components/layout/Header/Header";
import { Layout } from "../components/layout/Layout/Layout";

const SpendingPage = () => {
  return (
    <>
      <Header />
      <Layout>
        <Spending />
      </Layout>
    </>
  );
};

export default SpendingPage;
