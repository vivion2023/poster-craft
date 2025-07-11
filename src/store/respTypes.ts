import { PageData, PageProps, ComponentData } from "./editor";
import { ActionPayload } from "./index";
export interface RespData<T = {}> {
  errno: number;
  data: T;
  message?: string;
  payload?: ActionPayload;
}
export interface ListData<T> {
  list: T[];
  count: number;
}
export interface WorkData extends Omit<PageData, "props"> {
  content: {
    components: ComponentData[];
    props?: PageProps;
  };
}
export interface UploadData {
  urls: string[];
}
// 本地上传响应数据格式
export interface LocalUploadData {
  url: string;
}
export type RespListData<T> = RespData<ListData<T>>;
export type RespWorkData = RespData<WorkData>;
export type RespUploadData = RespData<UploadData>;
export type RespLocalUploadData = RespData<LocalUploadData>;
