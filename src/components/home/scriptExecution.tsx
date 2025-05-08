"use client";

import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Card, Form } from "antd";
import { useState } from "react";
import { AppSelect } from "./appSelect";
import ContentPages from "./content";

interface App {
  id: string;
  name: string;
}

interface Page {
  id: string;
  name: string;
  path: string;
  content: string;
}

export function ScriptExecution() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<string | null>(null);
  const [pages, setPages] = useState<Page[]>([]);

  const handleStart = async () => {
    try {
      setLoading("start");
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.APPS.GET}/${form.getFieldValue("appId")}`
      );
      setPages(response.data.pages || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card title="Script Execution" className="shadow-lg">
      <AppSelect loading={loading} onStart={handleStart} />

      <ContentPages pages={pages} />
      {/* {pages.length > 0 && <ContentPages pages={pages} />} */}
    </Card>
  );
}
