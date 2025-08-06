import { DatePicker, message, Modal, ModalProps } from "antd";
import React, { useEffect, useRef } from "react";
import type { ActivityInfo } from "../index";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import dayjs from "dayjs";
import { createActivity, updateActivity } from "@services/activity";
import Tiptap from "@components/Tiptap";
import styles from "./style.module.less";
const { RangePicker } = DatePicker;
export interface ActivityInfoType {
  mode: "create" | "edit" | "view" | "copy";
  info?: ActivityInfo;
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

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
const createActivitys: React.FC<ActivityInfoType & ModalProps> = (props) => {
  const [form] = Form.useForm();
  const noticeRef = useRef<any>(null);
  const contentRef = useRef<any>(null);

  useEffect(() => {
    if (props.open) {
      if (["view", "edit", "copy"].includes(props.mode)) {
        form.setFieldsValue({
          ...props.info,
          // birthDate: props?.info?.birthDate
          //   ? dayjs(props.info.birthDate, "YYYY-MM-DD")
          //   : null,
        });
      } else if (props.mode === "create") {
        form.resetFields();
      }
    }
  }, [props.open]);

  const onFinish = (values: any) => {
    const fn = props.mode === "edit" ? updateActivity : createActivity;
    const params: Partial<ActivityInfo> = {
      ...values,
      startTime: values.time[0].format("YYYY-MM-DD HH:mm:ss"),
      endTime: values.time[1].format("YYYY-MM-DD HH:mm:ss"),
      registrationTime: values.registrationTime.format("YYYY-MM-DD HH:mm:ss"),
      noitce: JSON.stringify(noticeRef.current?.value?.editor?.getJSON()),
      content: JSON.stringify(contentRef.current?.value?.editor?.getJSON()),
      // birthDate: values.birthDate
      //   ? dayjs(values.birthDate).format("YYYY-MM-DD")
      //   : null,
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
          message.success(props.mode === "edit" ? "更新成功" : "创建成功");
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
      className={styles.all}
      title={
        props.mode === "create"
          ? "新建活动"
          : props.mode === "edit"
          ? "更新活动"
          : "查看活动"
      }
      destroyOnClose={true}
      footer={null}
    >
      <Form
        {...formItemLayout}
        form={form}
        disabled={props.mode === "view"}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="活动名称"
          rules={[
            {
              required: true,
              message: "请输入活动名称!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="place"
          label="活动地点"
          rules={[
            {
              required: true,
              message: "请输入活动地点!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="time"
          label="活动时间"
          rules={[
            {
              required: true,
              message: "请选择活动时间!",
            },
          ]}
        >
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label="报名截止时间"
          name="registrationTime"
          dependencies={["time"]}
          rules={[
            {
              required: true,
              message: "请选择报名截止时间!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                console.log(value, getFieldValue("time"));
                const arr = getFieldValue("time");
                if (
                  !value ||
                  !arr ||
                  dayjs(arr[0]).valueOf() > dayjs(value).valueOf()
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("必须先于活动开始日期!"));
              },
            }),
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item label="活动人数（最少）" name="min">
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="活动人数（最多）"
          name="max"
          dependencies={["min"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const minValue = getFieldValue("min");
                if (!value || !minValue || value >= minValue) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("必须大于最少人数 !"));
              },
            }),
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="报名费"
          name="money"
          rules={[{ type: "number", min: 0 }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item label="活动简介" name="introduction">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="注意事项" name="note">
          <Tiptap ref={noticeRef} />
        </Form.Item>

        <Form.Item label="活动内容" name="content">
          <Tiptap ref={contentRef} />
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

export default createActivitys;
