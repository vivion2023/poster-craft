<template>
  <div class="file-upload">
    <div
      class="upload-area"
      :class="{ 'is-drag-over': drag && isDragOver }"
      v-on="events"
    >
      <!-- 上传中 -->
      <slot v-if="isUploading" name="loading">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </slot>
      <!-- 上传成功后显示的图片 -->
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <div v-if="lastFileData.url" class="uploaded-image">
          <img :src="lastFileData.url" class="uploaded-preview" />
          <h4 class="upload-btn">点击上传</h4>
        </div>
        <button v-else>点击上传</button>
      </slot>
      <!-- 默认 -->
      <slot v-else name="default">
        <FileImageOutlined />
        <h4>上传图片</h4>
      </slot>
    </div>
    <input
      type="file"
      ref="fileInput"
      :style="{ display: 'none' }"
      @change="handleFileChange"
      multiple
      accept="image/*"
    />
    <div class="upload-list-container" v-if="showUploadList">
      <ul class="upload-list">
        <li
          :class="`uploaded-file upload-${file.status} ${
            file.status === 'ready' ? 'clickable' : ''
          }`"
          v-for="file in fileList"
          :key="file.uid"
          @click="handleFileItemClick(file)"
        >
          <img
            v-if="file.url && listType === 'picture'"
            :src="file.url"
            class="upload-list-thumbnail"
            :alt="file.name"
          />
          <!-- 上传中 -->
          <span v-if="file.status === 'loading'" class="file-icon">
            <LoadingOutlined />
          </span>
          <!-- 进度条 -->
          <div v-if="file.status === 'loading'" class="progress-wrapper">
            <div
              class="progress-inner"
              :style="{ width: file.percentage + '%' }"
            ></div>
          </div>
          <!-- 上传成功 -->
          <span v-else class="file-icon"><FileOutlined /></span>
          <a-tooltip :title="file.name" placement="top">
            <span class="filename">{{ file.name }}</span>
          </a-tooltip>
          <button class="delete-icon" @click.stop="removeFile(file.uid)">
            <DeleteOutlined />
          </button>
        </li>
      </ul>
    </div>
    <!-- 手动上传按钮 -->
    <div
      v-if="!autoUploadProp && fileList.some((f) => f.status === 'ready')"
      class="manual-upload-wrapper"
    >
      <button class="manual-upload-btn" @click="submitUpload">开始上传</button>
    </div>
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
import { Tooltip } from "ant-design-vue";
import axios, { type AxiosProgressEvent } from "axios";
import { last } from "lodash";
import { v4 as uuidv4 } from "uuid";
type UploadStatus = "ready" | "loading" | "success" | "error";
// 上传进度百分比
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
  percentage?: number; // 上传进度
}
export default defineComponent({
  components: {
    LoadingOutlined,
    FileOutlined,
    DeleteOutlined,
    ATooltip: Tooltip,
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
    autoUpload: {
      // 是否自动上传
      type: Boolean,
      default: false,
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
    // 当前选择替换的文件UID
    const currentReplaceFileUid = ref<string | null>(null);

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
      return false;
    });

    // 触发上传
    const triggerUpload = () => {
      if (fileInput.value) {
        // 先重置value，确保选择相同文件时也能触发change事件
        fileInput.value.value = "";
        fileInput.value.click();
      }
    };

    // 处理文件项点击
    const handleFileItemClick = (file: UploadFile) => {
      // 只有 ready 状态的文件可以重新选择
      if (file.status === "ready") {
        currentReplaceFileUid.value = file.uid;
        triggerUpload();
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
        percentage: 0,
      });

      if (props.listType === "picture") {
        // 创建图片的url
        try {
          fileObj.url = URL.createObjectURL(uploadedFile);
        } catch (err) {
          console.error("Upload file error", err);
        }
        // const fileReader = new FileReader();
        // fileReader.readAsDataURL(uploadedFile);
        // fileReader.addEventListener("load", () => {
        //   fileObj.url = fileReader.result as string;
        // });
      }

      fileList.value.push(fileObj);

      return fileObj;
    };

    // 上传文件
    const postFile = (fileObj: UploadFile) => {
      const formData = new FormData();
      formData.append(fileObj.name, fileObj.raw);

      fileObj.status = "loading";
      fileObj.percentage = 0;

      return axios
        .post(props.action, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (e.total) {
              fileObj.percentage = Math.round((e.loaded * 100) / e.total);
            }
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
          if (resp.data.url) {
            fileObj.url = resp.data.url;
          }
          fileObj.percentage = 100;
          return resp;
        })
        .catch((err) => {
          fileObj.status = "error";
          fileObj.percentage = 0;
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

    // 处理单个文件的上传（已在列表中的）
    const startUpload = async (fileObj: UploadFile) => {
      try {
        await postFile(fileObj);
      } catch (err) {
        console.log("Upload error", err);
      }
    };

    // 选择文件时的统一处理
    const handleUpload = async (uploadedFile: File) => {
      // 如果当前有需要替换的文件
      if (currentReplaceFileUid.value) {
        const index = fileList.value.findIndex(
          (f) => f.uid === currentReplaceFileUid.value
        );
        if (index !== -1) {
          // 替换文件
          const newFileObj: UploadFile = {
            uid: currentReplaceFileUid.value,
            size: uploadedFile.size,
            name: uploadedFile.name,
            status: "ready",
            raw: uploadedFile,
            percentage: 0,
          };

          if (props.listType === "picture") {
            try {
              // 释放旧的URL资源
              if (fileList.value[index].url) {
                URL.revokeObjectURL(fileList.value[index].url as string);
              }
              newFileObj.url = URL.createObjectURL(uploadedFile);
            } catch (err) {
              console.error("Upload file error", err);
            }
          }

          // 替换文件对象
          fileList.value[index] = reactive(newFileObj);
          currentReplaceFileUid.value = null;
          return;
        }
      }

      // 常规添加文件流程
      const fileObj = addFileToList(uploadedFile);
      if (props.autoUpload) {
        startUpload(fileObj);
      }
    };

    // 手动触发列表中所有 ready 文件上传
    const submitUpload = () => {
      fileList.value
        .filter((f) => f.status === "ready")
        .forEach((f) => {
          startUpload(f);
        });
    };

    // 上传文件
    const uploadFiles = (files: null | FileList) => {
      if (files) {
        // 处理所有选中的文件，而不仅仅是第一个
        Array.from(files).forEach((uploadedFile) => {
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
        });
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
      submitUpload,
      autoUploadProp: props.autoUpload,
      handleFileItemClick,
    };
  },
});
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// 上传状态的颜色样式
.upload-ready {
  color: #333;
}

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
.file-upload {
  .upload-area {
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 15px;
    padding: 20px;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    text-align: center;
    &.is-drag-over {
      border: 2px dashed #1890ff;
      background: rgba(#1890ff, 0.2);
    }

    .uploaded-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .uploaded-preview {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 12px;
      }

      .upload-btn {
        background: none;
        border: none;
        color: #1890ff;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          color: #40a9ff;
        }
      }
    }
  }
}

.upload-list-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-top: 12px;
}

.upload-list {
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    transition: all 0.3s ease;
    font-size: 14px;
    padding: 12px 15px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    position: relative;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f5f5f5;

      .delete-icon {
        display: block;
      }
    }

    &.clickable {
      cursor: pointer;
      &:hover {
        background-color: #e6f7ff;
      }
    }

    .file-icon {
      display: flex;
      align-items: center;
      margin-right: 10px;
      svg {
        color: rgba(0, 0, 0, 0.45);
      }
    }

    .filename {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }

    &.upload-error {
      color: #f5222d;
      svg {
        color: #f5222d;
      }
    }

    .delete-icon {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 0;
      margin-left: 10px;
      transition: color 0.2s;

      &:hover {
        color: #ff4d4f;
      }
    }
  }
}

.upload-list-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}

.progress-wrapper {
  flex: 1;
  margin: 0 10px;
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;

  .progress-inner {
    height: 100%;
    background-color: #1890ff;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
}

.manual-upload-wrapper {
  margin-top: 8px;
  text-align: right;
  .manual-upload-btn {
    padding: 4px 12px;
    background-color: #1890ff;
    border: none;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #40a9ff;
    }
  }
}
</style>
