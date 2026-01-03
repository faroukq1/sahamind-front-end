import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter, useSegments } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeLayout() {
  const segments = useSegments();
  const router = useRouter();

  const tabs = [
    { name: "/(tabs)", icon: "home", label: "Home", segment: "index" },

    {
      name: "/(tabs)/forum",
      icon: "chatbubbles",
      label: "Forum",
      segment: "forum",
    },
    {
      name: "/(tabs)/journaling",
      icon: "book",
      label: "Journal",
      segment: "journaling",
    },
    {
      name: "/(tabs)/profile",
      icon: "person",
      label: "Profile",
      segment: "profile",
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => (
          <View className="bg-white">
            {/* Logo and Action Icons */}
            <View className="pt-12 pb-3 px-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-blue-600">
                  sahaMind
                </Text>

                <View className="flex-row items-center gap-3">
                  <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                    <Ionicons name="search" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Custom Tab Bar at Top */}
            <View className="flex-row bg-white border-b border-gray-200">
              {tabs.map((tab) => {
                const currentSegment = segments[1] || "index";
                const isActive =
                  currentSegment === tab.segment ||
                  (!segments[1] && tab.segment === "index");

                return (
                  <TouchableOpacity
                    key={tab.name}
                    onPress={() => router.push(tab.name as any)}
                    className="flex-1 items-center py-2 relative"
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={tab.icon as any}
                      size={22}
                      color={isActive ? "#3B82F6" : "#65676B"}
                    />
                    {isActive && (
                      <View
                        className="absolute bottom-0 left-0 right-0 bg-blue-500"
                        style={{ height: 2.5 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ),
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="forum" />
      <Tabs.Screen name="journaling" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen
        name="create-post"
        options={{
          headerShown: false,
          href: null,
        }}
      />
    </Tabs>
  );
}
