<template>
  <div class="login-container">
    <a-row class="login-row" style="min-height: 100vh">
      <a-col :span="12" class="login-left">
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
      <a-col :span="12" class="login-right">
        <Form
          :model="formState"
          name="loginForm"
          layout="vertical"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <h1 class="title">欢迎回来</h1>
          <p class="desc">使用手机号码和验证码登录到慕课乐高</p>
          <Form.Item name="username">
            <Input
              shape="round"
              placeholder="请输入手机号码"
              :rules="[{ required: true, message: '请输入手机号码' }]"
            >
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </Input>
          </Form.Item>
          <Form.Item name="password">
            <Input
              shape="round"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入四位验证码' }]"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </Input>
          </Form.Item>
          <Form.Item>
            <Space :size="16">
              <Button type="primary" htmlType="submit">登录</Button>
              <Button htmlType="submit">获取验证码</Button>
            </Space>
          </Form.Item>
        </Form>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { Typography, Space, Form, Input, Button } from "ant-design-vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";

const { Title, Paragraph } = Typography;

const router = useRouter();

const toHome = () => {
  router.push("/");
};

const formState = reactive({
  username: "",
  password: "",
});

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
