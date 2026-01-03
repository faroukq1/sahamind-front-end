// app/(tabs)/index.tsx
import FloatingActionButton from "@/components/FloatingActionButton";
import MasonryList from "@/components/MasonryList";
import { Journal, mockJournals } from "@/constants/data";
import React, { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AllNotesScreen() {
  const [notes, setNotes] = useState<Journal[]>(mockJournals);

  const handlePin = (id: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, is_pinned: !note.is_pinned } : note
      )
    );
  };

  const handleNotePress = (note: Journal) => {
    Alert.alert("Note Pressed", note.title || "Untitled");
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id)),
      },
    ]);
  };

  const handleCreateNote = () => {
    Alert.alert("Create Note", "Create note modal will open here");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <MasonryList
        notes={notes}
        onPin={handlePin}
        onNotePress={handleNotePress}
        onDelete={handleDelete}
      />
      <FloatingActionButton onPress={handleCreateNote} />
    </SafeAreaView>
  );
}
