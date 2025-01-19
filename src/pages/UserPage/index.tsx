/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useRef, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, message, Modal, Tag } from "antd";
import { handleUserList, removeUser } from "@services/user";
import UserInfo from "./components/UserInfo";
import type { UserInfoType } from "./components/UserInfo";

export interface UserInfo {
  id: number;
  userName: string;
  passWord: string;
  avatar?: string;
  birthDate?: Date;
  gender: number;
  height: number;
  weight: number;
  school: string;
  degree: string;
  occupation: string;
  company: string;
  createTime: Date;
  updateTime: Date;
}

const handleDelete = (record: UserInfo, action: ActionType | undefined) => {
  Modal.confirm({
    title: "确定删除此用户吗?",
    // content: "This action cannot be undone.",
    onOk() {
      removeUser({ id: record.id }).then((res) => {
        if (res.errno !== 0) {
          message.error(res.msg || "请求失败，请重试");
        } else {
          message.success("删除成功");
          if (action) {
            action.reload();
          }
        }
      });
    },
    onCancel() {
      // 在取消按钮点击时的回调函数
      console.log("Cancel");
    },
  });
};

const TablePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<UserInfoType["mode"]>("create");
  const [info, setInfo] = useState<UserInfo>();
  const handleView = (record: UserInfo) => {
    setMode("view");
    setOpen(true);
    setInfo(record);
  };
  const handleUpdate = (record: UserInfo) => {
    setMode("edit");
    setOpen(true);
    setInfo(record);
  };
  const handleCopy = (record: UserInfo) => {
    setMode("copy");
    setOpen(true);
    setInfo(record);
  };
  const handleOper = (
    key: React.Key,
    record: UserInfo,
    action: ActionType | undefined
  ) => {
    const oper = {
      copy: handleCopy,
      delete: handleDelete,
    };
    oper[key as "copy" | "delete"](record, action);
  };
  const columns: ProColumns<UserInfo>[] = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "userName",
      copyable: true,
      ellipsis: true,
      // tip: "请输入用户名",
      // formItemProps: {
      //   rules: [
      //     {
      //       required: true,
      //       message: "此项为必填项",
      //     },
      //   ],
      // },
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
          return {
            startTime: `${value[0]} 00:00:00`,
            endTime: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <a key="view" onClick={() => handleView(record)}>
          查看
        </a>,
        <a key="editable" onClick={() => handleUpdate(record)}>
          更新
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => handleOper(key, record, action)}
          menus={[
            { key: "copy", name: "复制" },
            { key: "delete", name: "删除" },
          ]}
        />,
      ],
    },
  ];
  const handleOk = () => {
    setOpen(false);
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<UserInfo, { id: number; userName: string }>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          console.log(sort);
          const res = await handleUserList<{
            count: number;
            page: number;
            list: UserInfo[];
          }>({
            ...params,
            curPage: params.current as number,
            pageSize: params.pageSize as number,
            sort,
          });
          if (res.errno !== 0) {
            message.error(res.msg || "请求失败，请重试");
            return {
              data: [],
              success: false,
            };
          }
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
      <UserInfo
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
