"use client";

import { Descriptions } from "antd";
import { useSession } from "next-auth/react";

export function UserInfo() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <Descriptions column={1}>
      <Descriptions.Item label="Name">{session.user.name}</Descriptions.Item>
      <Descriptions.Item label="Email">{session.user.email}</Descriptions.Item>
    </Descriptions>
  );
}
