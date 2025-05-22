<template>
  <div class="file-upload">
    <div
      class="upload-area"
      :class="{ 'is-drag-over': drag && isDragOver }"
      v-on="events"
    >
      <!-- 上传中 -->
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <!-- 上传成功后显示的图片 -->
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <div v-if="lastFileData.url" class="uploaded-image">
          <img :src="lastFileData.url" class="upload-list-thumbnail" />
        </div>
        <button>点击上传</button>
      </slot>
      <!-- 默认 -->
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      ref="fileInput"
      :style="{ display: 'none' }"
      @change="handleFileChange"
    />
    <ul class="upload-list" v-if="showUploadList">
      <li
        :class="`uploaded-file upload-${file.status}`"
        v-for="file in fileList"
        :key="file.uid"
      >
        <img
          v-if="file.url && listType === 'picture'"
          :src="file.url"
          class="upload-list-thumbnail"
          :alt="file.name"
        />
        <!-- 上传中 -->
        <span v-if="file.status === 'loading'" class="file-icon"
          ><LoadingOutlined
        /></span>
        <!-- 上传成功 -->
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{ file.name }}</span>
        <button class="delete-icon" @click="removeFile(file.uid)">
          <DeleteOutlined />
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, PropType } from "vue";
import {
  LoadingOutlined,
  FileOutlined,
  DeleteOutlined,
  CodeSandboxCircleFilled,
} from "@ant-design/icons-vue";
import axios from "axios";
import { last } from "lodash";
import { v4 as uuidv4 } from "uuid";
type UploadStatus = "ready" | "loading" | "success" | "error";
type FileListType = "picture" | "text";
type CheckUpload = (file: File) => boolean | Promise<boolean | File>;
// 上传文件的类型
export interface UploadFile {
  uid: string; // 文件的唯一标识
  size: number; // 文件的大小
  name: string; // 文件的名称
  status: UploadStatus; // 文件的状态
  raw: File; // 文件的原始对象
  resp?: any; // 文件上传后的响应
  url?: string; // 文件上传后的url
}
export default defineComponent({
  components: {
    LoadingOutlined,
    FileOutlined,
    DeleteOutlined,
  },
  props: {
    action: {
      // 上传地址
      type: String,
      required: true,
    },
    beforeUpload: {
      // 上传前检查
      type: Function as PropType<CheckUpload>,
    },
    drag: {
      // 是否开启拖拽上传
      type: Boolean,
      default: false,
    },
    listType: {
      // 上传列表类型
      type: String as PropType<FileListType>,
      default: "picture",
    },
    showUploadList: {
      // 是否显示上传列表
      type: Boolean,
      default: true,
    },
  },
  emits: ["success", "error"],
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null);
    // 上传后返回的文件列表
    const fileList = ref<UploadFile[]>([]);
    // 是否正在上传
    const isUploading = computed(() => {
      return fileList.value.some((file) => file.status === "loading");
    });
    // 是否正在拖拽
    const isDragOver = ref(false);

    // 上传成功后显示的图片
    const lastFileData = computed(() => {
      const lastFile = last(fileList.value);
      if (lastFile) {
        return {
          loaded: lastFile.status === "success",
          data: lastFile.resp,
          url: lastFile.url,
        };
      }
      console.log("lastFileData:", lastFileData);
      return false;
    });

    // 触发上传
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    // 文件预处理
    const addFileToList = (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: "ready",
        raw: uploadedFile,
      });

      if (props.listType === "picture") {
        // 创建图片的url
        // try {
        //   fileObj.url = URL.createObjectURL(uploadedFile);
        // } catch (err) {
        //   console.error("Upload file error", err);
        // }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(uploadedFile);
        fileReader.addEventListener("load", () => {
          fileObj.url = fileReader.result as string;
        });
      }

      fileList.value.push(fileObj);

      return fileObj;
    };

    // 上传文件
    const postFile = (fileObj: UploadFile) => {
      const formData = new FormData();
      formData.append(fileObj.name, fileObj.raw);

      fileObj.status = "loading";

      return axios
        .post(props.action, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          fileObj.status = "success";
          fileObj.resp = resp.data;
          emit("success", {
            resp: resp.data,
            file: fileObj,
            list: fileList.value,
          });
          // 如果响应中包含 url，更新文件 url
          // if (resp.data.url) {
          //   fileObj.url = resp.data.url;
          // }
          return resp;
        })
        .catch((err) => {
          fileObj.status = "error";
          emit("error", {
            error: err,
            file: fileObj,
            list: fileList.value,
          });
          throw err;
        })
        .finally(() => {
          if (fileInput.value) {
            fileInput.value.value = "";
          }
        });
    };

    const handleUpload = async (uploadedFile: File) => {
      try {
        const fileObj = addFileToList(uploadedFile);
        await postFile(fileObj);
      } catch (err) {
        console.log("Upload error", err);
      }
    };

    // 上传文件
    const uploadFiles = (files: null | FileList) => {
      if (files) {
        const uploadedFile = files[0];
        if (props.beforeUpload) {
          // 上传前检查
          const result = props.beforeUpload(uploadedFile);
          if (result && result instanceof Promise) {
            result
              .then((processedFile) => {
                // 如果返回的是文件对象，则上传文件
                if (processedFile && processedFile instanceof File) {
                  handleUpload(processedFile);
                } else {
                  throw new Error(
                    "beforeUpload Promise should return File object"
                  );
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (result === true) {
            handleUpload(uploadedFile);
          }
        } else {
          handleUpload(uploadedFile);
        }
      }
    };

    // 处理文件变化
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      uploadFiles(target.files);
    };

    // 删除文件
    const removeFile = (uid: string) => {
      fileList.value = fileList.value.filter((file) => file.uid !== uid);
    };

    // 事件
    let events: { [key: string]: (e: any) => void } = {
      click: triggerUpload,
    };

    // 拖拽事件
    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault();
      isDragOver.value = over;
    };

    // 拖拽结束
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      isDragOver.value = false;
      if (e.dataTransfer) {
        uploadFiles(e.dataTransfer.files);
      }
    };

    // 如果开启拖拽上传，则添加拖拽事件
    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => {
          handleDrag(e, true);
        },
        dragleave: (e: DragEvent) => {
          handleDrag(e, false);
        },
        drop: handleDrop,
      };
    }

    return {
      fileInput,
      triggerUpload,
      isUploading,
      handleFileChange,
      removeFile,
      fileList,
      lastFileData,
      isDragOver,
      events,
    };
  },
});
</script>

<style lang="scss" scoped>
// 上传状态的颜色样式
.upload-loading {
  color: gray;
}
.upload-success {
  color: #00ff00;
}
.upload-error {
  color: #ff0000;
}
.delete-icon {
  color: black;
}
// 上传区域
.file-upload .upload-area {
  width: 360px;
  height: 180px;
  // 垂直居中
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 1px dashed #ccc;
  background-color: #efefef;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border: 2px dashed #1890ff;
  }
  &.is-drag-over {
    border: 2px dashed #1890ff;
    background: rgba(#1890ff, 0.2);
  }

  button {
    border: none;
    cursor: pointer;
  }
}

.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    font-size: 14px;
    line-height: 1.8;
    margin-top: 5px;
    box-sizing: border-box;
    border-radius: 4px;
    min-width: 200px;
    position: relative;

    &:first-child {
      margin-top: 10px;
    }

    .file-icon {
      svg {
        margin-right: 5px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .filename {
      margin-left: 5px;
      margin-right: 40px;
    }
    &.upload-error {
      color: #f5222d;
      svg {
        color: #f5222d;
      }
    }

    img {
      margin-right: 8px; // 添加间距
    }

    .file-status {
      display: block;
      position: absolute;
      right: 5px;
      top: 0;
      line-height: inherit;
    }
    .delete-icon {
      display: none;
      position: absolute;
      right: 7px;
      top: 0;
      line-height: inherit;
      cursor: pointer;
    }
    &:hover {
      background-color: #efefef;
      .file-status {
        display: none;
      }
      .delete-icon {
        display: block;
      }
    }
  }
}

.upload-list-thumbnail {
  vertical-align: middle;
  display: inline-block;
  width: 70px; // 调整大小
  height: 70px; // 调整大小
  position: relative;
  z-index: 1;
  background-color: #fff;
  object-fit: cover; // 确保图片比例正确
  border-radius: 4px; // 可选：添加圆角
}
</style>
