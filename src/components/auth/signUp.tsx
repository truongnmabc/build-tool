"use client";

import { Button, Card, Form, Input } from "antd";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const handleSubmit = async (values: any) => {
    await signIn("credentials", {
      ...values,
      callbackUrl: "/",
    });
  };

  return (
    <Card title="Sign In" className="max-w-md mx-auto mt-8">
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
