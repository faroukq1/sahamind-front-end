import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner-native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Animated Message Component
const AnimatedMessage = ({
  message,
  color,
}: {
  message: Message;
  color: string;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className={`mb-4 ${message.isUser ? "items-end" : "items-start"}`}
    >
      {/* AI messages with gradient avatar */}
      {!message.isUser && (
        <View className="flex-row items-end mb-1 max-w-[80%]">
          <View
            className="w-9 h-9 rounded-full items-center justify-center mr-2 shadow-sm"
            style={{
              backgroundColor: "#fff",
              borderWidth: 2,
              borderColor: `${color}30`,
            }}
          >
            <Ionicons name="sparkles" size={18} color={color} />
          </View>
          <View className="flex-1">
            <View
              className="px-4 py-3 rounded-3xl rounded-tl-sm shadow-md"
              style={{
                backgroundColor: "#fff",
                borderLeftWidth: 3,
                borderLeftColor: color,
              }}
            >
              <Text className="text-[15px] leading-6 text-gray-800">
                {message.text}
              </Text>
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="checkmark-done" size={12} color={color} />
                <Text className="text-[11px] ml-1 text-gray-400">
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* User messages with gradient */}
      {message.isUser && (
        <View className="flex-row items-end justify-end max-w-[80%]">
          <View className="flex-1">
            <View
              className="px-4 py-3 rounded-3xl rounded-tr-sm shadow-md"
              style={{ backgroundColor: color }}
            >
              <Text className="text-[15px] leading-6 text-white font-medium">
                {message.text}
              </Text>
              <View className="flex-row items-center justify-end mt-1.5">
                <Ionicons name="checkmark-done" size={12} color="white" />
                <Text className="text-[11px] ml-1 text-white/90 text-right">
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default function ChatScreen() {
  const router = useRouter();
  const { issue, color, bgColor } = useLocalSearchParams();
  const { user } = useAuthStore();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // System prompts for each mental health issue
  const getSystemPrompt = (issueName: string) => {
    const prompts: { [key: string]: string } = {
      Sadness:
        "You are a compassionate AI therapist specializing in helping people cope with sadness. Provide empathetic support, validate their feelings, and offer gentle guidance. Focus on understanding their emotions and helping them find healthy ways to process sadness.",
      Depression:
        "You are a caring mental health assistant specializing in depression support. Offer understanding and evidence-based coping strategies. Help users identify negative thought patterns and suggest professional help when needed. Be patient and encouraging.",
      Anxiety:
        "You are a calming AI counselor specializing in anxiety management. Help users with breathing exercises, grounding techniques, and cognitive behavioral strategies. Provide reassurance and practical tools to manage anxious thoughts and feelings.",
      Burnout:
        "You are a supportive life coach specializing in burnout recovery. Help users identify sources of stress, set boundaries, and develop self-care routines. Focus on work-life balance and sustainable productivity strategies.",
      Stress:
        "You are a stress management expert. Provide practical stress-reduction techniques, time management tips, and mindfulness exercises. Help users prioritize and develop healthy coping mechanisms for daily stressors.",
      Loneliness:
        "You are an empathetic companion helping people cope with loneliness. Offer connection strategies, social skills support, and validation of their feelings. Suggest meaningful ways to build relationships and community.",
      Grief:
        "You are a gentle grief counselor. Provide compassionate support for those experiencing loss. Help them understand the grieving process, validate their emotions, and guide them through their healing journey with patience and understanding.",
      "Panic Attacks":
        "You are a crisis support specialist for panic attacks. Teach grounding techniques, breathing exercises, and panic management strategies. Provide immediate calming support and help users understand their triggers.",
      "Low Self-Esteem":
        "You are a confidence-building coach. Help users challenge negative self-talk, recognize their strengths, and develop self-compassion. Provide affirmations and practical exercises to build healthy self-esteem.",
      Trauma:
        "You are a trauma-informed support specialist. Provide safe, gentle support while recognizing the complexity of trauma. Focus on safety, grounding, and empowerment. Always recommend professional trauma therapy for deeper healing.",
      "Sleep Issues":
        "You are a sleep wellness expert. Help users develop healthy sleep hygiene, identify sleep disruptors, and create calming bedtime routines. Provide evidence-based tips for better sleep quality.",
      "Relationship Issues":
        "You are a relationship counselor. Help users improve communication, set boundaries, and navigate relationship challenges. Provide balanced perspectives and conflict resolution strategies.",
    };

    return (
      prompts[issueName] ||
      "You are a compassionate mental health support AI. Provide empathetic, helpful guidance while encouraging professional help when needed."
    );
  };

  useEffect(() => {
    // Send initial greeting message
    const initialMessage: Message = {
      id: Date.now().toString(),
      text: `Hello! I'm here to help you with ${issue}. How are you feeling today? Feel free to share what's on your mind.`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText.trim();
    setInputText("");
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }));

      // Add current user message
      conversationHistory.push({
        role: "user",
        content: currentInput,
      });

      // Call Groq API
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "YOUR API HERE",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: getSystemPrompt(issue as string),
              },
              ...conversationHistory,
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText =
        data.choices[0]?.message?.content ||
        "I'm here to listen. Could you tell me more?";

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error calling Groq API:", error);
      toast.error("Failed to get response. Please try again.");

      // Add error fallback message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
      setIsLoading(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gradient-to-b from-gray-50 to-white"
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Enhanced Header with Gradient and Shadow */}
        <View
          className="shadow-xl"
          style={{
            backgroundColor: color as string,
            shadowColor: color as string,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="px-5 py-4">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.back()}
                className="mr-4 w-11 h-11 rounded-full bg-white/20 items-center justify-center backdrop-blur-lg"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>

              <View className="flex-1">
                <Text className="text-white text-xl font-bold tracking-tight">
                  {issue}
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-2.5 h-2.5 rounded-full bg-green-400 mr-2 shadow-sm" />
                  <Text className="text-white/95 text-xs font-semibold">
                    AI Therapist • Available 24/7
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Decorative bottom curve */}
          <View
            className="h-6"
            style={{
              backgroundColor: "#F9FAFB",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          />
        </View>

        {/* Messages with improved styling */}
        <View className="flex-1 bg-gray-50">
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          >
            {/* Welcome Card */}
            <View className="mb-6 mt-2">
              <View
                className="bg-white rounded-2xl p-4 shadow-sm"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: color as string,
                }}
              >
                <View className="flex-row items-start">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color={color as string}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold text-sm mb-1">
                      Safe & Confidential Space
                    </Text>
                    <Text className="text-gray-600 text-xs leading-5">
                      Your conversations are private. Feel free to express
                      yourself openly.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {messages.map((message) => (
              <AnimatedMessage
                key={message.id}
                message={message}
                color={color as string}
              />
            ))}

            {isLoading && (
              <Animated.View className="items-start mb-4">
                <View className="flex-row items-end max-w-[80%]">
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center mr-2 shadow-sm"
                    style={{
                      backgroundColor: "#fff",
                      borderWidth: 2,
                      borderColor: `${color}30`,
                    }}
                  >
                    <Ionicons
                      name="sparkles"
                      size={18}
                      color={color as string}
                    />
                  </View>
                  <View className="bg-white px-6 py-4 rounded-3xl rounded-tl-sm shadow-md">
                    <View className="flex-row gap-2">
                      <Animated.View
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: color as string,
                          opacity: 0.4,
                        }}
                      />
                      <Animated.View
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: color as string,
                          opacity: 0.6,
                        }}
                      />
                      <Animated.View
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: color as string,
                          opacity: 0.8,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}
          </ScrollView>
        </View>

        {/* Enhanced Input Area with Gradient Border */}
        <View
          className="bg-white px-4 py-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          {/* Quick action buttons */}
          <View className="flex-row mb-3 gap-2">
            <TouchableOpacity
              className="px-3 py-2 rounded-full bg-gray-100"
              onPress={() => setInputText("I'm feeling overwhelmed")}
            >
              <Text className="text-gray-700 text-xs font-medium">
                😔 Feeling overwhelmed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-3 py-2 rounded-full bg-gray-100"
              onPress={() => setInputText("I need some advice")}
            >
              <Text className="text-gray-700 text-xs font-medium">
                💭 Need advice
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-8 flex-row items-end">
            <View className="flex-1 mr-3">
              <View
                className="rounded-3xl px-4 py-3 shadow-sm"
                style={{
                  backgroundColor: "#F9FAFB",
                  borderWidth: 1.5,
                  borderColor: inputText.trim() ? (color as string) : "#E5E7EB",
                }}
              >
                <TextInput
                  className="text-gray-800 text-[14px] max-h-24"
                  placeholder="Share your thoughts..."
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={1000}
                  placeholderTextColor="#9CA3AF"
                  style={{ textAlignVertical: "top", minHeight: 20 }}
                />
              </View>
              {inputText.length > 0 && (
                <Text className="text-xs text-gray-400 mt-1 ml-4">
                  {inputText.length}/1000
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="w-12 h-12 rounded-full items-center justify-center shadow-lg"
              style={{
                backgroundColor: inputText.trim()
                  ? (color as string)
                  : "#D1D5DB",
                shadowColor: inputText.trim() ? (color as string) : "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: inputText.trim() ? 0.4 : 0.1,
                shadowRadius: 8,
                elevation: 8,
                marginBottom: 2,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name={inputText.trim() ? "send" : "send-outline"}
                  size={20}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
