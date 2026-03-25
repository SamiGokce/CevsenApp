import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Spacing, BorderRadius, Typography } from "../../constants/theme";

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Your reading journey</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color={Colors.gold} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={28} color={Colors.gold} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={28} color={Colors.tealSage} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Completions</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="book" size={28} color={Colors.tealSage} />
            <Text style={styles.statValue}>0/99</Text>
            <Text style={styles.statLabel}>Babs Read</Text>
          </View>
        </View>

        {/* Heatmap placeholder */}
        <Text style={styles.sectionTitle}>Reading Activity</Text>
        <View style={styles.heatmapPlaceholder}>
          <Ionicons
            name="calendar-outline"
            size={48}
            color={Colors.lightGold}
          />
          <Text style={styles.heatmapText}>
            Your reading heatmap will appear here
          </Text>
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
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
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
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  heatmapPlaceholder: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 160,
    gap: Spacing.md,
  },
  heatmapText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});
