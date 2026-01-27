import {
  IUserMessage,
  IUserReadMessage,
  IUserTypingMessage,
  MsgUserListResponseModel,
} from "@/models/messageInterface";
import useSocket from "@/util/socket";
import { useEffect, useState } from "react";

interface UseChatMessagesProps {
  currentUserId?: number;
  selectedUserId?: number | null;
}

export const useChatMessagesHook = ({
  currentUserId,
  selectedUserId,
}: UseChatMessagesProps) => {
  const socket = useSocket(currentUserId?.toString());
  const [newMessage, setNewMessage] = useState<IUserMessage | null>(null);
  const [messages, setMessages] = useState<IUserMessage[]>([]);
  const [allUsers, setAllUsers] = useState<MsgUserListResponseModel[]>([]);
  const [typingUser, setTypingUser] = useState<IUserTypingMessage | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const unreadMessageUserCount = (response: { totalCount: number }) => {
    setUnreadCount(response.totalCount);
  };

  const updateReadMessages = (updatedMessages: IUserMessage[]) => {
    if (!updatedMessages?.length) return;

    setMessages((prev) => {
      const updatedMap = new Map(updatedMessages.map((msg) => [msg.id, msg]));
      return prev.map((msg) => {
        const updated = updatedMap.get(msg.id);
        if (!updated) return msg;

        return {
          ...msg,
          is_read: updated.is_read,
          status: updated.status,
          modified_date: updated.modified_date?.toString() ?? msg.modified_date,
        };
      });
    });

    setAllUsers((prevUsers) => {
      return prevUsers.map((user) => {
        const updatedMsg = updatedMessages.find(
          (msg) => msg.id === user.message.id
        );

        if (!updatedMsg) return user;

        return {
          ...user,
          message: {
            ...user.message,
            is_read: updatedMsg.is_read,
            status: updatedMsg.status,
            modified_date:
              updatedMsg.modified_date?.toString() ??
              user.message.modified_date,
          },
        };
      });
    });
  };

  const receiveNewMessage = (message: IUserMessage) => {
    const newMessage = {
      id: message.id,
      message: message.message,
      created_date: message.created_date.toString(),
      modified_date: message.modified_date?.toString() || "",
      status: message.status,
      is_read: message.is_read,
      deleted_date: message.deleted_date?.toString() || "",
      file_url: message?.file_url,
      file_type: message?.file_type,
      file_name: message?.file_name,
      file_size: message?.file_size,
      latitude: message?.latitude,
      longitude: message?.longitude,
      location_name: message?.location_name,
      sender: {
        id: message?.sender?.id,
        user_name: message?.sender?.user_name,
        first_name: message?.sender?.first_name,
        last_name: message?.sender?.last_name,
        photo_url: message?.sender?.photo_url,
      },
      receiver: {
        id: message?.receiver?.id,
        user_name: message?.receiver?.user_name,
        first_name: message?.receiver?.first_name,
        last_name: message?.receiver?.last_name,
        photo_url: message?.receiver?.photo_url,
      },
    };
    setNewMessage(newMessage);
    if (newMessage?.sender?.id !== newMessage?.receiver?.id) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
    const newUserMessage: MsgUserListResponseModel = {
      id: message.sender.id,
      user_name: message.sender.user_name,
      first_name: message.sender.first_name || "",
      last_name: message.sender.last_name || "",
      photo_url: message.sender.photo_url || "",
      message: {
        id: message.id,
        last_message: message.message,
        created_date: message.created_date,
        sender_id: message.sender.id,
        receiver_id: message.receiver?.id,
        modified_date: message.modified_date || "",
        is_read: message.is_read || false,
        status: message.status,
      },
    };
    setAllUsers((prevUsers) => {
      const existingIndex = prevUsers.findIndex(
        (user) => user.user_name === message.sender.user_name
      );
      if (existingIndex !== -1) {
        const updatedUsers = [...prevUsers];
        updatedUsers.splice(existingIndex, 1);
        return [newUserMessage, ...updatedUsers];
      }
      return [newUserMessage, ...prevUsers];
    });
    setUnreadCount((prevCount) => prevCount + 1);
  };

  const userTyping = (data: IUserTypingMessage) => {
    if (data.type_user_id !== currentUserId) {
      setTypingUser(data);
    }
  };

  const messageEdited = (data: IUserMessage) => {
    setMessages((prev) => prev.map((msg) => (msg.id === data.id ? data : msg)));
    setAllUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.message?.id === data.id) {
          return {
            ...user,
            message: {
              ...user.message,
              ...data,
              modified_date:
                data.modified_date?.toString() ?? user.message.modified_date,
            },
          };
        }

        return user;
      })
    );
  };
  const messageDeleted = (data: { message_id: number }) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== data.message_id));
    setAllUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.message?.id === data.message_id) {
          return {
            ...user,
            message: {
              ...user.message,
              last_message: "This message was deleted",
            },
          };
        }

        return user;
      })
    );
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", receiveNewMessage);
    socket.on("check_read_message", updateReadMessages);
    socket.on("user_typing", userTyping);
    socket.on("unread_messages_total_users", unreadMessageUserCount);
    socket.on("message_edited", messageEdited);
    socket.on("message_deleted", messageDeleted);

    return () => {
      socket.off("receive_message", receiveNewMessage);
      socket.off("check_read_message", updateReadMessages);
      socket.off("user_typing", userTyping);
      socket.off("unread_messages_total_users", unreadMessageUserCount);
      socket.off("message_edited", messageEdited);
      socket.off("message_deleted", messageDeleted);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedUserId]);

  const handleSendMsg = (data: IUserMessage) => {
    if (socket && data) {
      socket.emit("send_message", data);
    }
  };

  const handleTyping = (value: string, selectedUserName?: string) => {
    if (socket && selectedUserId && selectedUserName) {
      const data: IUserTypingMessage = {
        receiver_id: selectedUserId,
        is_typing: value.trim().length > 0,
        type_user_id: currentUserId || 0,
        type_user_name: selectedUserName || "",
      };
      socket.emit("typing_indicator", data);
    }
  };

  const handleReadMessage = () => {
    if (socket && selectedUserId) {
      const payload: IUserReadMessage = {
        selected_user_id: selectedUserId,
        current_user_id: currentUserId || 0,
      };
      socket.emit("read_message", payload);
    }
  };

  const handleEditMessage = (updatedData: IUserMessage) => {
    if (socket && updatedData) {
      socket.emit("edit_message", updatedData);
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    if (socket) {
      socket.emit("delete_message", {
        message_id: messageId,
        receiver_id: selectedUserId,
        sender_id: currentUserId,
      });
    }
  };

  return {
    newMessage,
    messages,
    setMessages,
    allUsers,
    setAllUsers,
    typingUser,
    setTypingUser,
    handleSendMsg,
    handleTyping,
    handleReadMessage,
    unreadCount,
    setUnreadCount,
    handleEditMessage,
    handleDeleteMessage,
  };
};
