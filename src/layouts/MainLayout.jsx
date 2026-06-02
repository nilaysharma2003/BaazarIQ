import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function MainLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Plus Poppins', sans-serif",
        background: "#f8fafc",
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;