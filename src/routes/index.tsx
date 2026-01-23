import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import { useState } from "react";
import axios from "axios";
import { Table } from "antd";
import type { TableProps } from "antd";

//  https://potterapi-fedeperin.vercel.app/en/spells

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [name, setName] = useState("");
  const [resValue, setResValue] = useState([]);

  function getData() {
    axios
      .get(name)
      .then(function (response) {
        setResValue(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  const columns: TableProps<any>["columns"] = [
    {
      title: "index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "spell",
      dataIndex: "spell",
      key: "spell",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "use",
      dataIndex: "use",
      key: "use",
    }
  ];

  const jsonData: any[] = resValue;
  console.log(jsonData)

  return (
    <div className="App flex justify-center items-center flex-col h-screen">
      <div>
        <input
          placeholder="Enter URL"
          className="border m-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="border" onClick={getData}>
          Search
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={jsonData}
        className="p-10"
      />;
    </div>
  );
}
