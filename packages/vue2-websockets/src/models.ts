export interface Socket {
  send(data: any): void;
  json(data: any): void;
  close(code?: number, reason?: string): void;
  reconnect(): void;
  open(): void;
}
