import { Socket } from "../models";

export interface WebSocketsState {
  status: WebSocketsStatus;
  socket?: Socket;
}

export enum WebSocketsStatus {
  None = "None",
  Connected = "Connected",
  Disconnected = "Disconnected",
  Failed = "Failed"
}
