import { Button, Card, Form, Input, Select } from "antd";
import { PullRequestOutlined } from "@ant-design/icons";

const { Option } = Select;

interface PRCreationCardProps {
  loading: string | null;
  onPRCreation: (values: any) => void;
  form: any;
}

export const PRCreationCard = ({
  loading,
  onPRCreation,
  form,
}: PRCreationCardProps) => {
  return (
    <Card title="Create Pull Request" className="shadow-md">
      <Form form={form} layout="vertical" onFinish={onPRCreation}>
        <Form.Item
          name="sourceBranch"
          label="Source Branch"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g., feature/update-tools" />
        </Form.Item>

        <Form.Item
          name="targetBranch"
          label="Target Branch"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g., main" />
        </Form.Item>

        <Form.Item name="title" label="PR Title" rules={[{ required: true }]}>
          <Input placeholder="Enter PR title" />
        </Form.Item>

        <Form.Item name="labels" label="Labels" rules={[{ required: true }]}>
          <Select mode="multiple" placeholder="Select labels">
            <Option value="build:tools">build:tools</Option>
            <Option value="build:web">build:web</Option>
            <Option value="build:admin">build:admin</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<PullRequestOutlined />}
            htmlType="submit"
            loading={loading === "pr"}
            block
          >
            Create Pull Request
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
