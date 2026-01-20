/**
 * Explore Screen - Restaurant search and browse
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../src/hooks/useTheme';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { Chip } from '../../src/components/ui';
import { Restaurant } from '../../src/types';
import { Image } from 'react-native';

// Filters
const filters = [
  { id: '1', name: 'Sort', icon: 'swap-vertical' },
  { id: '2', name: 'Rating 4.0+', icon: 'star' },
  { id: '3', name: 'Free Delivery', icon: 'bicycle' },
  { id: '4', name: 'Under 30 min', icon: 'time' },
  { id: '5', name: 'Pure Veg', icon: 'leaf' },
];

// Mock data
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Paradise',
    description: 'Authentic Italian pizzas',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    rating: 4.8,
    reviewCount: 342,
    cuisine: ['Italian', 'Pizza'],
    deliveryTime: '25-35 min',
    deliveryFee: 0,
    minimumOrder: 150,
    isOpen: true,
    distance: '1.2 km',
    tags: ['Free Delivery'],
  },
  {
    id: '2',
    name: 'Burger Junction',
    description: 'Premium burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    rating: 4.6,
    reviewCount: 256,
    cuisine: ['American', 'Burgers'],
    deliveryTime: '20-30 min',
    deliveryFee: 25,
    minimumOrder: 100,
    isOpen: true,
    distance: '0.8 km',
    tags: ['Bestseller'],
  },
  {
    id: '3',
    name: 'Spice Garden',
    description: 'Traditional Indian cuisine',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    rating: 4.7,
    reviewCount: 189,
    cuisine: ['Indian', 'North Indian'],
    deliveryTime: '30-40 min',
    deliveryFee: 15,
    minimumOrder: 200,
    isOpen: true,
    distance: '1.5 km',
    tags: ['Campus Favorite'],
  },
  {
    id: '4',
    name: 'Wok Express',
    description: 'Quick Chinese',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    rating: 4.5,
    reviewCount: 167,
    cuisine: ['Chinese', 'Asian'],
    deliveryTime: '15-25 min',
    deliveryFee: 20,
    minimumOrder: 120,
    isOpen: true,
    distance: '0.5 km',
    tags: ['Quick Bites'],
  },
];

export default function ExploreScreen() {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
    },
    title: {
      ...typography.headlineLarge,
      color: theme.text.primary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.secondary,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border.light,
    },
    searchInput: {
      flex: 1,
      ...typography.bodyMedium,
      color: theme.text.primary,
      paddingVertical: spacing.md,
      marginLeft: spacing.sm,
    },
    filtersScroll: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      marginRight: spacing.sm,
      borderWidth: 1,
    },
    filterChipActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    filterChipInactive: {
      backgroundColor: 'transparent',
      borderColor: theme.border.default,
    },
    filterText: {
      ...typography.labelMedium,
      marginLeft: spacing.xs,
    },
    filterTextActive: {
      color: colors.neutral[0],
    },
    filterTextInactive: {
      color: theme.text.primary,
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    resultsCount: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
    },
    listContainer: {
      paddingHorizontal: spacing.lg,
    },
    restaurantCard: {
      flexDirection: 'row',
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      overflow: 'hidden',
      ...shadows.sm,
    },
    restaurantImage: {
      width: 100,
      height: 100,
      backgroundColor: theme.background.tertiary,
    },
    restaurantInfo: {
      flex: 1,
      padding: spacing.md,
      justifyContent: 'center',
    },
    restaurantName: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    restaurantMeta: {
      ...typography.bodySmall,
      color: theme.text.secondary,
      marginTop: spacing.xs,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success.light,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.xs,
    },
    ratingText: {
      ...typography.labelSmall,
      color: colors.success.dark,
      marginLeft: 2,
    },
    deliveryInfo: {
      ...typography.labelSmall,
      color: theme.text.tertiary,
      marginLeft: spacing.sm,
    },
  });

  const renderRestaurantItem = ({ item, index }: { item: Restaurant; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity
        style={styles.restaurantCard}
        activeOpacity={0.9}
        onPress={() => router.push(`/restaurant/${item.id}`)}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.restaurantMeta} numberOfLines={1}>
            {item.cuisine.join(' • ')}
          </Text>
          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              <Ionicons name="star" size={10} color={colors.success.dark} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles.deliveryInfo}>
              {item.deliveryTime} • {item.distance}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines..."
          placeholderTextColor={theme.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScroll}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilters.includes(filter.id)
                ? styles.filterChipActive
                : styles.filterChipInactive,
            ]}
            onPress={() => toggleFilter(filter.id)}
          >
            <Ionicons
              name={filter.icon as any}
              size={14}
              color={
                activeFilters.includes(filter.id)
                  ? colors.neutral[0]
                  : theme.text.secondary
              }
            />
            <Text
              style={[
                styles.filterText,
                activeFilters.includes(filter.id)
                  ? styles.filterTextActive
                  : styles.filterTextInactive,
              ]}
            >
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {restaurants.length} restaurants near you
        </Text>
      </View>

      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
