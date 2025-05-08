"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { Card, Progress, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const { Title, Text } = Typography;

interface BuildProgressData {
  status: string;
  progress: number;
  message: string;
}

export function BuildProgress() {
  const [buildProgress, setBuildProgress] = useState<BuildProgressData>({
    status: "pending",
    progress: 0,
    message: "Initializing build...",
  });

  useEffect(() => {
    const socket = io({
      path: "/api/ws",
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("build-progress", (data: BuildProgressData) => {
      setBuildProgress(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "success";
      case "error":
        return "exception";
      case "pending":
        return "active";
      default:
        return "normal";
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <Title level={3} className="mb-2">
            Build Progress
          </Title>
          <Text type="secondary">Current status of your build process</Text>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Text strong>Progress</Text>
            <Text type="secondary">{buildProgress.progress}%</Text>
          </div>

          <Progress
            percent={buildProgress.progress}
            status={getStatusColor(buildProgress.status) as any}
            className="mb-4"
          />

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Text strong>Status:</Text>
              <Text>{buildProgress.status}</Text>
              {buildProgress.status === "pending" && (
                <LoadingOutlined className="text-blue-500" />
              )}
            </div>
            <Text type="secondary">{buildProgress.message}</Text>
          </div>
        </div>
      </Space>
    </Card>
  );
}
