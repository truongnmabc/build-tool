"use client";

import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { PlayCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Select } from "antd";
import { useEffect, useState } from "react";

interface App {
  id: string;
  name: string;
}

interface AppSelectProps {
  loading: string | null;
  onStart: (appId: string) => Promise<void>;
}

export function AppSelect({ loading, onStart }: AppSelectProps) {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.APPS.LIST);
        setApps(response.data.data);
      } catch (error) {
        console.error("Failed to fetch apps:", error);
      }
    };

    fetchApps();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleClear = () => {
    setSearchText("");
    form.setFieldValue("appId", undefined);
    setIsFormValid(false);
  };

  const handleStart = async () => {
    try {
      const values = await form.validateFields();
      await onStart(values.appId);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={(_, allValues) => {
        setIsFormValid(!!allValues.appId);
      }}
    >
      <Form.Item
        name="appId"
        label="Select App"
        rules={[{ required: true, message: "Please select an app" }]}
      >
        <Select
          placeholder="Select an app"
          loading={loading === "fetch-apps"}
          showSearch
          onSearch={handleSearch}
          onClear={handleClear}
          filterOption={false}
          options={filteredApps.map((app) => ({
            label: app.name,
            value: app.name,
          }))}
          suffixIcon={<SearchOutlined />}
          allowClear
          notFoundContent={
            <div className="p-2 text-center text-gray-500">No apps found</div>
          }
        />
      </Form.Item>

      <div className="mt-4">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleStart}
          loading={loading === "start"}
          disabled={!isFormValid}
          block
        >
          Start
        </Button>
      </div>
    </Form>
  );
}
