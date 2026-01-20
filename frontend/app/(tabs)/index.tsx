/**
 * Home Screen - Premium food delivery home
 * Features: Hero banner, categories, favorites, late-night section
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { Card, Chip, Skeleton, SkeletonCard } from '../../src/components/ui';
import { useCartStore } from '../../src/store/cartStore';
import { Restaurant } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Categories for the app
const categories = [
  { id: '1', name: 'Delivery', icon: 'bicycle', active: true },
  { id: '2', name: 'Dine-In', icon: 'restaurant' },
  { id: '3', name: 'Takeaway', icon: 'bag-handle' },
  { id: '4', name: 'Late Night', icon: 'moon' },
];

// Cuisine types
const cuisines = [
  { id: '1', name: 'All', icon: 'apps' },
  { id: '2', name: 'Pizza', icon: 'pizza' },
  { id: '3', name: 'Burger', icon: 'fast-food' },
  { id: '4', name: 'Indian', icon: 'flame' },
  { id: '5', name: 'Chinese', icon: 'nutrition' },
  { id: '6', name: 'Healthy', icon: 'leaf' },
  { id: '7', name: 'Desserts', icon: 'ice-cream' },
];

// Mock restaurant data
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Paradise',
    description: 'Authentic Italian pizzas with fresh ingredients',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    rating: 4.8,
    reviewCount: 342,
    cuisine: ['Italian', 'Pizza'],
    deliveryTime: '25-35 min',
    deliveryFee: 0,
    minimumOrder: 150,
    isOpen: true,
    distance: '1.2 km',
    tags: ['Free Delivery', 'Popular'],
    promo: '20% OFF',
  },
  {
    id: '2',
    name: 'Burger Junction',
    description: 'Juicy burgers made with premium beef',
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
    description: 'Traditional Indian cuisine with authentic spices',
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
    promo: 'Buy 1 Get 1',
  },
  {
    id: '4',
    name: 'Wok Express',
    description: 'Quick and delicious Chinese takeaway',
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
  {
    id: '5',
    name: 'Green Bowl',
    description: 'Healthy salads and smoothie bowls',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    rating: 4.9,
    reviewCount: 98,
    cuisine: ['Healthy', 'Salads'],
    deliveryTime: '15-20 min',
    deliveryFee: 30,
    minimumOrder: 180,
    isOpen: true,
    distance: '1.0 km',
    tags: ['Healthy Choice'],
  },
];

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [selectedCuisine, setSelectedCuisine] = useState('1');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const cartItems = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.lg,
    },
    greeting: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
    },
    title: {
      ...typography.headlineLarge,
      color: theme.text.primary,
      marginTop: spacing.xs,
    },
    universityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.accent + '15',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
    },
    universityText: {
      ...typography.labelSmall,
      color: colors.primary[600],
      marginLeft: spacing.xs,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.secondary,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border.light,
    },
    searchText: {
      ...typography.bodyMedium,
      color: theme.text.tertiary,
      marginLeft: spacing.sm,
      flex: 1,
    },
    categoriesContainer: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    categoriesRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      gap: spacing.sm,
    },
    categoryChipActive: {
      backgroundColor: colors.primary[500],
    },
    categoryChipInactive: {
      backgroundColor: theme.background.secondary,
      borderWidth: 1,
      borderColor: theme.border.light,
    },
    categoryIcon: {
      marginRight: spacing.xs,
    },
    categoryText: {
      ...typography.labelMedium,
    },
    categoryTextActive: {
      color: colors.neutral[0],
    },
    categoryTextInactive: {
      color: theme.text.primary,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seeAllText: {
      ...typography.labelMedium,
      color: colors.primary[500],
    },
    heroBanner: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing['2xl'],
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      height: 160,
    },
    heroBannerContent: {
      flex: 1,
      padding: spacing.xl,
      justifyContent: 'center',
    },
    heroTitle: {
      ...typography.headlineMedium,
      color: colors.neutral[0],
      maxWidth: '70%',
    },
    heroSubtitle: {
      ...typography.bodyMedium,
      color: colors.neutral[200],
      marginTop: spacing.xs,
    },
    heroButton: {
      backgroundColor: colors.neutral[0],
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      marginTop: spacing.md,
    },
    heroButtonText: {
      ...typography.labelMedium,
      color: colors.primary[600],
    },
    cuisinesScroll: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    cuisineItem: {
      alignItems: 'center',
      marginRight: spacing.xl,
    },
    cuisineIcon: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    cuisineIconActive: {
      backgroundColor: colors.primary[500],
    },
    cuisineName: {
      ...typography.labelSmall,
      color: theme.text.secondary,
    },
    cuisineNameActive: {
      color: colors.primary[500],
      fontWeight: '600',
    },
    restaurantsContainer: {
      paddingHorizontal: spacing.lg,
    },
    restaurantCard: {
      marginBottom: spacing.lg,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      backgroundColor: theme.surface.card,
      ...shadows.md,
    },
    restaurantImage: {
      width: '100%',
      height: 160,
      backgroundColor: theme.background.tertiary,
    },
    promoTag: {
      position: 'absolute',
      top: spacing.md,
      left: spacing.md,
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    promoText: {
      ...typography.labelSmall,
      color: colors.neutral[0],
      fontWeight: '700',
    },
    favoriteButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      backgroundColor: 'rgba(255,255,255,0.9)',
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    restaurantInfo: {
      padding: spacing.lg,
    },
    restaurantHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    restaurantName: {
      ...typography.titleLarge,
      color: theme.text.primary,
      flex: 1,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success.light,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    ratingText: {
      ...typography.labelMedium,
      color: colors.success.dark,
      marginLeft: spacing.xs,
    },
    restaurantMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      flexWrap: 'wrap',
    },
    metaText: {
      ...typography.bodySmall,
      color: theme.text.secondary,
    },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: theme.text.tertiary,
      marginHorizontal: spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      marginTop: spacing.md,
      gap: spacing.sm,
    },
    tag: {
      backgroundColor: theme.background.secondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    tagText: {
      ...typography.labelSmall,
      color: theme.text.secondary,
    },
    floatingCart: {
      position: 'absolute',
      bottom: spacing.xl,
      left: spacing.lg,
      right: spacing.lg,
      backgroundColor: colors.primary[500],
      borderRadius: borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
      ...shadows.xl,
    },
    floatingCartLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cartBadge: {
      backgroundColor: colors.neutral[0],
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    cartBadgeText: {
      ...typography.labelSmall,
      color: colors.primary[500],
      fontWeight: '700',
    },
    cartText: {
      ...typography.labelLarge,
      color: colors.neutral[0],
    },
    cartArrow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewCartText: {
      ...typography.labelMedium,
      color: colors.neutral[0],
      marginRight: spacing.xs,
    },
  });

  const renderRestaurantCard = (restaurant: Restaurant, index: number) => (
    <Animated.View
      key={restaurant.id}
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <TouchableOpacity
        style={styles.restaurantCard}
        activeOpacity={0.95}
        onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      >
        <View>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.restaurantImage}
            resizeMode="cover"
          />
          {restaurant.promo && (
            <View style={styles.promoTag}>
              <Text style={styles.promoText}>{restaurant.promo}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons 
              name={restaurant.isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={restaurant.isFavorite ? colors.error.main : colors.neutral[400]} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color={colors.success.dark} />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          </View>
          
          <View style={styles.restaurantMeta}>
            <Text style={styles.metaText}>{restaurant.cuisine.join(', ')}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{restaurant.distance}</Text>
          </View>
          
          <View style={styles.tagsContainer}>
            {restaurant.tags.slice(0, 2).map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {restaurant.deliveryFee === 0 && (
              <View style={[styles.tag, { backgroundColor: colors.success.light }]}>
                <Text style={[styles.tagText, { color: colors.success.dark }]}>
                  Free Delivery
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: cartItems.length > 0 ? 100 : 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Evening</Text>
          <Text style={styles.title}>What's for dinner?</Text>
          <View style={styles.universityBadge}>
            <Ionicons name="school" size={14} color={colors.primary[600]} />
            <Text style={styles.universityText}>IIT Delhi Campus</Text>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/explore')}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={20} color={theme.text.tertiary} />
          <Text style={styles.searchText}>Search for restaurants or dishes...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id 
                    ? styles.categoryChipActive 
                    : styles.categoryChipInactive
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Ionicons 
                  name={cat.icon as any} 
                  size={18} 
                  color={selectedCategory === cat.id ? colors.neutral[0] : theme.text.secondary} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat.id 
                    ? styles.categoryTextActive 
                    : styles.categoryTextInactive
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Hero Banner */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <LinearGradient
            colors={[colors.primary[600], colors.primary[500], colors.primary[400]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={styles.heroBannerContent}>
              <Text style={styles.heroTitle}>Campus Pro</Text>
              <Text style={styles.heroSubtitle}>Free delivery on all orders</Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Get 50% off first month</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Cuisines */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What are you craving?</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cuisinesScroll}
        >
          {cuisines.map((cuisine) => (
            <TouchableOpacity
              key={cuisine.id}
              style={styles.cuisineItem}
              onPress={() => setSelectedCuisine(cuisine.id)}
            >
              <View style={[
                styles.cuisineIcon,
                selectedCuisine === cuisine.id && styles.cuisineIconActive
              ]}>
                <Ionicons 
                  name={cuisine.icon as any} 
                  size={24} 
                  color={selectedCuisine === cuisine.id ? colors.neutral[0] : theme.text.secondary} 
                />
              </View>
              <Text style={[
                styles.cuisineName,
                selectedCuisine === cuisine.id && styles.cuisineNameActive
              ]}>
                {cuisine.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Restaurants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campus Favorites</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.restaurantsContainer}>
          {loading ? (
            <>  
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            restaurants.map((restaurant, index) => 
              renderRestaurantCard(restaurant, index)
            )
          )}
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <Animated.View 
          style={styles.floatingCart}
          entering={FadeInDown.springify()}
        >
          <TouchableOpacity 
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            onPress={() => router.push('/cart')}
          >
            <View style={styles.floatingCartLeft}>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems()}</Text>
              </View>
              <Text style={styles.cartText}>View Cart</Text>
            </View>
            <View style={styles.cartArrow}>
              <Ionicons name="chevron-forward" size={20} color={colors.neutral[0]} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
