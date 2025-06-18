export interface UploadResp {
  resp: {
    code: number;
    message: string;
    data: {
      url: string;
    };
  };
}
