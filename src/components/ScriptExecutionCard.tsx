import { Button, Card, Space, Select, Form } from "antd";
import {
  PlayCircleOutlined,
  SyncOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

interface ScriptExecutionCardProps {
  loading: string | null;
  onScriptExecution: (scriptName: string, params: BuildParams) => void;
}

interface BuildParams {
  appName: string;
  type: string;
  env: string;
}

export const ScriptExecutionCard = ({
  loading,
  onScriptExecution,
}: ScriptExecutionCardProps) => {
  const [buildParams, setBuildParams] = useState<BuildParams>({
    appName: "",
    type: "",
    env: "",
  });

  const handleBuild = () => {
    onScriptExecution("build-app", buildParams);
  };

  return (
    <Card title="Build Application" className="shadow-md">
      <Space direction="vertical" className="w-full" size="large">
        <Form layout="vertical">
          <Form.Item label="Application" required>
            <Select
              placeholder="Select application"
              value={buildParams.appName}
              onChange={(value) =>
                setBuildParams({ ...buildParams, appName: value })
              }
            >
              <Option value="asvab">Asvab</Option>
              <Option value="cdl">CDL</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Type" required>
            <Select
              placeholder="Select type"
              value={buildParams.type}
              onChange={(value) =>
                setBuildParams({ ...buildParams, type: value })
              }
            >
              <Option value="state">State</Option>
              <Option value="single">Single</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Environment" required>
            <Select
              placeholder="Select environment"
              value={buildParams.env}
              onChange={(value) =>
                setBuildParams({ ...buildParams, env: value })
              }
            >
              <Option value="prod">Production</Option>
              <Option value="staging">Staging</Option>
              <Option value="dev">Development</Option>
            </Select>
          </Form.Item>
        </Form>

        <Button
          type="primary"
          icon={<BuildOutlined />}
          onClick={handleBuild}
          loading={loading === "build-app"}
          block
          disabled={
            !buildParams.appName || !buildParams.type || !buildParams.env
          }
        >
          Build Application
        </Button>
      </Space>
    </Card>
  );
};
