import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import {
  ConfigProvider,
  theme,
  Table,
  Form,
  Modal,
  Select,
  Input,
  Button,
} from "antd";
import type { DefaultOptionType } from "antd/es/select";
import "../App.css";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [data, setData] = useState<any[]>([]);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = Form.useForm();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hide,setHide]=useState(false)

  const getData = (values: any) => {
    if (!values) return;
    axios.get(values.input).then((res) => {
      setData(res.data);
      if (res.data.length > 0) {
        setOptions(
          Object.keys(res.data[0]).map((key) => ({
            label: key,
            value: key,
          })),
        );
      }
      setIsModalOpen(true);
    });
  };

  // https://api.postalpincode.in/pincode/273164

  const handleCancel = () => setIsModalOpen(false);

  const Finish = (values: any) => {
    const newColumns = values.select.map((key: string) => ({
      title: key,
      dataIndex: key,
      key,
      render: (value: any) => {
        if (typeof value === "string" && value.startsWith("http")) {
          return (
            <a href={value} target="_blank">
              {value}
            </a>
          );
        }
        return <div className="w-auto max-w-lg">{value}</div>;
      },
    }));
    setColumns(newColumns);
    setHide(true)
    modalForm.resetFields();
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <div
        className={`flex flex-col items-center p-5 min-h-screen bg-[#E1E3FF] dark:bg-zinc-800`}
      >
        <div className="flex gap-4 justify-between w-full">
          <div></div>
          <div>
            <Form className="flex gap-2" onFinish={getData}>
              <Form.Item
                rules={[{ required: true, message: "Please input url!" }]}
                name="input"
              >
                <Input placeholder="Enter API URL" />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" className="w-full">
                  Go
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div>
            <Button
              onClick={() => {
                setIsDarkMode(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z" />
              </svg>
            </Button>
            <Button
              className="ml-1"
              onClick={() => {
                setIsDarkMode(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
              </svg>
            </Button>
          </div>
        </div>

        <Modal
          title="Select Items to show"
          open={isModalOpen}
          okText="Ok"
          okButtonProps={{ autoFocus: true, htmlType: "submit" }}
          onCancel={handleCancel}
          modalRender={(dom) => (
            <Form form={modalForm} onFinish={Finish}>
              {dom}
            </Form>
          )}
        >
          <Form.Item rules={[{ required: true }]} name="select">
            <Select mode="multiple" className="w-full" options={options} />
          </Form.Item>
        </Modal>

        <div className={`${hide?"block":"hidden"} mt-4 w-screen overflow-auto`}>
          <Table
            className="clamp-4"
            bordered
            columns={columns}
            dataSource={data}
            expandable={{ showExpandColumn: false }}
            pagination={{
              defaultPageSize: 5,
            }}
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}