import { ENV } from "@/config/env";
import { getAccessToken } from "@/storage/authStorage";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { MessageResponse } from "./chat.types";

type MessageCallback = (message: MessageResponse) => void;
type DeleteCallback = (payload: { messageId: string; conversationId: string }) => void;
type TypingCallback = (payload: { conversationId: string; userId: string }) => void;
type ConnectionCallback = (isConnected: boolean) => void;

class ChatSignalRService {
  private connection: HubConnection | null = null;
  private messageListeners = new Set<MessageCallback>();
  private deleteListeners = new Set<DeleteCallback>();
  private typingListeners = new Set<TypingCallback>();
  private stopTypingListeners = new Set<TypingCallback>();
  private statusListeners = new Set<ConnectionCallback>();

  constructor() {
  }

  private getHubUrl(): string {
    const baseUrl = ENV.API_BASE_URL;
    const cleanUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanUrl}/hubs/chat`;
  }

  async connect(): Promise<void> {
    if (this.connection) {
      if (this.connection.state === HubConnectionState.Connected) {
        return;
      }
      await this.disconnect();
    }

    const hubUrl = this.getHubUrl();
    console.log("[SignalR] Connecting to:", hubUrl);

    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: async () => {
          const token = await getAccessToken();
          return token || "";
        },
        transport: HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on("ReceiveMessage", (message: MessageResponse) => {
      console.log("[SignalR] ReceiveMessage:", message);
      this.messageListeners.forEach((cb) => {
        try {
          cb(message);
        } catch (e) {
          console.error(e);
        }
      });
    });

    this.connection.on("MessageDeleted", (payload: { messageId: string; conversationId: string }) => {
      console.log("[SignalR] MessageDeleted:", payload);
      this.deleteListeners.forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error(e);
        }
      });
    });

    this.connection.on("UserTyping", (payload: { conversationId: string; userId: string }) => {
      console.log("[SignalR] UserTyping:", payload);
      this.typingListeners.forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error(e);
        }
      });
    });

    this.connection.on("UserStopTyping", (payload: { conversationId: string; userId: string }) => {
      console.log("[SignalR] UserStopTyping:", payload);
      this.stopTypingListeners.forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error(e);
        }
      });
    });

    this.connection.onreconnecting((error) => {
      console.warn("[SignalR] Reconnecting due to error:", error);
      this.notifyStatus(false);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("[SignalR] Reconnected. Connection ID:", connectionId);
      this.notifyStatus(true);
    });

    this.connection.onclose((error) => {
      console.error("[SignalR] Connection closed:", error);
      this.notifyStatus(false);
    });

    try {
      await this.connection.start();
      console.log("[SignalR] Connected successfully. State:", this.connection.state);
      this.notifyStatus(true);
    } catch (error) {
      console.error("[SignalR] Failed to start connection:", error);
      this.notifyStatus(false);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connection) return;

    try {
      console.log("[SignalR] Disconnecting...");
      await this.connection.stop();
    } catch (error) {
      console.error("[SignalR] Error while disconnecting:", error);
    } finally {
      this.connection = null;
      this.notifyStatus(false);
    }
  }

  get isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  async joinConversation(conversationId: string): Promise<void> {
    if (!this.isConnected || !this.connection) {
      console.warn("[SignalR] Cannot JoinConversation, not connected");
      return;
    }
    try {
      await this.connection.invoke("JoinConversation", conversationId);
      console.log(`[SignalR] Joined conversation group: ${conversationId}`);
    } catch (error) {
      console.error(`[SignalR] JoinConversation failed for ${conversationId}:`, error);
    }
  }

  async typing(conversationId: string): Promise<void> {
    if (!this.isConnected || !this.connection) return;
    try {
      await this.connection.invoke("Typing", conversationId);
    } catch (error) {
      console.error("[SignalR] Typing invocation failed:", error);
    }
  }

  async stopTyping(conversationId: string): Promise<void> {
    if (!this.isConnected || !this.connection) return;
    try {
      await this.connection.invoke("StopTyping", conversationId);
    } catch (error) {
      console.error("[SignalR] StopTyping invocation failed:", error);
    }
  }

  onMessageReceived(cb: MessageCallback): () => void {
    this.messageListeners.add(cb);
    return () => this.messageListeners.delete(cb);
  }

  onMessageDeleted(cb: DeleteCallback): () => void {
    this.deleteListeners.add(cb);
    return () => this.deleteListeners.delete(cb);
  }

  onUserTyping(cb: TypingCallback): () => void {
    this.typingListeners.add(cb);
    return () => this.typingListeners.delete(cb);
  }

  onUserStopTyping(cb: TypingCallback): () => void {
    this.stopTypingListeners.add(cb);
    return () => this.stopTypingListeners.delete(cb);
  }

  onStatusChanged(cb: ConnectionCallback): () => void {
    this.statusListeners.add(cb);
    cb(this.isConnected);
    return () => this.statusListeners.delete(cb);
  }

  private notifyStatus(isConnected: boolean) {
    this.statusListeners.forEach((cb) => {
      try {
        cb(isConnected);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

export const chatSignalRService = new ChatSignalRService();
