/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, message, Modal, Tag } from "antd";
import {
  handleActivityList,
  removeActivity,
  switchStatus,
} from "@services/activity";
import ActivityInfo from "./components/ActivityInfo";
import type { ActivityInfoType } from "./components/ActivityInfo";

export interface ActivityInfo {
  id: number;
  name: string;
  startTime: Date;
  endTime: Date;
  place: string;
  min: number;
  max: number;
  money: number;
  banner: string;
  status: number; //0 草稿 1 线上  2 线下
  registrationTime: Date;
  introduction: string;
  note: string;
  content: string;
  createTime: Date;
  updateTime: Date;
  isDelete: number; //0 未删除 1 已删除
}

const TablePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ActivityInfoType["mode"]>("create");
  const [info, setInfo] = useState<ActivityInfo>();
  const handleView = (record: ActivityInfo) => {
    setMode("view");
    setOpen(true);
    setInfo(record);
  };
  const handleUpdate = (record: ActivityInfo) => {
    setMode("edit");
    setOpen(true);
    setInfo(record);
  };
  const handleCopy = (record: ActivityInfo) => {
    setMode("copy");
    setOpen(true);
    setInfo(record);
  };
  const handlePublish = (record: ActivityInfo) => {
    Modal.confirm({
      title: `确定发布此id=${record.id}的活动吗?`,
      // content: "This action cannot be undone.",
      onOk() {
        switchStatus({ id: record.id, status: 1 }).then((res) => {
          if (res.errno !== 0) {
            message.error(res.msg || "请求失败，请重试");
          } else {
            message.success("发布成功");
            actionRef.current?.reload();
          }
        });
      },
      onCancel() {
        // 在取消按钮点击时的回调函数
        console.log("Cancel");
      },
    });
  };

  const handleOffline = (record: ActivityInfo) => {
    Modal.confirm({
      title: `确定下线此id=${record.id}的活动吗?`,
      // content: "This action cannot be undone.",
      onOk() {
        switchStatus({ id: record.id, status: 2 }).then((res) => {
          if (res.errno !== 0) {
            message.error(res.msg || "请求失败，请重试");
          } else {
            message.success("下线成功");
            actionRef.current?.reload();
          }
        });
      },
      onCancel() {
        // 在取消按钮点击时的回调函数
        console.log("Cancel");
      },
    });
  };
  const handleDelete = (record: ActivityInfo) => {
    Modal.confirm({
      title: `确定删除此id=${record.id}的活动吗?`,
      // content: "This action cannot be undone.",
      onOk() {
        removeActivity({ id: record.id }).then((res) => {
          if (res.errno !== 0) {
            message.error(res.msg || "请求失败，请重试");
          } else {
            message.success("删除成功");
            actionRef?.current?.reload();
          }
        });
      },
      onCancel() {
        // 在取消按钮点击时的回调函数
        console.log("Cancel");
      },
    });
  };

  const handleOper = (
    key: React.Key,
    record: ActivityInfo,
    action: ActionType | undefined
  ) => {
    const oper = {
      copy: handleCopy,
      delete: handleDelete,
      publish: handlePublish,
    };
    oper[key as "copy" | "delete"](record, action);
  };
  const columns: ProColumns<ActivityInfo>[] = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "活动名称",
      dataIndex: "name",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            // required: true,
            // message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        0: { text: "草稿", status: "Default" },
        1: { text: "线上", status: "Processing" },
        2: { text: "线下", status: "Success" },
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
      sorter: true,
      key: "createTime",
      defaultSortOrder: "descend",
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
      sorter: true,
      key: "updateTime",
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      valueType: "dateRange",
      hideInTable: true,

      search: {
        transform: (value) => {
          console.log(value);
          // return {
          //   startTime: `${value[0]} 00:00:00`,
          //   endTime: `${value[1]} 23:59:59`,
          // };
          return {
            time: [`${value[0]} 00:00:00`, `${value[1]} 23:59:59`],
          };
        },
      },
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => {
        const look = (
          <a key="view" onClick={() => handleView(record)}>
            查看
          </a>
        );
        const edit = (
          <a key="editable" onClick={() => handleUpdate(record)}>
            更新
          </a>
        );
        const copy = (
          <a key="copy" onClick={() => handleCopy(record)}>
            复制
          </a>
        );
        const publish = (
          <a key="publish" onClick={() => handlePublish(record)}>
            发布
          </a>
        );
        const offline = (
          <a key="offline" onClick={() => handleOffline(record)}>
            下线
          </a>
        );
        const del = (
          <a key="delete" onClick={() => handleDelete(record)}>
            删除
          </a>
        );
        const res: Record<number, React.ReactNode[]> = {
          0: [look, edit, copy, publish, del],
          1: [look, copy, offline],
          2: [look, edit, copy, publish, del],
        };
        return res[record.status];
        // return [
        //   <a key="view" onClick={() => handleView(record)}>
        //     查看
        //   </a>,
        //   <a key="editable" onClick={() => handleUpdate(record)}>
        //     更新
        //   </a>,
        //   <TableDropdown
        //     key="actionGroup"
        //     onSelect={(key) => handleOper(key, record, action)}
        //     menus={[
        //       { key: "copy", name: "复制" },
        //       { key: "delete", name: "删除" },
        //     ]}
        //   />,
        // ];
      },
    },
  ];
  const handleOk = () => {
    setOpen(false);
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<ActivityInfo, { id: number; name: string }>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          const res = await handleActivityList<{
            count: number;
            page: number;
            list: ActivityInfo[];
          }>({
            ...params,
            curPage: params.current as number,
            pageSize: params.pageSize as number,
          });
          if (res.errno !== 0) {
            message.error(res.msg || "请求失败，请重试");
            return {
              data: [],
              success: false,
            };
          }
          console.log(res);
          return {
            data: res.data.list,
            success: res.errno === 0,
            total: res.data.count,
          };
        }}
        editable={{
          type: "multiple",
        }}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
              setMode("create");
            }}
            type="primary"
          >
            新建
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: "1st item",
                  key: "1",
                },
                {
                  label: "2nd item",
                  key: "2",
                },
                {
                  label: "3rd item",
                  key: "3",
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
      <ActivityInfo
        mode={mode}
        open={open}
        onOk={handleOk}
        info={info}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default TablePage;
