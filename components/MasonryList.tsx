// components/journal/MasonryList.tsx
import { Journal } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import NoteCard from "./NoteCard";

interface MasonryListProps {
  notes: Journal[];
  showPinnedOnly?: boolean;
  onPin: (id: number) => void;
  onNotePress: (note: Journal) => void;
  onDelete: (id: number) => void;
}

export default function MasonryList({
  notes,
  showPinnedOnly = false,
  onPin,
  onNotePress,
  onDelete,
}: MasonryListProps) {
  const [leftColumn, setLeftColumn] = useState<Journal[]>([]);
  const [rightColumn, setRightColumn] = useState<Journal[]>([]);

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((note) => note.is_pinned);
  const unpinnedNotes = notes.filter((note) => !note.is_pinned);

  const displayNotes = showPinnedOnly
    ? pinnedNotes
    : [...pinnedNotes, ...unpinnedNotes];

  // Distribute notes into two columns (alternating for balance)
  useEffect(() => {
    const left: Journal[] = [];
    const right: Journal[] = [];

    displayNotes.forEach((note, index) => {
      if (index % 2 === 0) {
        left.push(note);
      } else {
        right.push(note);
      }
    });

    setLeftColumn(left);
    setRightColumn(right);
  }, [notes, showPinnedOnly]);

  if (displayNotes.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name="journal-outline" size={64} color="#e0e0e0" />
        <Text className="text-lg text-gray-600 font-medium mt-4 text-center">
          {showPinnedOnly ? "No pinned notes yet" : "No notes yet"}
        </Text>
        <Text className="text-sm text-gray-400 mt-2 text-center">
          {showPinnedOnly
            ? "Pin important notes to see them here"
            : "Tap + to create your first note"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 px-3 pt-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Pinned Section Header */}
      {!showPinnedOnly && pinnedNotes.length > 0 && (
        <Text className="text-xs font-semibold text-gray-600 mb-3 px-1 tracking-wider">
          PINNED
        </Text>
      )}

      {/* Two Column Masonry Grid */}
      <View className="flex-row pb-24">
        {/* Left Column */}
        <View className="flex-1 px-1">
          {leftColumn.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPin={onPin}
              onPress={onNotePress}
              onDelete={onDelete}
            />
          ))}
        </View>

        {/* Right Column */}
        <View className="flex-1 px-1">
          {rightColumn.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPin={onPin}
              onPress={onNotePress}
              onDelete={onDelete}
            />
          ))}
        </View>
      </View>

      {/* Others Section (appears between columns) */}
      {!showPinnedOnly &&
        pinnedNotes.length > 0 &&
        unpinnedNotes.length > 0 && (
          <Text className="text-xs font-semibold text-gray-600 mb-3 mt-2 px-1 tracking-wider">
            OTHERS
          </Text>
        )}
    </ScrollView>
  );
}
