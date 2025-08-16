import http from "@utils/request";
import type { ActivityInfo } from "@pages/ActivityPage/index";
import { SortOrder } from "antd/es/table/interface";

export const handleLogin = <T>(req: { userName: string; passWord: string }) => {
  return http.request<T>({
    url: "/user/login",
    data: req,
  });
};

export const handleActivityList = <T>(req: {
  id?: number;
  name?: string;
  curPage: number;
  status?: number;
  pageSize: number;
}) => {
  return http.request<T>({
    url: "/activity/list",
    data: req,
  });
};
export const createActivity = <T>(req: Partial<ActivityInfo>) => {
  return http.request<T>({
    url: "/activity/create",
    data: req,
  });
};

export const removeActivity = <T>(req: { id: number }) => {
  return http.request<T>({
    url: "/activity/remove",
    params: req,
    method: "GET",
  });
};

export const updateActivity = <T>(req: Partial<ActivityInfo>) => {
  return http.request<T>({
    url: "/activity/update",
    data: req,
  });
};

export const switchStatus = <T>(req: Partial<ActivityInfo>) => {
  return http.request<T>({
    url: "/activity/switchStatus",
    data: req,
  });
};
