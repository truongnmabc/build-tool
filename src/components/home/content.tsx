import { Col, Row } from "antd";
import { useState } from "react";
import { PageForm } from "./pageForm";
import { PageList } from "./pageList";
interface Page {
  id: string;
  name: string;
  path: string;
  content: string;
}
const ContentPages = ({ pages }: { pages: Page[] }) => {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const handlePageSelect = (page: Page) => {
    setSelectedPage(page);
  };

  return (
    <Row gutter={16} className="mt-8">
      <Col span={6}>
        <PageList
          pages={pages}
          selectedPage={selectedPage}
          onPageSelect={handlePageSelect}
        />
      </Col>
      <Col span={18}>
        <PageForm page={selectedPage} />
      </Col>
      {/* <Col span={16}>{selectedPage && <PageForm page={selectedPage} />}</Col> */}
    </Row>
  );
};

export default ContentPages;
