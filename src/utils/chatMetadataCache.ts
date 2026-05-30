// Client-side cache for conversation names and avatars to handle backend limitations
type Metadata = {
  name: string;
  avatarUrl?: string | null;
};

class ChatMetadataCache {
  private cache = new Map<string, Metadata>();

  set(conversationId: string, metadata: Metadata) {
    this.cache.set(conversationId, metadata);
  }

  get(conversationId: string): Metadata | undefined {
    return this.cache.get(conversationId);
  }

  has(conversationId: string): boolean {
    return this.cache.has(conversationId);
  }
}

export const chatMetadataCache = new ChatMetadataCache();
