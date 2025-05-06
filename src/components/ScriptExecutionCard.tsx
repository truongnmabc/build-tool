import axiosInstance from "@/lib/axios";
import { BuildOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

interface ScriptExecutionCardProps {
  loading: string | null;
  onScriptExecution: (scriptName: string, params: BuildParams) => void;
}

interface BuildParams {
  appName: string;
  type: string;
  env: string;
  domain: string;
}

interface AppConfig {
  key: string;
  shortName: string;
  name: string;
  hasState: boolean;
}

export const ScriptExecutionCard = ({
  loading,
  onScriptExecution,
}: ScriptExecutionCardProps) => {
  const [buildParams, setBuildParams] = useState<BuildParams>({
    appName: "",
    type: "",
    env: "",
    domain: "",
  });
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoadingApps(true);
        const response = await axiosInstance.get(
          "https://api-cms-v2-dot-micro-enigma-235001.appspot.com/api/app/config/map"
        );
        const appList = Object.entries(response.data).map(
          ([key, value]: [string, any]) => ({
            key,
            shortName: value.shortName,
            name: value.name,
            hasState: value.hasState,
          })
        );
        setApps(appList);
      } catch (error) {
        console.error("Error fetching apps:", error);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApps();
  }, []);

  const handleAppChange = (value: string) => {
    const selectedApp = apps.find((app) => app.key === value);
    setBuildParams({
      ...buildParams,
      appName: value,
      type: selectedApp?.hasState ? "state" : "single",
    });
  };

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
              onChange={handleAppChange}
              loading={loadingApps}
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) => {
                if (!option?.value) return false;
                const selectedApp = apps.find(
                  (app) => app.key === option.value
                );
                if (!selectedApp) return false;
                const searchText = input.toLowerCase();
                return (
                  (selectedApp.shortName || "")
                    .toLowerCase()
                    .includes(searchText) ||
                  (selectedApp.name || "").toLowerCase().includes(searchText)
                );
              }}
            >
              {apps.map((app) => (
                <Option key={app.key} value={app.key}>
                  {app.name} ({app.shortName}) -{" "}
                  {app.hasState ? "State" : "Single"}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Environment" required>
            <Select
              placeholder="Select environment"
              value={buildParams.env}
              onChange={(value) =>
                setBuildParams({ ...buildParams, env: value })
              }
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) => {
                if (!option?.label) return false;
                const searchText = input.toLowerCase();
                return option.label
                  .toString()
                  .toLowerCase()
                  .includes(searchText);
              }}
            >
              <Option value="prod">Production</Option>
              <Option value="dev">Development</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Domain" required>
            <Input
              placeholder="Enter domain (.com/.org/.net/.io)"
              value={buildParams.domain}
              onChange={(e) =>
                setBuildParams({ ...buildParams, domain: e.target.value })
              }
              suffix={
                <CloseCircleOutlined
                  onClick={() => setBuildParams({ ...buildParams, domain: "" })}
                  style={{
                    cursor: buildParams.domain ? "pointer" : "default",
                    color: buildParams.domain
                      ? "rgba(0, 0, 0, 0.45)"
                      : "transparent",
                    transition: "color 0.3s",
                  }}
                />
              }
            />
          </Form.Item>
        </Form>

        <Button
          type="primary"
          icon={<BuildOutlined />}
          onClick={handleBuild}
          loading={loading === "build-app"}
          block
          disabled={
            !buildParams.appName || !buildParams.env || !buildParams.domain
          }
        >
          Build Application
        </Button>
      </Space>
    </Card>
  );
};
