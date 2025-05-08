"use client";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Modal } from "antd";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { UserInfo } from "./userInfo";

export function ProfileMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => setIsModalOpen(true),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => signOut(),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Avatar icon={<UserOutlined />} className="cursor-pointer" />
      </Dropdown>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        title="User Information"
      >
        <UserInfo />
      </Modal>
    </>
  );
}
