import React, { useRef, useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    Pressable,
    View,
    Modal,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import useIdStore from '../../store/credentialStore';
import useThemeStore from '../../store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ChatBubbleButton = ({ showUnread = true }) => {
    const date = new Date();
    const theme = useThemeStore((state) => state.theme);
    const styles = getStyles(theme);

    const userid = useIdStore.getState().id;
    const API_URL = "http://209.126.4.145:4000";
    const [modalVisible, setModalVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const entranceY = useRef(new Animated.Value(100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const labelTranslateY = useRef(new Animated.Value(10)).current;
    const labelOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(entranceY, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        const idlePulseTimeout = setTimeout(() => {
            pulseLoop.start();
        }, 3000);

        return () => {
            clearTimeout(idlePulseTimeout);
            pulseLoop.stop();
        };
    }, []);

    const handleModalClose = () => {
        setModalVisible(false);
        setInput('');
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();

        Animated.parallel([
            Animated.spring(labelTranslateY, {
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.timing(labelOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();

        Animated.parallel([
            Animated.timing(labelTranslateY, {
                toValue: 10,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(labelOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePress = () => {
        setModalVisible(true);
    };



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
    };

    useEffect(() => {
        fetchMessages();
        axios.post(`${API_URL}/message/insert/${userid}`)
    }, [messages]);

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.message,
                item.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}
        >
            <Text style={[
                item.sender === 'user' ? styles.senderText : styles.messageText,
                item.sender === 'bot' && { color: '#000' },
            ]}>
                {item.text}
            </Text>
            <Text style={{ fontSize: 10, color: item.sender === 'user' ? '#000' : '#fff', marginTop: 4 }}>
                {`${(item.timestamp.getHours() % 12 || 12).toString().padStart(2, '0')}:${item.timestamp.getMinutes().toString().padStart(2, '0')}`}
            </Text>
        </View>
    );

    return (
        <>
            <View style={styles.container}>
                <Animated.Text
                    style={[
                        styles.label,
                        {
                            transform: [{ translateY: labelTranslateY }],
                            opacity: labelOpacity,
                        },
                    ]}
                >
                    Chat with us
                </Animated.Text>

                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handlePress}
                >
                    <Animated.View
                        style={[
                            styles.button,
                            {
                                transform: [
                                    { translateY: entranceY },
                                    { scale: Animated.multiply(scaleAnim, pulseAnim) },
                                ],
                                opacity: opacityAnim,
                            },
                        ]}
                    >
                        <Text style={styles.buttonText}>💬</Text>
                        {showUnread && <View style={styles.unreadDot} />}
                    </Animated.View>
                </Pressable>
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={handleModalClose}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            style={styles.modalContent}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>💬 Chat Support</Text>
                                <TouchableOpacity onPress={handleModalClose} style={styles.modalCloseButton}>
                                <Ionicons name="close" size={24} color={theme === 'dark' ? '#fff' : '#000'} style={styles.modalCloseButtonText} />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={messages}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                contentContainerStyle={styles.messageList}
                            />

                            <View style={styles.inputRow}>
                                <TextInput
                                    value={input}
                                    onChangeText={setInput}
                                    placeholder="Type a message..."
                                    style={styles.input}
                                />
                                <Pressable onPress={sendMessage} style={styles.sendButton}>
                                    <Ionicons name="send" size={20} color="#fff" />
                                </Pressable>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
    },
    label: {
        color: theme === 'dark' ? '#fff' : '#333',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        marginBottom: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    button: {
        backgroundColor: theme === 'dark' ? '#444' : '#007bff',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
    },
    unreadDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)',
    },
    modalContent: {
        flex: 1,
        marginTop: 100,
        backgroundColor: theme === 'dark' ? '#000' : '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme === 'dark' ? '#fff' : '#000',
    },
    modalCloseButton: {
        padding: 6,
    },
    modalCloseButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#fff",
        backgroundColor: theme === 'dark' ? '#444' : 'red',
        borderRadius: 20,
        padding: 4,
        elevation: 2,
    },
    messageList: {
        flexGrow: 1,
        paddingVertical: 10,
    },
    message: {
        padding: 10,
        marginVertical: 4,
        borderRadius: 10,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: theme === 'dark' ? '#555' : '#e0e0e0',
        alignSelf: 'flex-end',
    },
    botMessage: {
        backgroundColor: theme === 'dark' ? '#6a0dad' : '#a020f0',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: theme === 'dark' ? '#fff' : '#fff',
    },
    senderText: {
        color: theme === 'dark' ? '#fff' : '#000',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        backgroundColor: theme === 'dark' ? '#444' : '#f1f1f1',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        color: theme === 'dark' ? '#fff' : '#000',
    },
    sendButton: {
        backgroundColor: theme === 'dark' ? '#6a0dad' : '#a020f0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default ChatBubbleButton;
