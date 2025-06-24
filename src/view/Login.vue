<template>
  <div class="login-container">
    <a-row class="login-row" style="min-height: 100vh">
      <a-col :span="11" class="login-left">
        <Space direction="vertical" :size="20">
          <div class="logo-box" @click="toHome">
            <Space :size="8">
              <img src="@/assets/logo.png" alt="logo" />
              <Title :level="1" class="title">慕课乐高</Title>
            </Space>
          </div>
          <div class="content">
            <Paragraph class="desc">
              慕课乐高，一个专注于乐高教育的平台，致力于为乐高爱好者提供一个学习、交流、分享的平台。
            </Paragraph>
            <Paragraph class="writer"> vivion, 2025-04-24 </Paragraph>
          </div>
        </Space>
      </a-col>
      <a-col :span="13" class="login-right">
        <a-form
          :model="form"
          name="loginForm"
          layout="vertical"
          autocomplete="off"
          ref="loginForm"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          :rules="rules"
        >
          <h1 class="title">欢迎回来</h1>
          <p class="desc">使用手机号码和验证码登录到慕课乐高</p>
          <a-form-item name="cellphone" label="手机号码" required>
            <a-input
              shape="round"
              placeholder="请输入手机号码"
              v-model:value="form.cellphone"
            >
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="verityCode" label="验证码" required>
            <a-input
              shape="round"
              placeholder="请输入验证码"
              v-model:value="form.verityCode"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <Space :size="16">
              <Button type="primary" @click="login">登录</Button>
              <Button :disabled="codeButtonDisable" @click="getCode"
                >获取验证码</Button
              >
            </Space>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { Typography, Space, Button, message, Form } from "ant-design-vue";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { Rule } from "ant-design-vue/es/form/interface";
import type { FormInstance } from "ant-design-vue";
import axios from "axios";

const { useForm } = Form;

const { Title, Paragraph } = Typography;

const router = useRouter();

const toHome = () => {
  router.push("/");
};

const codeButtonDisable = computed(() => {
  return !/^1[3-9]\d{9}$/.test(form.cellphone.trim());
});

const form = reactive({
  cellphone: "",
  verityCode: "",
});

const loginForm = ref<FormInstance>();

const cellNumberValidator = (rule: Rule, value: string) => {
  return new Promise((resolve, reject) => {
    const passed = /^1[3-9]\d{9}$/.test(value.trim());
    // trim用于去除字符串两端的空格
    setTimeout(() => {
      if (passed) {
        resolve("");
      } else {
        reject("手机号格式不正确");
      }
    }, 500);
  });
};
const rules = reactive({
  cellphone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    { validator: cellNumberValidator, trigger: "blur" },
  ],
  verityCode: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
});

const { validate, resetFields } = useForm(form, rules);

const login = () => {
  if (!loginForm.value) {
    message.error("请输入正确的信息");
    return;
  }

  validate()
    .then(() => {
      message.success("登录成功");
      resetFields();
    })
    .catch(() => {
      message.error("请输入正确的信息");
    });
};

const getCode = () => {
  axios.post("/users/getUserInfo", { phoneNumber: form.cellphone }).then(() => {
    message.success("验证码已发送,请注意查收", 5);
  });
};

const onFinish = (values: any) => {
  console.log(values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log(errorInfo);
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;

  .login-left,
  .login-right {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-left {
    background: url("@/assets/login-bg.png") center/cover no-repeat;
    .logo-box {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }
    img {
      width: 62px;
      height: 62px;
      display: block;
    }
    .title {
      margin: 0;
      padding: 0;
      color: #fff;
    }
    .content {
      margin: 0 100px;
      text-align: center;
      .desc {
        color: #ccc;
        font-size: 20px;
        margin-bottom: 30px;
      }
      .writer {
        color: rgba(211, 211, 211, 0.7);
        font-size: 16px;
      }
    }
  }

  .login-right {
    background: #fff;
    form {
      text-align: start;
      font-size: 22px;
      h1 {
        color: #333;
        margin-bottom: 10px;
      }
      .desc {
        color: #666;
      }
      :deep(.ant-input) {
        font-size: 18px;
        width: 100%;
      }

      :deep(.ant-input-affix-wrapper) {
        border-radius: 10px;
      }

      button {
        margin-top: 20px;
        border-radius: 20px;
        height: 40px;
        padding: 0 20px;
        font-size: 20px;
      }
    }
  }
}
</style>
