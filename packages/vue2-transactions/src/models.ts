export interface UploadFileRequest {
  bucket: string;
  file: File;
}

export interface UploadFileResponse {
  success: boolean;
  error?: string | undefined;
}
