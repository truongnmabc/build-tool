"use client";

import { Card, List } from "antd";

interface Page {
  id: string;
  name: string;
  path: string;
  content: string;
}

interface PageListProps {
  pages: Page[];
  selectedPage: Page | null;
  onPageSelect: (page: Page) => void;
}

export function PageList({ pages, selectedPage, onPageSelect }: PageListProps) {
  return (
    <Card title="Pages" className="h-full">
      <List
        dataSource={pages}
        renderItem={(page) => (
          <List.Item
            className={`cursor-pointer p-2 rounded ${
              selectedPage?.id === page.id ? "bg-blue-50" : ""
            }`}
            onClick={() => onPageSelect(page)}
          >
            <List.Item.Meta title={page.name} description={page.path} />
          </List.Item>
        )}
      />
    </Card>
  );
}
