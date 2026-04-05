import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Colors } from "../../constants/colors";
import { Spacing, BorderRadius, Typography } from "../../constants/theme";
import { getFavorites, toggleFavorite } from "../../utils/storage";
import babsData from "../../data/babs.json";

export default function FavoritesScreen() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavoriteIds);
    }, [])
  );

  const favoriteBabs = babsData.babs.filter((b) =>
    favoriteIds.includes(b.id)
  );

  async function handleRemove(babId: number) {
    const next = await toggleFavorite(babId);
    setFavoriteIds(next);
  }

  if (favoriteIds.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favoriler</Text>
          <Text style={styles.subtitle}>Kaydettiğin bablar</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={Colors.lightGold} />
          <Text style={styles.emptyTitle}>Henüz favori yok</Text>
          <Text style={styles.emptySubtitle}>
            Bab okurken kalp ikonuna dokun, buraya kaydedilir
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoriler</Text>
        <Text style={styles.subtitle}>
          {favoriteIds.length} kayıtlı bab
        </Text>
      </View>
      <FlatList
        data={favoriteBabs}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.babCard}
            onPress={() => router.push(`/bab/${item.id}`)}
          >
            <View style={styles.babNumberBadge}>
              <Text style={styles.babNumberText}>{item.id}</Text>
            </View>
            <View style={styles.babInfo}>
              <Text style={styles.babTitle}>Bab {item.id}</Text>
              <Text style={styles.babPreview} numberOfLines={1}>
                {item.lines[0].translation.tr}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <Pressable
                style={styles.removeBtn}
                onPress={() => handleRemove(item.id)}
                hitSlop={8}
              >
                <Ionicons name="heart" size={20} color={Colors.error} />
              </Pressable>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.textLight}
              />
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 4,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  babCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  babNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  babNumberText: {
    fontSize: Typography.sizes.xs,
    fontWeight: "700",
    color: Colors.gold,
  },
  babInfo: {
    flex: 1,
  },
  babTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    color: Colors.text,
  },
  babPreview: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  removeBtn: {
    padding: Spacing.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
});
