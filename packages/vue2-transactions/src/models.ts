
export interface UploadFileRequest {
  accountId: string;
  bucket: string;
  file: File;
}

export interface UploadFileResponse {
  success: boolean;
  error?: string | undefined;
}
