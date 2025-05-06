"use client";

import { Button } from "antd";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const handleSignIn = async () => {
    await signIn("github", { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-8 text-2xl font-bold">Welcome to Tools Admin</h1>
        <Button type="primary" size="large" onClick={handleSignIn}>
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
