// components/journal/FloatingActionButton.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface FABProps {
  onPress: () => void;
}

export default function FloatingActionButton({ onPress }: FABProps) {
  return (
    <TouchableOpacity
      className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-white justify-center items-center"
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        // Enhanced paper-like shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
      }}
    >
      <Ionicons name="add" size={32} color="#5f6368" />
    </TouchableOpacity>
  );
}
