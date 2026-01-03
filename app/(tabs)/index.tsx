import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";

export default function Index() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [selectedIssue, setSelectedIssue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const mentalHealthIssues = [
    { name: "Sadness", color: "#EF4444", bgColor: "#FEE2E2" },
    { name: "Depression", color: "#8B5CF6", bgColor: "#EDE9FE" },
    { name: "Anxiety", color: "#F59E0B", bgColor: "#FEF3C7" },
    { name: "Burnout", color: "#DC2626", bgColor: "#FEE2E2" },
    { name: "Stress", color: "#3B82F6", bgColor: "#DBEAFE" },
    { name: "Loneliness", color: "#6366F1", bgColor: "#E0E7FF" },
    { name: "Grief", color: "#4B5563", bgColor: "#F3F4F6" },
    { name: "Panic Attacks", color: "#EC4899", bgColor: "#FCE7F3" },
    { name: "Low Self-Esteem", color: "#10B981", bgColor: "#D1FAE5" },
    { name: "Trauma", color: "#7C3AED", bgColor: "#EDE9FE" },
    { name: "Sleep Issues", color: "#0891B2", bgColor: "#CFFAFE" },
    { name: "Relationship Issues", color: "#F97316", bgColor: "#FFEDD5" },
  ];

  const getIssueColor = (issueName: string) => {
    const issue = mentalHealthIssues.find((i) => i.name === issueName);
    return issue || { name: issueName, color: "#4A7DFF", bgColor: "#DBEAFE" };
  };

  const selectedColor = selectedIssue ? getIssueColor(selectedIssue) : null;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get user display name
  const getUserName = () => {
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const handleChat = () => {
    if (!selectedIssue) {
      return;
    }
    const issueData = getIssueColor(selectedIssue);
    setShowDropdown(false);

    router.push({
      pathname: "/chat",
      params: {
        issue: selectedIssue,
        color: issueData.color,
        bgColor: issueData.bgColor,
      },
    });
  };

  return (
    <View className="flex-1 bg-[#F5F7FA]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-4 pb-5 bg-white">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3">
            <Text className="text-xl font-bold text-blue-600">
              {getUserName().charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500">{getGreeting()}</Text>
            <Text className="text-base font-semibold text-black">
              {getUserName()}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text className="text-2xl font-bold text-black mt-6 mb-5">
          How are your feeling today?
        </Text>

        {/* AI Chatbot Selection */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            className="flex-1 bg-white rounded-xl px-4 py-3.5 mr-3"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color={selectedColor?.color || "#4A7DFF"}
                />
                <Text
                  className={`ml-3 text-sm ${
                    selectedIssue ? "text-black" : "text-gray-400"
                  }`}
                >
                  {selectedIssue || "Select your concern..."}
                </Text>
              </View>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#999"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleChat}
            disabled={!selectedIssue}
            className="px-6 py-3.5 rounded-xl"
            style={{
              backgroundColor: selectedColor?.color || "#D1D5DB",
            }}
          >
            <Text className="text-white font-semibold">Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu */}
        {showDropdown && (
          <View className="bg-white rounded-xl mb-6 shadow-lg">
            <ScrollView className="max-h-64">
              {mentalHealthIssues.map((issue, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedIssue(issue.name);
                    setShowDropdown(false);
                  }}
                  className={`px-4 py-3.5 flex-row items-center ${
                    index !== mentalHealthIssues.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      selectedIssue === issue.name ? issue.bgColor : "white",
                  }}
                >
                  <View
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: issue.color }}
                  />
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color:
                        selectedIssue === issue.name ? issue.color : "#374151",
                    }}
                  >
                    {issue.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Upcoming Appointments */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-black">
            Upcoming Appointments
          </Text>
          <TouchableOpacity>
            <Text className="text-sm text-[#4A7DFF]">View All</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-[#4A7DFF] rounded-2xl p-5 mb-6">
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row items-center">
              <Image
                source={{ uri: "https://i.pravatar.cc/100?img=14" }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View>
                <Text className="text-base font-semibold text-white">
                  Dr. Al Khan
                </Text>
                <Text className="text-sm text-[#B8D0FF] mt-0.5">
                  Cardiology
                </Text>
              </View>
            </View>
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
              <Ionicons name="chatbubble-outline" size={20} color="#4A7DFF" />
            </View>
          </View>

          <View className="flex-row mb-5">
            <View className="flex-1 flex-row items-center bg-white/15 p-3 rounded-xl mr-3">
              <Ionicons name="calendar-outline" size={16} color="#4A7DFF" />
              <View className="ml-2.5">
                <Text className="text-[11px] text-[#B8D0FF]">Date</Text>
                <Text className="text-[13px] font-semibold text-white mt-0.5">
                  01 Nov, Monday
                </Text>
              </View>
            </View>
            <View className="flex-1 flex-row items-center bg-white/15 p-3 rounded-xl">
              <Ionicons name="time-outline" size={16} color="#4A7DFF" />
              <View className="ml-2.5">
                <Text className="text-[11px] text-[#B8D0FF]">Time</Text>
                <Text className="text-[13px] font-semibold text-white mt-0.5">
                  1pm - 8:30 pm
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-white rounded-xl py-3.5 items-center">
              <Text className="text-sm font-semibold text-[#4A7DFF]">
                Re-Schedule
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white/20 rounded-xl py-3.5 items-center">
              <Text className="text-sm font-semibold text-white">
                View Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Doctors */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-black">
            Popular Doctors
          </Text>
          <TouchableOpacity>
            <Text className="text-sm text-[#4A7DFF]">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="flex-row mb-5">
          <TouchableOpacity className="px-5 py-2.5 rounded-full bg-[#4A7DFF] mr-2.5">
            <Text className="text-sm text-white font-semibold">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-5 py-2.5 rounded-full bg-white mr-2.5">
            <Text className="text-sm text-gray-500">Cardiology</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-5 py-2.5 rounded-full bg-white mr-2.5">
            <Text className="text-sm text-gray-500">Dermatology</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-5 py-2.5 rounded-full bg-white">
            <Text className="text-sm text-gray-500">Den...</Text>
          </TouchableOpacity>
        </View>

        {/* Doctor Card */}
        <View className="flex-row bg-white rounded-2xl p-4 items-center">
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=14" }}
            className="w-15 h-15 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-base font-semibold text-black">
              Dr. Al Khan
            </Text>
            <Text className="text-[13px] text-gray-500 mt-0.5">Cardiology</Text>
            <View className="flex-row items-center mt-1.5">
              <Text className="text-[13px] font-semibold text-black mr-2.5">
                ⭐ 4.9
              </Text>
              <Text className="text-[13px] text-gray-500">190 Reviews</Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="bookmark-outline" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View className="h-5" />
      </ScrollView>
    </View>
  );
}
