import { RespLocalUploadData } from "./store/respTypes";
import { message } from "ant-design-vue";
import html2canvas from "html2canvas";
import axios from "axios";
import QRCode from "qrcode";
import { saveAs } from "file-saver";

interface CheckCondition {
  format?: string[];
  size?: number;
}

type ErrorType = "size" | "format" | null;

export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;
  const errors: ErrorType[] = [];
  if (!isValidFormat) {
    errors.push("format");
  }
  if (!isValidSize) {
    errors.push("size");
  }
  return {
    passed: isValidFormat && isValidSize,
    errors,
  };
}

export function commonUploadCheck(file: File) {
  const result = beforeUploadCheck(file, {
    format: ["image/jpeg", "image/png"],
    size: 2,
  });
  const { passed, errors } = result;
  if (errors.includes("format")) {
    message.warning("上传图片只能是 JPG/PNG 格式!");
  }
  if (errors.includes("size")) {
    message.warning("上传图片大小不能超过2MB!");
  }
  return passed;
}

export const getImageDimensions = (url: string | File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.src = url instanceof File ? URL.createObjectURL(url) : url;
    img.addEventListener("load", () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      resolve({ width, height });
    });
    img.addEventListener("error", () => {
      reject(new Error("There was some problem with the image."));
    });
  });
};

// 插入元素到指定位置
export const insertAt = (arr: any[], index: number, newItem: any) => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
};

/*
  @description 获取父元素
  @param element 当前元素
  @param className 父元素的类名
  @returns 父元素
*/
export const getParentElement = (element: HTMLElement, className: string) => {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element;
    } else {
      element = element.parentNode as HTMLElement;
    }
  }
  return null;
};

export function isMobile(mobile: string) {
  return /^1[3-9]\d{9}$/.test(mobile);
}
export async function uploadFile<R = any>(
  file: Blob,
  url = "/utils/upload-local-img",
  fileName = "screenshot.png"
) {
  const newFile = file instanceof File ? file : new File([file], fileName);
  const formData = new FormData();
  formData.append(newFile.name, newFile);

  // 使用本地上传端点，直接调用完整URL
  const fullUrl = `http://localhost:3000/api${url}`;
  const { data } = await axios.post<R>(fullUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;

  // 注释掉原来的远程上传逻辑
  // const { data } = await axios.post<R>(url, formData, {
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });
  // return data;
}
function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
}
export async function takeScreenshotAndUpload(ele: HTMLElement) {
  // get screenshot canvas
  const canvas = await html2canvas(ele, {
    width: 375,
    useCORS: true,
    scale: 1,
  });
  // transform canvas to blob
  const canvasBlob = await getCanvasBlob(canvas);
  if (canvasBlob) {
    // upload blob to server using local upload endpoint
    const data = await uploadFile<RespLocalUploadData>(canvasBlob);
    return data;
  }
}

export function generateQRCode(id: string, url: string, width = 100) {
  const ele = document.getElementById(id) as HTMLCanvasElement;
  console.log(ele);
  return QRCode.toCanvas(ele, url, { width });
}

export function copyToClipboard(text: string) {
  // create a fake textarea, set value to text
  const textarea = document.createElement("textarea");
  let isAppended = false;

  try {
    textarea.value = text;
    // define styles to be hidden
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    // append to body and select
    document.body.appendChild(textarea);
    isAppended = true;

    textarea.select();
    textarea.setSelectionRange(0, 99999); // 兼容移动设备

    // run execCommand
    return document.execCommand("copy");
  } catch (e) {
    console.warn("copy failed", e);
    return false;
  } finally {
    // 确保清理DOM节点
    if (isAppended && textarea.parentNode) {
      document.body.removeChild(textarea);
    }
  }
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const objToQueryString = (queryObj: { [key: string]: any }) => {
  return Object.keys(queryObj)
    .map((key) => `${key}=${queryObj[key]}`)
    .join("&");
};

export const downloadFile = (src: string, fileName = "default.png") => {
  // 创建链接
  const link = document.createElement("a");
  link.download = fileName;
  link.rel = "noopener";
  if (link.origin !== location.origin) {
    //https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType
    axios
      .get(src, { responseType: "blob" })
      .then((data) => {
        link.href = URL.createObjectURL(data.data);
        setTimeout(() => {
          link.dispatchEvent(new MouseEvent("click"));
        });
        // https://developer.mozilla.org/zh-CN/docs/Web/API/URL/revokeObjectURL
        setTimeout(() => {
          URL.revokeObjectURL(link.href);
        }, 10000);
      })
      .catch((e) => {
        console.error(e);
        link.target = "_blank";
        link.href = src;
        link.dispatchEvent(new MouseEvent("click"));
      });
  } else {
    // 设置链接属性
    link.href = src;
    // 触发事件
    link.dispatchEvent(new MouseEvent("click"));
  }
};

export const downloadImage = (url: string) => {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  saveAs(url, fileName);
};
