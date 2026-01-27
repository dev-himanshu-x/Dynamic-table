import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import { Table , Form , Modal, Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import "../App.css";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [url, setUrl] = useState(
    "https://potterapi-fedeperin.vercel.app/en/books",
  );
  const [data, setData] = useState<any[]>([]);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getData = () => {
    if (!url) return;

    axios.get(url).then((res) => {
      setData(res.data);
      if (res.data.length > 0) {
        setOptions(Object.keys(res.data[0]).map((key) => ({
          label: key,
          value: key,
        })));
      }
      setIsModalOpen(true);
    });
  };

  const handleOk = () => {
    const newColumns = checkedList.map((key) => ({
      title: key,
      dataIndex: key,
      key,
    }));
    setColumns(newColumns);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center p-5 h-screen bg-[#E1E3FF]">
      <div>
        <input
          className="border m-2 rounded-2xl p-1 bg-white"
          placeholder="Enter API URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="border px-3 rounded-2xl p-1 bg-white font-bold"
          onClick={getData}
        >
          Go
        </button>
      </div>
      <Form>
      <Modal
        title="Select Items to show"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          mode="multiple"
          className="w-full"
          options={options}
          value={checkedList}
          onChange={setCheckedList}
        />
      </Modal>
      </Form>
      <div className="w-full mt-4">
        <Table
          columns={columns}
          dataSource={data}
        />
      </div>
    </div>
  );
}
