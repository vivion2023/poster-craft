<template>
  <div class="file-upload">
    <button @click="triggerUpload" :disabled="isUploading">
      <span v-if="isUploading">正在上传</span>
      <span v-else>点击上传</span>
    </button>
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
        <span class="filename">{{ file.name }}</span>
        <button class="delete-icon" @click="handleDelete(file.uid)">Del</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
type UploadStatus = "ready" | "loading" | "success" | "error";
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
}
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const uploadFiles = ref<UploadFile[]>([]);
    const isUploading = computed(() => {
      return uploadFiles.value.some((file) => file.status === "loading");
    });
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const uploadedFile = files[0];
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
      }
    };

    const handleDelete = (uid: string) => {
      uploadFiles.value = uploadFiles.value.filter((file) => file.uid !== uid);
    };

    return {
      fileInput,
      triggerUpload,
      isUploading,
      handleFileChange,
      handleDelete,
      uploadFiles,
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
