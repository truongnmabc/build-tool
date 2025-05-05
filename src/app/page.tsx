"use client";

import { Form, message } from "antd";
import { useState } from "react";
import { ScriptExecutionCard } from "@/components/ScriptExecutionCard";
import { PRCreationCard } from "@/components/PRCreationCard";

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
      const response = await fetch(`/api/scripts/build-app`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params || {}),
      });

      if (!response.ok) throw new Error("Script execution failed");

      console.log("🚀 ~ Home ~ response:", response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Tools Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-8">
        <ScriptExecutionCard
          loading={loading}
          onScriptExecution={handleScriptExecution}
        />
      </div>
    </main>
  );
}
