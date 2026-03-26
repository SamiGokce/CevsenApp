import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Colors } from "../../constants/colors";
import { Spacing, BorderRadius, Typography } from "../../constants/theme";
import { getStats, getLastReadBab } from "../../utils/storage";

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({
    streak: 0,
    completions: 0,
    babsRead: 0,
  });
  const [lastBab, setLastBab] = useState(1);

  useFocusEffect(
    useCallback(() => {
      getStats().then((s) =>
        setStats({
          streak: s.streak,
          completions: s.completions,
          babsRead: s.babsRead,
        })
      );
      getLastReadBab().then(setLastBab);
    }, [])
  );

  const progressPct = Math.round((stats.babsRead / 99) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>بِسْمِ اللّٰهِ</Text>
          <Text style={styles.subtitle}>Welcome to Cevşen</Text>
        </View>

        {/* Streak / Completions Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakItem}>
            <Ionicons name="flame" size={28} color={Colors.gold} />
            <Text style={styles.streakCount}>{stats.streak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.streakItem}>
            <Ionicons name="trophy" size={28} color={Colors.gold} />
            <Text style={styles.streakCount}>{stats.completions}</Text>
            <Text style={styles.streakLabel}>Completions</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.streakItem}>
            <Ionicons name="book" size={28} color={Colors.tealSage} />
            <Text style={styles.streakCount}>{stats.babsRead}/99</Text>
            <Text style={styles.streakLabel}>Babs Read</Text>
          </View>
        </View>

        {/* Progress Bar */}
        {stats.babsRead > 0 && (
          <View style={styles.progressBarCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Current cycle progress</Text>
              <Text style={styles.progressPct}>{progressPct}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPct}%` as any },
                ]}
              />
            </View>
          </View>
        )}

        {/* Continue Reading */}
        <Pressable
          style={styles.continueCard}
          onPress={() => router.push(`/bab/${lastBab}`)}
        >
          <View style={styles.continueLeft}>
            <Text style={styles.continueLabel}>Continue Reading</Text>
            <Text style={styles.continueTitle}>Bab {lastBab}</Text>
            <Text style={styles.continueSubtitle}>
              {lastBab === 1 ? "Begin your journey" : `Pick up where you left off`}
            </Text>
          </View>
          <Ionicons
            name="arrow-forward-circle"
            size={40}
            color={Colors.gold}
          />
        </Pressable>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/babs")}
          >
            <Ionicons name="book-outline" size={28} color={Colors.tealSage} />
            <Text style={styles.actionLabel}>All Babs</Text>
          </Pressable>
          <Pressable
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/favorites")}
          >
            <Ionicons name="heart-outline" size={28} color={Colors.tealSage} />
            <Text style={styles.actionLabel}>Favorites</Text>
          </Pressable>
          <Pressable
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/progress")}
          >
            <Ionicons
              name="stats-chart-outline"
              size={28}
              color={Colors.tealSage}
            />
            <Text style={styles.actionLabel}>Progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.sizes.xxl,
    fontFamily: "NotoNaskhArabic",
    color: Colors.text,
    marginBottom: Spacing.xs,
    writingDirection: "rtl",
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  streakCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  streakCount: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.text,
  },
  streakLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  progressBarCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  progressPct: {
    fontSize: Typography.sizes.xs,
    fontWeight: "700",
    color: Colors.tealSage,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.tealSage,
    borderRadius: BorderRadius.full,
  },
  continueCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  continueLeft: {
    flex: 1,
  },
  continueLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.gold,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  continueTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.text,
  },
  continueSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 90,
  },
  actionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: "600",
    color: Colors.text,
  },
});
