"use client";


import useAuthStore from "../store/authstore";
import LoginPage from "./_components/Login";
import HeaderPage from "./_components/header";

export default function Home() {
  const { isLoggedIn, login } = useAuthStore();

  return (
    <>
      {!isLoggedIn ? <LoginPage onLoginSuccess={login} /> : <HeaderPage />}
    </>
  );
}
