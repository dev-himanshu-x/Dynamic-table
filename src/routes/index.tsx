import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import { Table, Form, Modal, Select, Input, Button } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import "../App.css";
import { Content } from "antd/es/layout/layout";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [data, setData] = useState<any[]>([]);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = Form.useForm();

  const getData = (values: any) => {
    if (!values) return;
    axios.get(values.input).then((res) => {
      setData(res.data);
      if (res.data.length > 0) {
        setOptions(
          Object.keys(res.data[0]).map((key) => ({
            label: key,
            value: key,
          }))
        );
      }
      setIsModalOpen(true);
    });
  };

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
        return <div className="clamp-2">{value}</div>;
      },
    }));
    setColumns(newColumns);
    modalForm.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center p-5 min-h-screen bg-[#E1E3FF]">
        <Form className="flex gap-2" onFinish={getData}>
          <Form.Item
            rules={[{ required: true, message: "Please input url!" }]}
            name="input"
            className="flex-1"
          >
            <Input placeholder="Enter API URL" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="w-full sm:w-auto">
              Go
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title="Select Items to show"
          open={isModalOpen}
          okText="Ok"
          okButtonProps={{ autoFocus: true, htmlType: "submit" }}
          onCancel={handleCancel}
          modalRender={(dom) => <Form form={modalForm} onFinish={Finish}>{dom}</Form>}
        >
          <Form.Item rules={[{ required: true }]} name="select">
            <Select mode="multiple" className="w-full" options={options} />
          </Form.Item>
        </Modal>

        <div className="mt-4 w-screen overflow-auto">
          <Table
            className="clamp-4"
            bordered
            columns={columns}
            dataSource={data}
            expandable={{ showExpandColumn: false }}
            pagination={{
              defaultPageSize: 5,
            }}
            scroll={{x:"max-content"}}
          />
        </div>
    </div>
  );
}
