<template>
  <div class="image-processer">
    <a-modal
      title="裁剪图片"
      v-model:open="showModal"
      @ok="handleOk"
      @cancel="showModal = false"
      okText="确认"
      cancelText="取消"
    >
      <div class="image-cropper">
        <img :src="baseImageUrl" id="processed-image" ref="cropperImg" />
      </div>
    </a-modal>
    <div class="image-container">
      <div
        class="image-preview"
        :style="{ backgroundImage: backgrondUrl }"
        :class="{ extraHeight: showDelete }"
      ></div>
      <div class="image-process">
        <StyledUploader
          :show-upload-list="false"
          :auto-upload="true"
          @success="handleFileUploaded"
        />
        <a-button @click="showModal = true">
          <template v-slot:icon><ScissorOutlined /></template>裁剪图片
        </a-button>
        <a-button v-if="showDelete" type="danger" @click="handleDelete">
          <template v-slot:icon><DeleteOutlined /></template>删除图片
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  nextTick,
  withDefaults,
  defineProps,
  defineEmits,
} from "vue";
import { message } from "ant-design-vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
// 图标已通过 configAntD.ts 全局注册，无需导入
import StyledUploader from "./StyledUploader.vue";
import axios from "axios";
import { UploadData } from "@/store/respTypes";

// 定义 props 接口
interface Props {
  value: string;
  ratio?: number;
  showDelete?: boolean;
}

// 定义 emits 接口
interface Emits {
  (e: "change", value: string): void;
  (e: "uploaded", data: any): void;
}

// 定义 CropData 接口
interface CropDataProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 使用 defineProps 和 defineEmits
const props = withDefaults(defineProps<Props>(), {
  showDelete: false,
});

const emit = defineEmits<Emits>();

// 响应式数据
const showModal = ref(false);
const backgrondUrl = computed(() =>
  props.value ? `url(${props.value})` : "none"
);
const baseImageUrl = computed(() =>
  props.value ? props.value.split("?")[0] : ""
);
const cropperImg = ref<null | HTMLImageElement>(null);

// 裁剪相关变量
let cropper: Cropper;
let cropData: CropDataProps | null = null;
watch(showModal, async (newValue) => {
  if (newValue) {
    await nextTick();
    console.log(cropperImg.value);
    if (cropperImg.value) {
      cropper = new Cropper(cropperImg.value, {
        aspectRatio: props.ratio || NaN, // 使用传入的比例或自由裁剪
        viewMode: 1, // 限制裁剪框不超出画布
        dragMode: "move", // 拖拽模式
        autoCropArea: 0.8, // 自动裁剪区域大小
        restore: false, // 不恢复裁剪
        guides: true, // 显示网格线
        center: true, // 显示中心指示器
        highlight: true, // 显示裁剪框上方的高亮区域
        cropBoxMovable: true, // 裁剪框可移动
        cropBoxResizable: true, // 裁剪框可调整大小
        toggleDragModeOnDblclick: false, // 双击不切换拖拽模式
        crop(event: any) {
          const { x, y, width, height } = event.detail;
          cropData = {
            x: Math.floor(x),
            y: Math.floor(y),
            width: Math.floor(width),
            height: Math.floor(height),
          };
        },
      });
    }
  } else {
    if (cropper) {
      cropper.destroy();
    }
  }
});
const handleOk = () => {
  if (cropData && cropper) {
    // 使用 cropper.getCroppedCanvas() 获取裁剪后的图片并上传
    cropper.getCroppedCanvas().toBlob((blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append("croppedImage", blob, "cropped-image.png");
        axios
          .post("http://localhost:7001/api/utils/upload-local-img", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((resp: any) => {
            emit("change", resp.data.data.url);
            showModal.value = false;
          })
          .catch((error) => {
            console.error("上传裁剪图片失败:", error);
            message.error("上传失败，请重试");
          });
      }
    });
  } else {
    showModal.value = false;
  }
};
// 处理文件上传成功
const handleFileUploaded = (data: {
  resp: { data: { url: string } };
  file: File;
}) => {
  const { resp } = data;
  message.success("上传成功");
  emit("change", resp.data.url);
  emit("uploaded", data);
};

// 处理删除图片
const handleDelete = () => {
  emit("change", "");
};
</script>

<style scoped>
.image-container {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.image-preview {
  width: 150px;
  height: 84px;
  border: 1px dashed #e6ebed;
  background: no-repeat 50% / contain;
  flex-shrink: 0;
}

.image-preview.extraHeight {
  height: 110px;
}

.image-process {
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  flex-grow: 1;
}

.image-cropper {
  max-height: 400px;
  overflow: hidden;
}

.image-cropper img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
  height: auto;
}
</style>
