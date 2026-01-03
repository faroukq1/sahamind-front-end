export const AVAILABLE_EMOTIONS = [
  "Happy",
  "Sad",
  "Angry",
  "Anxious",
  "Excited",
  "Calm",
  "Stressed",
  "Confident",
  "Tired",
  "Energetic",
];

// data/mockJournals.ts
export interface Journal {
  id: number;
  user_id: number;
  humor: string;
  title: string;
  content: string;
  is_pinned: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}

export const mockJournals: Journal[] = [
  {
    id: 1,
    user_id: 1,
    humor: "sad",
    title: "Morning Reflections",
    content:
      "Started the day with meditation. Feeling grateful for the peaceful morning.",
    is_pinned: true,
    color: "#fff9c4", // Yellow
    created_at: "2026-01-01T08:30:00",
    updated_at: "2026-01-01T08:30:00",
  },
  {
    id: 2,
    user_id: 1,
    humor: "sad",
    title: "Project Ideas",
    content:
      "Build a journaling app with React Native.\n• Pins and tags\n• Mood tracking\n• Search functionality",
    is_pinned: true,
    color: "#f8bbd0", // Pink
    created_at: "2025-12-30T14:20:00",
    updated_at: "2025-12-30T14:20:00",
  },
  {
    id: 3,
    user_id: 1,
    humor: "sad",
    title: "Grocery List",
    content: "☐ Milk\n☐ Eggs\n☐ Bread\n☐ Vegetables\n☐ Fruits",
    is_pinned: false,
    color: "#e1f5fe", // Light blue
    created_at: "2025-12-29T10:15:00",
    updated_at: "2025-12-29T10:15:00",
  },
  {
    id: 4,
    user_id: 1,
    humor: "sad",
    title: "Book Notes",
    content: "Atomic Habits by James Clear\n\nSmall changes = Big results",
    is_pinned: false,
    color: "#d1c4e9", // Purple
    created_at: "2025-12-28T19:45:00",
    updated_at: "2025-12-28T19:45:00",
  },
  {
    id: 5,
    user_id: 1,
    humor: "sad",
    title: "",
    content: "Call dentist next week 📞",
    is_pinned: false,
    color: "#c8e6c9", // Green
    created_at: "2025-12-27T07:00:00",
    updated_at: "2025-12-27T07:00:00",
  },
  {
    id: 6,
    user_id: 1,
    humor: "sad",
    title: "Travel 2026",
    content: "🌸 Japan\n✨ Iceland\n🕌 Morocco",
    is_pinned: false,
    color: "#ffe0b2", // Orange
    created_at: "2025-12-26T16:30:00",
    updated_at: "2025-12-26T16:30:00",
  },
];
