"use client";

import { useWebSocket } from "@/contexts/WebSocketContext";
import { Card, List, Tag, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface WorkflowRun {
  id: string;
  status: string;
  conclusion: string;
  name: string;
  repository: string;
  head_branch: string;
  head_sha: string;
  run_number: number;
  run_attempt: number;
  created_at: string;
  updated_at: string;
}

export function WorkflowProgress() {
  const { socket, isConnected } = useWebSocket();
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("workflow_update", (data: WorkflowRun) => {
      setWorkflows((prev) => {
        const index = prev.findIndex((w) => w.id === data.id);
        if (index === -1) {
          return [data, ...prev];
        }
        const newWorkflows = [...prev];
        newWorkflows[index] = data;
        return newWorkflows;
      });
    });

    return () => {
      socket.off("workflow_update");
    };
  }, [socket]);

  const getStatusColor = (status: string, conclusion: string) => {
    if (status === "completed") {
      return conclusion === "success" ? "success" : "error";
    }
    if (status === "in_progress") return "processing";
    return "default";
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="m-0">
            Workflow Progress
          </Title>
          <Tag color={isConnected ? "success" : "error"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Tag>
        </div>
      }
      className="w-full"
    >
      <List
        dataSource={workflows}
        renderItem={(workflow) => (
          <List.Item>
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Text strong>{workflow.name}</Text>
                  <Text className="ml-2 text-gray-500">
                    #{workflow.run_number}
                  </Text>
                </div>
                <Tag
                  color={getStatusColor(workflow.status, workflow.conclusion)}
                >
                  {workflow.status === "completed"
                    ? workflow.conclusion
                    : workflow.status}
                </Tag>
              </div>
              <div className="text-sm text-gray-500">
                <div>Repository: {workflow.repository}</div>
                <div>Branch: {workflow.head_branch}</div>
                <div>SHA: {workflow.head_sha.substring(0, 7)}</div>
                <div>
                  Started: {new Date(workflow.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
