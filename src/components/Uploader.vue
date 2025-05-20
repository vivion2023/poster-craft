<template>
  <div class="file-upload">
    <div class="upload-trigger" @click="triggerUploaded">
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
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
    <ul>
      <li
        :class="`uploaded-file upload-${file.status}`"
        v-for="file in uploadFiles"
        :key="file.uid"
      >
        <span v-if="file.status === 'loading'" class="file-icon"
          ><LoadingOutlined
        /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{ file.name }}</span>
        <button class="delete-icon" @click="handleDelete(file.uid)">
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
} from "@ant-design/icons-vue";
import axios from "axios";
import { last } from "lodash";
import { v4 as uuidv4 } from "uuid";
type UploadStatus = "ready" | "loading" | "success" | "error";
type CheckUpload = (file: File) => boolean | Promise<boolean | File>;
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  resp?: any;
}
export default defineComponent({
  components: {
    LoadingOutlined,
    FileOutlined,
    DeleteOutlined,
  },
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>,
    },
  },
  setup(props) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const uploadFiles = ref<UploadFile[]>([]);
    const isUploading = computed(() => {
      return uploadFiles.value.some((file) => file.status === "loading");
    });

    const lastFileData = computed(() => {
      const lastFile = last(uploadFiles.value);
      if (lastFile) {
        return {
          loaded: lastFile.status === "success",
          data: lastFile.resp,
        };
      }
      return false;
    });

    const triggerUploaded = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const postFile = (uploadedFile: File) => {
      const formData = new FormData();
      formData.append(uploadedFile.name, uploadedFile);
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: "loading",
        raw: uploadedFile,
      });
      uploadFiles.value.push(fileObj);
      axios
        .post(props.action, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          console.log(resp.data);
          fileObj.status = "success";
          fileObj.resp = resp.data;
        })
        .catch((err) => {
          console.log(err);
          fileObj.status = "error";
        })
        .finally(() => {
          if (fileInput.value) {
            fileInput.value.value = "";
          }
        });
    };

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const uploadedFile = files[0];
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile);
          if (result && result instanceof Promise) {
            result
              .then((processedFile) => {
                if (processedFile && processedFile instanceof File) {
                  postFile(processedFile);
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
            postFile(uploadedFile);
          }
        } else {
          postFile(uploadedFile);
        }
      }
    };

    const handleDelete = (uid: string) => {
      uploadFiles.value = uploadFiles.value.filter((file) => file.uid !== uid);
    };

    return {
      fileInput,
      triggerUploaded,
      isUploading,
      handleFileChange,
      handleDelete,
      uploadFiles,
      lastFileData,
    };
  },
});
</script>
<style scoped>
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
</style>

<style lang="scss">
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
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
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
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
</style>
