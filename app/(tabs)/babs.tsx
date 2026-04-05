import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import { Colors } from "../../constants/colors";
import { Spacing, BorderRadius, Typography } from "../../constants/theme";

const TOTAL_BABS = 99;
const babsList = Array.from({ length: TOTAL_BABS }, (_, i) => ({
  id: i + 1,
  title: `Bab ${i + 1}`,
}));

export default function BabsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return babsList;
    const q = search.trim().toLowerCase();
    return babsList.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || String(b.id).includes(q)
    );
  }, [search]);

  const renderBab = ({ item }: { item: (typeof babsList)[0] }) => (
    <Pressable
      style={styles.babCard}
      onPress={() => router.push(`/bab/${item.id}`)}
    >
      <View style={styles.babNumber}>
        <Text style={styles.babNumberText}>{item.id}</Text>
      </View>
      <View style={styles.babInfo}>
        <Text style={styles.babTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bablar</Text>
        <Text style={styles.subtitle}>Cevşen-ül Kebir'in 99 bölümü</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={16}
          color={Colors.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Bab ara..."
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        renderItem={renderBab}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.md,
    color: Colors.text,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  babCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  babNumber: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  babNumberText: {
    fontSize: Typography.sizes.sm,
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
});
