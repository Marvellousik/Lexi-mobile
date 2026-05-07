/**
 * MobileDashboard.tsx
 * LexiAssist – Main dashboard screen.
 * Target runtime: React Native (iOS + Android)
 * Design: Pixel-faithful port of Figma export.
 * Dependencies: react-native, react-native-svg
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Platform,
} from "react-native";
import {
  TextToSpeechIllustration,
  ReadingAssistantIllustration,
  StudyBuddyIllustration,
  SpeechToTextIllustration,
  MemoryCardIcon,
  FileIcon,
  QuizIcon,
  ClockIcon,
  GearIcon,
  MoonIcon,
  FABCancelIcon,
  LexiAssistLogoMark,
} from "./DashboardIllustrations";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface ToolCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  accentColor: string;
  illustration: React.ReactNode;
}

interface RecentActivity {
  id: string;
  fileName: string;
  activityType: "quiz" | "flashcard";
  timestamp: string;
}

// ─────────────────────────────────────────────
// Static data — replace with store props later
// ─────────────────────────────────────────────

const TOOL_CARDS: ToolCard[] = [
  {
    id: "tts",
    title: "Text to speech",
    subtitle: "Learning Hub",
    description:
      "Turn text into sound. Sit back, listen & watch the words light up as you learn.",
    accentColor: "rgba(64,123,255,0.33)",
    illustration: <TextToSpeechIllustration />,
  },
  {
    id: "reading",
    title: "Reading Assistant",
    description: "Study with confidence as words are simplified into bits",
    accentColor: "rgba(137,207,240,0.33)",
    illustration: <ReadingAssistantIllustration />,
  },
  {
    id: "studybuddy",
    title: "StudyBuddy",
    description:
      "A smart assistant that helps you understand your notes better. Just upload!",
    accentColor: "rgba(126,87,194,0.33)",
    illustration: <StudyBuddyIllustration />,
  },
  {
    id: "writing",
    title: "Speech to Text",
    subtitle: "(Writing Assistant)",
    description: "Writing made easier! Just speak and we will do the writing",
    accentColor: "rgba(197,63,63,0.33)",
    illustration: <SpeechToTextIllustration />,
  },
];

const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "act1",
    fileName: "History of Hitler.pdf",
    activityType: "quiz",
    timestamp: "Yesterday by 6:00pm",
  },
  {
    id: "act2",
    fileName: "History of Hitler.pdf",
    activityType: "flashcard",
    timestamp: "Yesterday by 6:00pm",
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function TopBar() {
  return (
    <View style={styles.topBar}>
      <StatusBar barStyle="light-content" backgroundColor="#3C8350" />

      {/* Logo row */}
      <View style={styles.topBarInner}>
        <View style={styles.topBarLeft}>
          <LexiAssistLogoMark size={40} />
          {/* Wordmark text — matches the Figma letter-by-letter SVG logo */}
          <View style={styles.wordmarkContainer}>
            <Text style={styles.wordmarkText}>LexiAssist</Text>
          </View>
        </View>

        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <GearIcon size={20} color="#ECF3EE" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <MoonIcon size={16} color="#ECF3EE" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function GreetingSection() {
  return (
    <View style={styles.greetingContainer}>
      <Text style={styles.greetingTitle}>Hello, Victoria!</Text>
      <Text style={styles.greetingSubtitle}>Pick a tool to get started with</Text>
    </View>
  );
}

function ToolCardItem({ card }: { card: ToolCard }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.toolCard, { backgroundColor: card.accentColor }]}
    >
      {/* Illustration */}
      <View style={styles.toolCardIllustration}>{card.illustration}</View>

      {/* Text block */}
      <View style={styles.toolCardText}>
        {card.subtitle ? (
          <View style={styles.toolCardTitleBlock}>
            <Text style={styles.toolCardTitle}>{card.title}</Text>
            <Text style={styles.toolCardTitle}>{card.subtitle}</Text>
          </View>
        ) : (
          <Text style={styles.toolCardTitle}>{card.title}</Text>
        )}
        <Text style={styles.toolCardDescription}>{card.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ActivityCardItem({ activity }: { activity: RecentActivity }) {
  const isQuiz = activity.activityType === "quiz";

  return (
    <View style={styles.activityCard}>
      {/* File name row */}
      <View style={styles.activityRow}>
        <FileIcon size={24} />
        <Text style={styles.activityFileName}>{activity.fileName}</Text>
      </View>

      {/* Metadata row */}
      <View style={styles.activityMetaRow}>
        {/* Activity type */}
        <View style={styles.activityMeta}>
          {isQuiz ? <QuizIcon size={16} /> : <MemoryCardIcon size={20} />}
          <Text style={styles.activityMetaText}>
            {isQuiz ? "Quiz" : "Flashcards"}
          </Text>
        </View>

        {/* Timestamp */}
        <View style={styles.activityMeta}>
          <ClockIcon size={16} />
          <Text style={styles.activityMetaText}>{activity.timestamp}</Text>
        </View>
      </View>
    </View>
  );
}

function FloatingActionButton() {
  return (
    <TouchableOpacity
      style={styles.fab}
      activeOpacity={0.8}
      accessibilityLabel="Add new"
    >
      <FABCancelIcon size={60} />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Root screen
// ─────────────────────────────────────────────

export default function MobileDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* Sticky top bar */}
        <TopBar />

        {/* Scrollable body */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <GreetingSection />

          {/* Tool cards */}
          <View style={styles.section}>
            {TOOL_CARDS.map((card) => (
              <ToolCardItem key={card.id} card={card} />
            ))}
          </View>

          {/* Recent activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue from where you left off</Text>
            <View style={styles.activityList}>
              {RECENT_ACTIVITIES.map((activity) => (
                <ActivityCardItem key={activity.id} activity={activity} />
              ))}
            </View>
          </View>

          {/* Bottom spacing so FAB doesn't overlap last card */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* FAB */}
        <FloatingActionButton />

        {/* Bottom home indicator bar */}
        <View style={styles.homeIndicatorContainer}>
          <View style={styles.homeIndicatorBar} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// Dimensions are direct ports from Figma values.
// No arbitrary magic numbers — each value maps to
// a named token from the original design.
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3C8350", // matches top bar bg so safe area fills green
  },

  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // ── Top bar ──────────────────────────────────
  topBar: {
    backgroundColor: "#3C8350",
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },

  topBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 62,
  },

  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  wordmarkContainer: {
    justifyContent: "center",
  },

  wordmarkText: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 18,
    color: "#ECF3EE",
    letterSpacing: -0.4,
  },

  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    padding: 10,
  },

  // ── Greeting ─────────────────────────────────
  greetingContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 4,
  },

  greetingTitle: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 28,
    color: "#272A28",
    letterSpacing: -0.56,
    lineHeight: 33.6, // 1.2 × 28
  },

  greetingSubtitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    color: "#555C56",
    lineHeight: 26.1, // 1.45 × 18
  },

  // ── Sections ─────────────────────────────────
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 24,
  },

  sectionTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 20,
    color: "rgba(0,0,0,0.6)",
    letterSpacing: -0.4,
    lineHeight: 24,
  },

  // ── Tool cards ───────────────────────────────
  toolCard: {
    borderRadius: 8,
    height: 179,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 24,
    overflow: "hidden",
  },

  toolCardIllustration: {
    flexShrink: 0,
  },

  toolCardText: {
    flex: 1,
    gap: 16,
  },

  toolCardTitleBlock: {
    gap: 0,
  },

  toolCardTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 20,
    color: "#272A28",
    letterSpacing: -0.4,
    lineHeight: 24,
  },

  toolCardDescription: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: "#555C56",
    lineHeight: 20.3, // 1.45 × 14
  },

  // ── Recent activity ──────────────────────────
  activityList: {
    gap: 17,
  },

  activityCard: {
    backgroundColor: "#EFF0EF",
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  activityFileName: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
  },

  activityMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 4,
  },

  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  activityMetaText: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
  },

  // ── FAB ──────────────────────────────────────
  fab: {
    position: "absolute",
    bottom: 56,
    right: 16,
    borderRadius: 12,
    // Elevation matches Figma shadow: 0px 9px 13.1px rgba(0,0,0,0.04)
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 0.04,
        shadowRadius: 13.1,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // ── Home indicator ───────────────────────────
  homeIndicatorContainer: {
    alignItems: "center",
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },

  homeIndicatorBar: {
    width: 189,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#272A28",
  },
});
