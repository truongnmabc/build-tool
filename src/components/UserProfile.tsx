"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session } = useSession();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="px-4 py-2">
          <p className="font-medium">{session?.user?.name}</p>
          <p className="text-sm text-gray-500">{session?.user?.email}</p>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          Logout
        </Button>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
        <Avatar
          src={session?.user?.image}
          icon={<UserOutlined />}
          className="bg-blue-500"
        />
        <span className="hidden md:inline">{session?.user?.name}</span>
      </div>
    </Dropdown>
  );
};

export default UserProfile;
