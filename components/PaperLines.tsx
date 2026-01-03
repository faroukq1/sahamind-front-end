// components/journal/PaperLines.tsx
import React from "react";
import { View } from "react-native";

export default function PaperLines() {
  return (
    <View className="absolute inset-0 pointer-events-none">
      {/* Subtle horizontal lines like ruled paper */}
      {[...Array(15)].map((_, i) => (
        <View
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: 30 + i * 20,
            height: 1,
            backgroundColor: "rgba(0,0,0,0.03)",
          }}
        />
      ))}
    </View>
  );
}
