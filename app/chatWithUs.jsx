import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import useThemeStore from "../store/themeStore";
import axios from "axios";
import useIdStore from "../store/credentialStore";
import Ionicons from "react-native-vector-icons/Ionicons";

const ChatWithUs = () => {
  const userid = useIdStore.getState().id;
  const API_URL = "http://209.126.4.145:4000";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useThemeStore((state) => state.theme);
  const styles = getstyles(theme);
  const flatListRef = useRef();

  const fetchMessages = async () => {
    try {
      const res = await axios.post(`${API_URL}/message/getMessagesByUser/${userid}`);
      if (res.data.status && res.data.data.length > 0) {
        const formattedMessages = res.data.data[0].messages.map((msg, index) => ({
          id: index.toString(),
          sender: msg.owner === "user" ? "user" : "support",
          text: msg.message,
          timestamp: new Date(msg.date),
        }));
        setMessages([
          {
            id: "welcome",
            sender: "support",
            text: "Hey! 👋 How can we assist you today?",
            timestamp: new Date(),
          },
          ...formattedMessages,
        ]);
      } else {
        setMessages([
          {
            id: "welcome",
            sender: "support",
            text: "Hey! 👋 How can we assist you today?",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      await axios.put(`${API_URL}/message/update/${userid}`, {
        content: newMessage.text,
        owner: "user",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setIsTyping(true);

    setTimeout(() => {
      const supportMessage = {
        id: (Date.now() + 1).toString(),
        sender: "support",
        text: "Thanks for messaging! We'll respond shortly. 🙏",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageRow,
        item.sender === "user" ? styles.userRow : styles.supportRow,
      ]}
    >
      {item.sender === "support" && (
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=65" }}
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.messageBubble,
          item.sender === "user" ? styles.userBubble : styles.supportBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: item.sender === "user" ? "#fff" : "#000" },
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>

      {item.sender === "user" && (
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
      )}
    </View>
  );

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28C76F" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#28C76F" />
          <Text style={styles.typingText}>Support is typing...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const getstyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === "dark" ? "#000" : "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme === "dark" ? "#000" : "#fff",
  },
  messagesContainer: { padding: 12 },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  userRow: { justifyContent: "flex-end" },
  supportRow: { justifyContent: "flex-start" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
  },
  userBubble: {
    backgroundColor: theme === 'dark' ? '#6a0dad' : '#a020f0',
  },
  supportBubble: {
    backgroundColor: theme === 'dark' ? '#fff' : '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderColor: "#ddd",
    backgroundColor: theme === 'dark' ? '#000' : '#fff',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#777' : '#f0f0f0',
    color: theme === 'dark' ? '#fff' : '#000',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  sendButton: {
    backgroundColor: theme === 'dark' ? '#6a0dad' : '#a020f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#28C76F",
  },
});

export default ChatWithUs;
