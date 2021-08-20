export interface DeleteConnectionRequest {
  userId?: string;
  connectionId?: string;
}

export interface DeleteConnectionResponse {
  success: boolean;
}
