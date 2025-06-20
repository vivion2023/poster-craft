import { message } from "ant-design-vue";
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
