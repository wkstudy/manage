import http from "@utils/request";
import type { UserInfo } from "@pages/UserPage";
import { SortOrder } from "antd/es/table/interface";

export const handleLogin = <T>(req: { userName: string; passWord: string }) => {
  return http.request<T>({
    url: "/user/login",
    data: req,
  });
};

export const handleUserList = <T>(req: {
  id?: number;
  userName?: string;
  curPage: number;
  pageSize: number;
  sort?: Record<string, SortOrder>;
}) => {
  return http.request<T>({
    url: "/user/list",
    data: req,
  });
};
export const createUser = <T>(req: Partial<UserInfo>) => {
  return http.request<T>({
    url: "/user/register",
    data: req,
  });
};

export const removeUser = <T>(req: { id: number }) => {
  return http.request<T>({
    url: "/user/remove",
    params: req,
    method: "GET",
  });
};

export const updateUser = <T>(req: Partial<UserInfo>) => {
  return http.request<T>({
    url: "/user/update",
    data: req,
  });
};
