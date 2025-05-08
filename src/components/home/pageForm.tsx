"use client";

import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Button, Card, Form, Input } from "antd";
import { useState } from "react";

interface Page {
  id: string;
  name: string;
  path: string;
  content: string;
}

interface PageFormProps {
  page: Page;
}

export function PageForm({ page }: PageFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleUpdatePage = async (values: any) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.APPS.GET}/${form.getFieldValue("appId")}/pages/${
          values.id
        }`,
        values
      );
      console.log("🚀 ~ handleUpdatePage ~ response:", response.data);
      // Refresh pages list
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card title="Update Page">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdatePage}
        initialValues={{
          name: page?.name,
          path: page?.path,
          content: page?.content,
        }}
      >
        <Form.Item name="name" label="Page Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="path" label="Page Path" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="content"
          label="Page Content"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update Page
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
