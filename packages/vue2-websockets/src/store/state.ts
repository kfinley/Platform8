export interface WebSocketsState {
  status: WebSocketsStatus
}

export enum WebSocketsStatus {
  None = "None",
  Connected = "Connected",
  Disconnected = "Disconnected",
  Failed = "Failed"
}
