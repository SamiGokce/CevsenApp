import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Colors } from "../../constants/colors";
import { Spacing, BorderRadius, Typography } from "../../constants/theme";
import { getStats, getReadingLog } from "../../utils/storage";

function buildHeatmapDays(): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  const today = new Date();
  // Go back 12 weeks (84 days) + fill to start of week
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 83);
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const cur = new Date(startDate);
  while (cur <= today) {
    const iso = cur.toISOString().slice(0, 10);
    const label = cur.toLocaleDateString("tr-TR", {
      month: "short",
      day: "numeric",
    });
    days.push({ date: iso, label });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function heatColor(count: number): string {
  if (count === 0) return Colors.border;
  if (count <= 2) return "#b8d6d0"; // mint light
  if (count <= 5) return "#5f7e78"; // tealSage
  return "#3a5a54"; // dark teal
}

export default function ProgressScreen() {
  const [stats, setStats] = useState({
    streak: 0,
    longestStreak: 0,
    completions: 0,
    babsRead: 0,
  });
  const [log, setLog] = useState<Record<string, number[]>>({});

  useFocusEffect(
    useCallback(() => {
      getStats().then(setStats);
      getReadingLog().then(setLog);
    }, [])
  );

  const heatmapDays = buildHeatmapDays();

  // Group into weeks (columns)
  const weeks: { date: string; label: string }[][] = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push(heatmapDays.slice(i, i + 7));
  }

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = "";
  weeks.forEach((week, colIdx) => {
    const firstDay = week[0];
    if (firstDay) {
      const month = new Date(firstDay.date + "T12:00:00").toLocaleDateString(
        "tr-TR",
        { month: "short" }
      );
      if (month !== lastMonth) {
        monthLabels.push({ label: month, col: colIdx });
        lastMonth = month;
      }
    }
  });

  const progressPct = Math.round((stats.babsRead / 99) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>İlerleme</Text>
          <Text style={styles.subtitle}>Okuma yolculuğun</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color={Colors.gold} />
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Gün Serisi</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={28} color={Colors.gold} />
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>En Uzun</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle"
              size={28}
              color={Colors.tealSage}
            />
            <Text style={styles.statValue}>{stats.completions}</Text>
            <Text style={styles.statLabel}>Tamamlamalar</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <Text style={styles.sectionTitle}>Mevcut İlerleme</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              99 babdan {stats.babsRead}'i okundu
            </Text>
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

        {/* Heatmap */}
        <Text style={styles.sectionTitle}>Okuma Aktivitesi</Text>
        <View style={styles.heatmapCard}>
          {/* Month row */}
          <View style={styles.monthRow}>
            {monthLabels.map((m) => (
              <Text
                key={m.label + m.col}
                style={[
                  styles.monthLabel,
                  { marginLeft: m.col === 0 ? 0 : m.col * 13 - (monthLabels.indexOf(m) > 0 ? monthLabels[monthLabels.indexOf(m) - 1].col * 13 + 24 : 0) },
                ]}
              >
                {m.label}
              </Text>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.heatmapGrid}>
              {weeks.map((week, wi) => (
                <View key={wi} style={styles.heatmapCol}>
                  {week.map((day) => {
                    const count = (log[day.date] || []).length;
                    return (
                      <View
                        key={day.date}
                        style={[
                          styles.heatCell,
                          { backgroundColor: heatColor(count) },
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>Az</Text>
            {[0, 1, 3, 6, 9].map((n) => (
              <View
                key={n}
                style={[
                  styles.heatCell,
                  { backgroundColor: heatColor(n) },
                ]}
              />
            ))}
            <Text style={styles.legendText}>Çok</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CELL = 11;
const GAP = 2;

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
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  progressCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  progressPct: {
    fontSize: Typography.sizes.sm,
    fontWeight: "700",
    color: Colors.tealSage,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.tealSage,
    borderRadius: BorderRadius.full,
  },
  heatmapCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  monthRow: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
    paddingLeft: 2,
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  monthLabel: {
    fontSize: 9,
    color: Colors.textLight,
    marginRight: Spacing.xs,
  },
  heatmapGrid: {
    flexDirection: "row",
    gap: GAP,
  },
  heatmapCol: {
    flexDirection: "column",
    gap: GAP,
  },
  heatCell: {
    width: CELL,
    height: CELL,
    borderRadius: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: GAP,
    marginTop: Spacing.sm,
    justifyContent: "flex-end",
  },
  legendText: {
    fontSize: 9,
    color: Colors.textLight,
  },
});
