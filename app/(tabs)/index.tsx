import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import {
  useVolunteersByEmotionPaginated,
  useAllVolunteersPaginated,
} from "@/hooks/useVolunteer";

export default function Index() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [selectedIssue, setSelectedIssue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch volunteers based on user's emotions with pagination
  const {
    data,
    isLoading: volunteersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVolunteersByEmotionPaginated(
    user?.id ? Number(user.id) : undefined,
    5
  );

  // Flatten all pages of volunteers
  const volunteers = data?.pages.flatMap((page) => page.volunteers) || [];

  // Fetch all volunteers with pagination (10 per page)
  const {
    data: allVolunteersData,
    isLoading: allVolunteersLoading,
    fetchNextPage: fetchNextAllVolunteers,
    hasNextPage: hasNextAllVolunteers,
    isFetchingNextPage: isFetchingNextAllVolunteers,
  } = useAllVolunteersPaginated(10);

  // Flatten all pages of all volunteers
  const allVolunteers =
    allVolunteersData?.pages.flatMap((page) => page.volunteers) || [];

  // Debug logs
  console.log("All Volunteers Data:", {
    loading: allVolunteersLoading,
    dataExists: !!allVolunteersData,
    pagesCount: allVolunteersData?.pages?.length,
    volunteersCount: allVolunteers.length,
    firstPage: allVolunteersData?.pages[0],
  });

  // Handle phone call
  const handleCall = (phoneNumber: string) => {
    // Extract email username as phone for demo
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

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
      <View className="flex-row justify-between items-center px-5 pt-4 pb-5 bg-[#F5F7FA]">
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

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-10 h-10 rounded-full bg-red-50 items-center justify-center"
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-white rounded-3xl mt-5 mb-6 shadow-lg overflow-hidden">
          {/* Top Section with Image and Gradient */}
          <View
            className="pt-8 pb-6 px-6 items-center"
            style={{ backgroundColor: "#60A5FA" }}
          >
            <Image
              source={require("@/assets/images/3943185.png")}
              className="w-48 h-48 mb-4"
              resizeMode="contain"
            />
            <View className="w-2 h-2 rounded-full bg-white mb-2" />
          </View>

          {/* Bottom Section with Text */}
          <View className="px-6 py-6">
            <View className="flex-row items-center mb-3">
              <View className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-600 text-xs font-semibold">
                Safe & Confidential Space
              </Text>
            </View>

            <Text className="text-gray-900 text-3xl font-bold leading-9 mb-3">
              You're Not Alone
            </Text>

            <Text className="text-gray-600 text-base leading-6 mb-5">
              Take a moment to breathe. We're here to listen, support, and help
              you through whatever you're facing.
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-blue-50 rounded-xl p-4 items-center">
                <Ionicons name="people" size={24} color="#3B82F6" />
                <Text className="text-gray-700 font-semibold text-xs mt-2">
                  Caring Community
                </Text>
              </View>
              <View className="flex-1 bg-purple-50 rounded-xl p-4 items-center">
                <Ionicons name="shield-checkmark" size={24} color="#8B5CF6" />
                <Text className="text-gray-700 font-semibold text-xs mt-2 text-center">
                  100% Private
                </Text>
              </View>
              <View className="flex-1 bg-pink-50 rounded-xl p-4 items-center">
                <Ionicons name="heart" size={24} color="#EC4899" />
                <Text className="text-gray-700 font-semibold text-xs mt-2">
                  Always Here
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-black mt-2 mb-3">
          How are you feeling today?
        </Text>

        {/* Emotion Selection Grid */}
        <View className="mb-6">
          <View className="flex-row flex-wrap gap-2">
            {mentalHealthIssues.map((issue, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedIssue(issue.name)}
                className="px-4 py-2.5 rounded-full"
                style={{
                  backgroundColor:
                    selectedIssue === issue.name ? issue.color : issue.bgColor,
                }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    color: selectedIssue === issue.name ? "#fff" : issue.color,
                  }}
                >
                  {issue.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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

        {/* Available Volunteers - Close to You */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xl font-bold text-gray-900">
              Volunteers Near You
            </Text>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-green-600">
                {volunteers.length} Available
              </Text>
            </View>
          </View>
          <Text className="text-sm text-gray-500 mb-4">
            Matched based on your emotional needs
          </Text>
        </View>

        {volunteersLoading ? (
          <View className="bg-white rounded-3xl p-10 mb-6 items-center justify-center shadow-md">
            <ActivityIndicator size="large" color="#4A7DFF" />
            <Text className="text-gray-500 mt-3 font-medium">
              Finding volunteers...
            </Text>
          </View>
        ) : volunteers && volunteers.length > 0 ? (
          <View className="mb-6">
            {volunteers.map((volunteer, index) => {
              const volunteerName = volunteer.email.split("@")[0];

              return (
                <View
                  key={volunteer.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${
                    index !== volunteers.length - 1 ? "mb-3" : ""
                  }`}
                >
                  <View className="flex-row items-center mb-3">
                    <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <Ionicons name="person" size={24} color="#4A7DFF" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 capitalize">
                        {volunteerName}
                      </Text>
                      <View className="flex-row flex-wrap mt-1">
                        {volunteer.emotions_kw
                          .slice(0, 2)
                          .map((emotion, idx) => (
                            <View
                              key={idx}
                              className="bg-blue-50 px-2 py-0.5 rounded-full mr-1 mb-1"
                            >
                              <Text className="text-[9px] text-blue-600 font-medium">
                                {emotion}
                              </Text>
                            </View>
                          ))}
                        {volunteer.emotions_kw.length > 2 && (
                          <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                            <Text className="text-[9px] text-gray-600 font-medium">
                              +{volunteer.emotions_kw.length - 2}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleCall(volunteer.id.toString())}
                    className="bg-[#4A7DFF] rounded-lg py-2.5 items-center flex-row justify-center"
                  >
                    <Ionicons name="call" size={16} color="#fff" />
                    <Text className="text-sm font-semibold text-white ml-2">
                      Call Now
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Load More Button */}
            {hasNextPage && (
              <TouchableOpacity
                onPress={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-blue-50 rounded-xl py-3 items-center flex-row justify-center mt-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <ActivityIndicator size="small" color="#4A7DFF" />
                    <Text className="text-sm font-semibold text-[#4A7DFF] ml-2">
                      Loading...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="chevron-down" size={18} color="#4A7DFF" />
                    <Text className="text-sm font-semibold text-[#4A7DFF] ml-2">
                      Load More
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="bg-white rounded-2xl p-6 mb-6 items-center">
            <Ionicons name="people-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 mt-3 text-center">
              No volunteers available at the moment.
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              Please check back later.
            </Text>
          </View>
        )}

        {/* All Volunteers Section */}
        <View className="mb-4 mt-8">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xl font-bold text-gray-900">
              All Volunteers
            </Text>
            {allVolunteersData?.pages[0]?.total && (
              <View className="bg-purple-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-bold text-purple-600">
                  {allVolunteersData.pages[0].total} Total
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-500 mb-4">
            Browse all available volunteers
          </Text>
        </View>

        {allVolunteersLoading ? (
          <View className="bg-white rounded-3xl p-10 mb-6 items-center justify-center shadow-md">
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text className="text-gray-500 mt-3 font-medium">
              Loading volunteers...
            </Text>
          </View>
        ) : allVolunteers && allVolunteers.length > 0 ? (
          <View className="mb-6">
            {allVolunteers.map((volunteer, index) => {
              const volunteerName = volunteer.email.split("@")[0];

              return (
                <View
                  key={volunteer.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${
                    index !== allVolunteers.length - 1 ? "mb-3" : ""
                  }`}
                >
                  <View className="flex-row items-center mb-3">
                    <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mr-3">
                      <Ionicons name="person" size={24} color="#8B5CF6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 capitalize">
                        {volunteerName}
                      </Text>
                      <View className="flex-row flex-wrap mt-1">
                        {volunteer.emotions_kw
                          .slice(0, 2)
                          .map((emotion, idx) => (
                            <View
                              key={idx}
                              className="bg-purple-50 px-2 py-0.5 rounded-full mr-1 mb-1"
                            >
                              <Text className="text-[9px] text-purple-600 font-medium">
                                {emotion}
                              </Text>
                            </View>
                          ))}
                        {volunteer.emotions_kw.length > 2 && (
                          <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                            <Text className="text-[9px] text-gray-600 font-medium">
                              +{volunteer.emotions_kw.length - 2}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleCall(volunteer.id.toString())}
                    className="bg-[#8B5CF6] rounded-lg py-2.5 items-center flex-row justify-center"
                  >
                    <Ionicons name="call" size={16} color="#fff" />
                    <Text className="text-sm font-semibold text-white ml-2">
                      Call Now
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Load More Button */}
            {hasNextAllVolunteers && (
              <TouchableOpacity
                onPress={() => fetchNextAllVolunteers()}
                disabled={isFetchingNextAllVolunteers}
                className="bg-purple-50 rounded-xl py-3 items-center flex-row justify-center mt-2"
              >
                {isFetchingNextAllVolunteers ? (
                  <>
                    <ActivityIndicator size="small" color="#8B5CF6" />
                    <Text className="text-sm font-semibold text-[#8B5CF6] ml-2">
                      Loading...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="chevron-down" size={18} color="#8B5CF6" />
                    <Text className="text-sm font-semibold text-[#8B5CF6] ml-2">
                      Load More
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="bg-white rounded-2xl p-6 mb-6 items-center">
            <Ionicons name="people-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 mt-3 text-center">
              No volunteers available at the moment.
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              Please check back later.
            </Text>
          </View>
        )}

        <View className="h-5" />
      </ScrollView>
    </View>
  );
}
