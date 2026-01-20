/**
 * Restaurant Detail Screen - Menu, customizations, ordering
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { Button, Modal, Skeleton, SkeletonMenuItem } from '../../src/components/ui';
import { useCartStore } from '../../src/store/cartStore';
import { MenuItem, Restaurant } from '../../src/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

// Mock restaurant data
const mockRestaurantDetails: Record<string, Restaurant> = {
  '1': {
    id: '1',
    name: 'Pizza Paradise',
    description: 'Authentic Italian pizzas with fresh ingredients imported from Italy. Wood-fired oven baked to perfection.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800',
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
  '2': {
    id: '2',
    name: 'Burger Junction',
    description: 'Juicy burgers made with premium beef',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
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
  '3': {
    id: '3',
    name: 'Spice Garden',
    description: 'Traditional Indian cuisine with authentic spices',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
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
  '4': {
    id: '4',
    name: 'Wok Express',
    description: 'Quick and delicious Chinese takeaway',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
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
  '5': {
    id: '5',
    name: 'Green Bowl',
    description: 'Healthy salads and smoothie bowls',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
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
};

// Mock menu items
const mockMenuItems: MenuItem[] = [
  {
    id: 'm1',
    restaurantId: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, fresh mozzarella, basil leaves',
    price: 299,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
    category: 'Pizzas',
    isVeg: true,
    isBestseller: true,
  },
  {
    id: 'm2',
    restaurantId: '1',
    name: 'Pepperoni Feast',
    description: 'Loaded with spicy pepperoni and extra cheese',
    price: 399,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
    category: 'Pizzas',
    isVeg: false,
    isPopular: true,
  },
  {
    id: 'm3',
    restaurantId: '1',
    name: 'Garlic Bread',
    description: 'Crispy bread with garlic butter and herbs',
    price: 129,
    image: 'https://images.unsplash.com/photo-1619531040576-f9416740661b?w=300',
    category: 'Sides',
    isVeg: true,
  },
  {
    id: 'm4',
    restaurantId: '1',
    name: 'Cheese Burst',
    description: 'Extra cheese stuffed crust with your favorite toppings',
    price: 449,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300',
    category: 'Pizzas',
    isVeg: true,
    isPopular: true,
  },
  {
    id: 'm5',
    restaurantId: '1',
    name: 'Pasta Alfredo',
    description: 'Creamy white sauce pasta with mushrooms',
    price: 249,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300',
    category: 'Pasta',
    isVeg: true,
  },
  {
    id: 'm6',
    restaurantId: '1',
    name: 'Cold Coffee',
    description: 'Refreshing iced coffee with cream',
    price: 99,
    category: 'Beverages',
    isVeg: true,
  },
];

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const scrollY = useRef(new RNAnimated.Value(0)).current;
  const { addItem, items: cartItems, totalItems, subtotal } = useCartStore();

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const rest = mockRestaurantDetails[id || '1'] || mockRestaurantDetails['1'];
      setRestaurant(rest);
      setMenuItems(mockMenuItems);
      setLoading(false);
    }, 800);
  };

  const handleAddToCart = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowCustomizeModal(true);
  };

  const confirmAddToCart = () => {
    if (selectedItem && restaurant) {
      addItem(
        {
          menuItemId: selectedItem.id,
          restaurantId: restaurant.id,
          name: selectedItem.name,
          price: selectedItem.price,
          quantity: quantity,
          image: selectedItem.image,
        },
        { id: restaurant.id, name: restaurant.name }
      );
      setShowCustomizeModal(false);
    }
  };

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    stickyHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: theme.background.primary,
      paddingTop: 50,
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    stickyHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stickyHeaderTitle: {
      ...typography.titleLarge,
      color: theme.text.primary,
      marginLeft: spacing.md,
    },
    headerImage: {
      width: SCREEN_WIDTH,
      height: HEADER_HEIGHT,
    },
    headerOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: spacing.lg,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    favoriteButton: {
      position: 'absolute',
      top: 50,
      right: spacing.lg,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    restaurantInfoCard: {
      backgroundColor: theme.surface.card,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      marginTop: -24,
      padding: spacing.xl,
    },
    restaurantName: {
      ...typography.headlineMedium,
      color: theme.text.primary,
    },
    restaurantDescription: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
      marginTop: spacing.sm,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      flexWrap: 'wrap',
      gap: spacing.lg,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingBadge: {
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
    metaText: {
      ...typography.bodySmall,
      color: theme.text.secondary,
      marginLeft: spacing.xs,
    },
    promoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary[50],
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginTop: spacing.lg,
    },
    promoText: {
      ...typography.labelMedium,
      color: colors.primary[600],
      marginLeft: spacing.sm,
    },
    menuSection: {
      padding: spacing.lg,
    },
    categoryTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
      marginBottom: spacing.md,
      marginTop: spacing.lg,
    },
    menuItemCard: {
      flexDirection: 'row',
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      overflow: 'hidden',
      ...shadows.sm,
    },
    menuItemInfo: {
      flex: 1,
      padding: spacing.lg,
    },
    vegIndicator: {
      width: 16,
      height: 16,
      borderRadius: 2,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    vegDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    menuItemName: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    bestseller: {
      ...typography.labelSmall,
      color: colors.warning.dark,
      marginTop: spacing.xxs,
    },
    menuItemDescription: {
      ...typography.bodySmall,
      color: theme.text.tertiary,
      marginTop: spacing.xs,
    },
    menuItemPrice: {
      ...typography.titleMedium,
      color: theme.text.primary,
      marginTop: spacing.sm,
    },
    menuItemImageContainer: {
      width: 100,
      padding: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemImage: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.md,
      backgroundColor: theme.background.tertiary,
    },
    addButton: {
      position: 'absolute',
      bottom: spacing.sm,
      right: spacing.md,
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      ...shadows.sm,
    },
    addButtonText: {
      ...typography.labelMedium,
      color: colors.neutral[0],
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
    cartTotal: {
      ...typography.titleMedium,
      color: colors.neutral[0],
    },
    // Modal styles
    modalContent: {
      padding: spacing.lg,
    },
    modalImage: {
      width: '100%',
      height: 180,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.background.tertiary,
      marginBottom: spacing.lg,
    },
    modalTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
    },
    modalDescription: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
      marginTop: spacing.sm,
    },
    modalPrice: {
      ...typography.headlineSmall,
      color: theme.text.primary,
      marginTop: spacing.lg,
    },
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.xl,
    },
    quantityButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityText: {
      ...typography.headlineMedium,
      color: theme.text.primary,
      marginHorizontal: spacing['2xl'],
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ height: HEADER_HEIGHT }}>
          <Skeleton width="100%" height={HEADER_HEIGHT} borderRadius="none" />
        </View>
        <View style={{ padding: spacing.lg }}>
          <Skeleton width="70%" height={24} />
          <Skeleton width="100%" height={16} style={{ marginTop: spacing.sm }} />
          <Skeleton width="60%" height={16} style={{ marginTop: spacing.sm }} />
        </View>
        <View style={{ padding: spacing.lg }}>
          <SkeletonMenuItem />
          <SkeletonMenuItem />
          <SkeletonMenuItem />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <RNAnimated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <View style={styles.stickyHeaderContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </TouchableOpacity>
          <Text style={styles.stickyHeaderTitle} numberOfLines={1}>
            {restaurant?.name}
          </Text>
        </View>
      </RNAnimated.View>

      <RNAnimated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: cartItems.length > 0 ? 100 : 20 }}
      >
        {/* Header Image */}
        <View>
          <Image
            source={{ uri: restaurant?.image }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.headerOverlay}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.neutral[900]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color={colors.neutral[900]} />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info Card */}
        <View style={styles.restaurantInfoCard}>
          <Text style={styles.restaurantName}>{restaurant?.name}</Text>
          <Text style={styles.restaurantDescription}>
            {restaurant?.description}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={colors.success.dark} />
              <Text style={styles.ratingText}>
                {restaurant?.rating} ({restaurant?.reviewCount}+)
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color={theme.text.tertiary} />
              <Text style={styles.metaText}>{restaurant?.deliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color={theme.text.tertiary} />
              <Text style={styles.metaText}>{restaurant?.distance}</Text>
            </View>
          </View>

          {restaurant?.promo && (
            <View style={styles.promoBanner}>
              <Ionicons name="pricetag" size={18} color={colors.primary[600]} />
              <Text style={styles.promoText}>{restaurant.promo} on all orders</Text>
            </View>
          )}
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          {Object.entries(menuByCategory).map(([category, items], categoryIndex) => (
            <Animated.View
              key={category}
              entering={FadeInDown.delay(categoryIndex * 100).springify()}
            >
              <Text style={styles.categoryTitle}>{category}</Text>
              {items.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInRight.delay(index * 50).springify()}
                >
                  <View style={styles.menuItemCard}>
                    <View style={styles.menuItemInfo}>
                      <View
                        style={[
                          styles.vegIndicator,
                          {
                            borderColor: item.isVeg
                              ? colors.success.main
                              : colors.error.main,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.vegDot,
                            {
                              backgroundColor: item.isVeg
                                ? colors.success.main
                                : colors.error.main,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      {item.isBestseller && (
                        <Text style={styles.bestseller}>Bestseller</Text>
                      )}
                      {item.description && (
                        <Text style={styles.menuItemDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                      <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                    </View>
                    <View style={styles.menuItemImageContainer}>
                      {item.image && (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.menuItemImage}
                          resizeMode="cover"
                        />
                      )}
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(item)}
                      >
                        <Text style={styles.addButtonText}>ADD</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          ))}
        </View>
      </RNAnimated.ScrollView>

      {/* Floating Cart */}
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
            <Text style={styles.cartTotal}>₹{subtotal()}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Customize Modal */}
      <Modal
        visible={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
      >
        <View style={styles.modalContent}>
          {selectedItem?.image && (
            <Image
              source={{ uri: selectedItem.image }}
              style={styles.modalImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
          {selectedItem?.description && (
            <Text style={styles.modalDescription}>{selectedItem.description}</Text>
          )}
          <Text style={styles.modalPrice}>
            ₹{(selectedItem?.price || 0) * quantity}
          </Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={24} color={theme.text.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>

          <Button
            title={`Add to Cart - ₹${(selectedItem?.price || 0) * quantity}`}
            onPress={confirmAddToCart}
            fullWidth
          />
        </View>
      </Modal>
    </View>
  );
}
