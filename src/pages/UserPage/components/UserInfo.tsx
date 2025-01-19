import { DatePicker, message, Modal, ModalProps } from "antd";
import React, { useEffect } from "react";
import type { UserInfo } from "../index";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import { createUser as handleRegister, updateUser } from "@services/user";
export interface UserInfoType {
  mode: "create" | "edit" | "view" | "copy";
  info?: UserInfo;
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const genderOptions = [
  { label: "男", value: 1 },
  { label: "女", value: 0 },
];
const degreeOptions = [
  { label: "本科", value: 1 },
  { label: "硕士", value: 2 },
  { label: "博士", value: 3 },
  { label: "其他", value: 4 },
];
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const createUser: React.FC<UserInfoType & ModalProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.open) {
      if (["view", "edit", "copy"].includes(props.mode)) {
        form.setFieldsValue({
          ...props.info,
          birthDate: props?.info?.birthDate
            ? dayjs(props.info.birthDate, "YYYY-MM-DD")
            : null,
        });
      } else if (props.mode === "create") {
        form.resetFields();
      }
    }
  }, [props.open]);
  const onFinish = (values: any) => {
    const fn = props.mode === "edit" ? updateUser : handleRegister;
    const params: Partial<UserInfo> = {
      ...values,
      birthDate: values.birthDate
        ? dayjs(values.birthDate).format("YYYY-MM-DD")
        : null,
      updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    if (props.mode === "edit") {
      params.id = props.info?.id;
    }
    if (["create", "copy"].includes(props.mode)) {
      params.createTime = dayjs().format(
        "YYYY-MM-DD HH:mm:ss"
      ) as unknown as Date;
    }
    fn(params).then((res) => {
      if (res.errno === 0) {
        if (props.onOk) {
          message.success("注册成功");
          props.onOk();
          form.resetFields();
        }
      } else {
        message.error(res.msg || "请求失败，请重试");
      }
    });
  };
  return (
    <Modal
      {...props}
      title={
        props.mode === "create"
          ? "注册用户"
          : props.mode === "edit"
          ? "更新用户"
          : "查看用户"
      }
      destroyOnClose={true}
      footer={null}
    >
      <Form
        {...formItemLayout}
        form={form}
        disabled={props.mode === "view"}
        onFinish={onFinish}
        style={{ maxWidth: 600, margin: "auto" }}
        scrollToFirstError
      >
        <Form.Item
          name="userName"
          label="用户名"
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {["create", "copy"].includes(props.mode) && (
          <>
            <Form.Item
              name="passWord"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "请输入密码!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "请输入密码!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("passWord") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("密码不一致!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="gender"
          label="性别"
          rules={[{ required: true, message: "请选择性别" }]}
        >
          <Select placeholder="请选择性别" options={genderOptions}></Select>
        </Form.Item>

        <Form.Item name="birthDate" label="出生日期">
          <DatePicker />
        </Form.Item>

        <Form.Item name="height" label="身高">
          <InputNumber addonAfter="cm" />
        </Form.Item>
        <Form.Item name="weight" label="体重">
          <InputNumber addonAfter="kg" />
        </Form.Item>
        <Form.Item name="school" label="学校">
          <Input />
        </Form.Item>
        <Form.Item name="degree" label="学位">
          <Select placeholder="请选择性别" options={degreeOptions}></Select>
        </Form.Item>
        <Form.Item name="occupation" label="职业">
          <Input />
        </Form.Item>
        <Form.Item name="company" label="公司">
          <Input />
        </Form.Item>

        {props.mode !== "view" && (
          <>
            <Form.Item {...tailFormItemLayout}>
              <Button style={{ marginRight: "20px" }} htmlType="reset">
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default createUser;
