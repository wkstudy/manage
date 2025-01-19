import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { message } from "antd";
import queryString from "query-string";
interface IRes<T> {
  data: T;
  msg: string;
  errno: number;
}
interface IRequestOptions {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  query?: Record<string, any>; // query请求 ?a=1&b=2
}

const netError: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
};

class HttpClient {
  private readonly instance: AxiosInstance;
  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL,
      withCredentials: true,
    });
    this.instance.interceptors.response.use(
      this.handleSuccRes,
      this.handleErrRes
    );
  }
  private handleErrRes(err: AxiosError): any {
    // 处理http错误
    const msg = (err.response?.data as { message?: string[] })?.message?.[0];
    if (msg) {
      message.error(msg);
    } else if (err.response?.status) {
      if (netError[err.response.status]) {
        message.error(netError[err.response.status]);
      }
    }
    return Promise.reject(err);
  }
  private handleSuccRes(response: AxiosResponse): AxiosResponse {
    // // 处理内部data错误
    // console.log(response);
    // if (response.data.errno !== 0) {
    //   throw new Error(response.data.msg);
    // }
    // return response.data.data;
    return response;
  }
  public async request<T>({
    url,
    method = "POST",
    data,
    params,
    headers,
  }: IRequestOptions): Promise<IRes<T>> {
    {
      const response = await this.instance.request<IRes<T>>({
        url,
        method,
        data,
        params,
        headers,
      });
      return response.data;
    }
  }
}

export default new HttpClient();
