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
