// components/journal/NoteCard.tsx (Alternative with better blending)
import { Journal } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

interface NoteCardProps {
  note: Journal;
  onPin: (id: number) => void;
  onPress: (note: Journal) => void;
  onDelete: (id: number) => void;
}

export default function NoteCard({
  note,
  onPin,
  onPress,
  onDelete,
}: NoteCardProps) {
  return (
    <TouchableOpacity
      className="rounded-lg mb-3 overflow-hidden relative"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      }}
      onPress={() => onPress(note)}
      activeOpacity={0.8}
    >
      {/* Colored Background Base */}
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: note.color || "#ffffff",
        }}
      />

      {/* Paper Texture Overlay with Multiply Effect */}
      <ImageBackground
        source={require("@/assets/images/paper-texture.jpg")}
        className="w-full"
        resizeMode="cover"
        imageStyle={{
          borderRadius: 8,
          opacity: 0.7,
        }}
      >
        {/* Content Container */}
        <View className="p-4 relative">
          {/* Pin Button */}
          <TouchableOpacity
            className="absolute top-2 right-2 p-2 z-10"
            onPress={(e) => {
              e.stopPropagation();
              onPin(note.id);
            }}
          >
            <Ionicons
              name={note.is_pinned ? "pin" : "pin-outline"}
              size={20}
              color={note.is_pinned ? "#d32f2f" : "rgba(0,0,0,0.5)"}
            />
          </TouchableOpacity>

          {/* Title */}
          {note.title && (
            <Text
              className="text-base font-semibold mb-2 pr-8"
              style={{
                color: "rgba(0,0,0,0.87)",
                letterSpacing: 0.2,
              }}
              numberOfLines={3}
            >
              {note.title}
            </Text>
          )}

          {/* Content */}
          <Text
            className="text-sm leading-6"
            style={{
              color: "rgba(0,0,0,0.75)",
              letterSpacing: 0.1,
            }}
            numberOfLines={10}
          >
            {note.content}
          </Text>

          {/* Bottom Actions */}
          <View className="flex-row justify-end items-center mt-4 pt-3">
            <TouchableOpacity
              className="p-1.5 rounded-full"
              onPress={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="rgba(0,0,0,0.5)"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Subtle edge shadow for depth */}
      <View
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.08)",
        }}
      />
    </TouchableOpacity>
  );
}
