"use client";

import { ScriptExecutionCard } from "@/components/ScriptExecutionCard";
import UserProfile from "@/components/UserProfile";
import { WorkflowProgress } from "@/components/WorkflowProgress";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import axiosInstance from "@/lib/axios";
import { Form } from "antd";
import { useState } from "react";

interface BuildParams {
  appName: string;
  type: string;
  env: string;
}

export default function Home() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<string | null>(null);

  const handleScriptExecution = async (
    scriptName: string,
    params?: BuildParams
  ) => {
    try {
      setLoading(scriptName);
      const response = await axiosInstance.post(
        "/api/scripts/build-app",
        params || {}
      );
      console.log("🚀 ~ Home ~ response:", response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <WebSocketProvider>
      <main className="min-h-screen p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tools Admin Dashboard</h1>
          <UserProfile />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8">
            <ScriptExecutionCard
              loading={loading}
              onScriptExecution={handleScriptExecution}
            />
            <WorkflowProgress />
          </div>
        </div>
      </main>
    </WebSocketProvider>
  );
}
