import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Spacing, BorderRadius, Typography } from "../../constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bismillah</Text>
          <Text style={styles.subtitle}>Welcome to Cevşen</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakIconContainer}>
            <Ionicons name="flame" size={32} color={Colors.gold} />
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakCount}>0</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakInfo}>
            <Text style={styles.streakCount}>0</Text>
            <Text style={styles.streakLabel}>Completions</Text>
          </View>
        </View>

        {/* Continue Reading */}
        <Pressable
          style={styles.continueCard}
          onPress={() => router.push("/bab/1")}
        >
          <View style={styles.continueLeft}>
            <Text style={styles.continueLabel}>Continue Reading</Text>
            <Text style={styles.continueTitle}>Bab 1</Text>
            <Text style={styles.continueSubtitle}>Start your journey</Text>
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
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.xs,
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
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  streakInfo: {
    flex: 1,
    alignItems: "center",
  },
  streakCount: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    color: Colors.text,
  },
  streakLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
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
