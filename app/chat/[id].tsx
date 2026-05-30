import { useLocalSearchParams } from "expo-router";
import { ChatRoomScreen } from "@/screens/chat/ChatRoomScreen";

export default function ChatRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return <ChatRoomScreen conversationId={id} />;
}
