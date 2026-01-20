/**
 * Orders Screen - Order history and tracking
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { Chip, Button } from '../../src/components/ui';

const mockOrders = [
  {
    id: '1',
    restaurantName: 'Pizza Paradise',
    restaurantImage: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=100',
    items: ['Margherita Pizza', 'Garlic Bread'],
    total: 450,
    status: 'preparing',
    orderTime: '5 mins ago',
    estimatedTime: '15-20 mins',
  },
  {
    id: '2',
    restaurantName: 'Burger Junction',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100',
    items: ['Double Cheese Burger', 'Fries', 'Coke'],
    total: 320,
    status: 'delivered',
    orderTime: 'Yesterday, 8:30 PM',
  },
  {
    id: '3',
    restaurantName: 'Spice Garden',
    restaurantImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100',
    items: ['Butter Chicken', 'Naan', 'Rice'],
    total: 550,
    status: 'delivered',
    orderTime: '2 days ago',
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  placed: { bg: colors.info.light, text: colors.info.dark },
  confirmed: { bg: colors.info.light, text: colors.info.dark },
  preparing: { bg: colors.warning.light, text: colors.warning.dark },
  ready: { bg: colors.success.light, text: colors.success.dark },
  'out-for-delivery': { bg: colors.primary[100], text: colors.primary[700] },
  delivered: { bg: colors.success.light, text: colors.success.dark },
  cancelled: { bg: colors.error.light, text: colors.error.dark },
};

const statusLabels: Record<string, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  'out-for-delivery': 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrdersScreen() {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeOrders = mockOrders.filter((o) => ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery'].includes(o.status));
  const pastOrders = mockOrders.filter((o) => ['delivered', 'cancelled'].includes(o.status));

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
    tabs: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    tab: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.full,
    },
    tabActive: {
      backgroundColor: colors.primary[500],
    },
    tabInactive: {
      backgroundColor: theme.background.secondary,
    },
    tabText: {
      ...typography.labelMedium,
    },
    tabTextActive: {
      color: colors.neutral[0],
    },
    tabTextInactive: {
      color: theme.text.secondary,
    },
    orderCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.surface.card,
      ...shadows.md,
      overflow: 'hidden',
    },
    orderHeader: {
      flexDirection: 'row',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    restaurantImage: {
      width: 50,
      height: 50,
      borderRadius: borderRadius.md,
      backgroundColor: theme.background.tertiary,
    },
    orderHeaderInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    restaurantName: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    orderTime: {
      ...typography.bodySmall,
      color: theme.text.tertiary,
      marginTop: spacing.xxs,
    },
    statusBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
    },
    statusText: {
      ...typography.labelSmall,
      fontWeight: '600',
    },
    orderBody: {
      padding: spacing.lg,
    },
    itemsText: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
    },
    orderFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      paddingTop: 0,
    },
    totalText: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    trackButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
    },
    trackButtonText: {
      ...typography.labelMedium,
      color: colors.neutral[0],
      marginLeft: spacing.xs,
    },
    reorderButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.secondary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
    },
    reorderButtonText: {
      ...typography.labelMedium,
      color: theme.text.primary,
      marginLeft: spacing.xs,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing['5xl'],
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      ...typography.titleLarge,
      color: theme.text.primary,
      marginBottom: spacing.sm,
    },
    emptySubtitle: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
      textAlign: 'center',
    },
    estimatedTime: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    estimatedTimeText: {
      ...typography.labelMedium,
      color: colors.primary[500],
      marginLeft: spacing.xs,
    },
  });

  const renderOrderCard = (order: typeof mockOrders[0], index: number) => {
    const isActive = activeTab === 'active';
    const statusColor = statusColors[order.status] || statusColors.placed;

    return (
      <Animated.View
        key={order.id}
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <TouchableOpacity
          style={styles.orderCard}
          activeOpacity={0.9}
          onPress={() => router.push(`/order/${order.id}`)}
        >
          <View style={styles.orderHeader}>
            <Image
              source={{ uri: order.restaurantImage }}
              style={styles.restaurantImage}
            />
            <View style={styles.orderHeaderInfo}>
              <Text style={styles.restaurantName}>{order.restaurantName}</Text>
              <Text style={styles.orderTime}>{order.orderTime}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {statusLabels[order.status]}
              </Text>
            </View>
          </View>

          <View style={styles.orderBody}>
            <Text style={styles.itemsText} numberOfLines={1}>
              {order.items.join(', ')}
            </Text>
            {order.estimatedTime && (
              <View style={styles.estimatedTime}>
                <Ionicons name="time" size={14} color={colors.primary[500]} />
                <Text style={styles.estimatedTimeText}>
                  Estimated: {order.estimatedTime}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.orderFooter}>
            <Text style={styles.totalText}>₹{order.total}</Text>
            {isActive ? (
              <TouchableOpacity style={styles.trackButton}>
                <Ionicons name="navigate" size={16} color={colors.neutral[0]} />
                <Text style={styles.trackButtonText}>Track Order</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.reorderButton}>
                <Ionicons name="refresh" size={16} color={theme.text.primary} />
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ordersToShow = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' ? styles.tabActive : styles.tabInactive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' ? styles.tabTextActive : styles.tabTextInactive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' ? styles.tabActive : styles.tabInactive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' ? styles.tabTextActive : styles.tabTextInactive]}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {ordersToShow.length > 0 ? (
          ordersToShow.map((order, index) => renderOrderCard(order, index))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={40} color={theme.text.tertiary} />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' ? 'No active orders' : 'No past orders'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active'
                ? 'Your active orders will appear here'
                : 'Your order history will appear here'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
