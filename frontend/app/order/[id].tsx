/**
 * Order Tracking Screen - Live order status
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { Button, Card } from '../../src/components/ui';

const orderStatuses = [
  { id: 'placed', label: 'Order Placed', icon: 'checkmark-circle' },
  { id: 'confirmed', label: 'Restaurant Confirmed', icon: 'restaurant' },
  { id: 'preparing', label: 'Preparing your food', icon: 'flame' },
  { id: 'ready', label: 'Ready for pickup', icon: 'bag-check' },
  { id: 'out-for-delivery', label: 'Out for delivery', icon: 'bicycle' },
  { id: 'delivered', label: 'Delivered', icon: 'home' },
];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const [currentStatus, setCurrentStatus] = useState('preparing');
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    // Animate the current status dot
    pulseAnim.value = withRepeat(
      withTiming(1.3, { duration: 800 }),
      -1,
      true
    );

    // Simulate order progress
    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        const currentIndex = orderStatuses.findIndex((s) => s.id === prev);
        if (currentIndex < orderStatuses.length - 1) {
          return orderStatuses[currentIndex + 1].id;
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const getCurrentStatusIndex = () =>
    orderStatuses.findIndex((s) => s.id === currentStatus);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    headerTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
    },
    orderNumber: {
      ...typography.labelMedium,
      color: theme.text.tertiary,
    },
    statusCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    statusCardContent: {
      padding: spacing.xl,
    },
    statusTitle: {
      ...typography.headlineSmall,
      color: colors.neutral[0],
    },
    statusSubtitle: {
      ...typography.bodyMedium,
      color: colors.neutral[200],
      marginTop: spacing.xs,
    },
    etaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
    },
    etaText: {
      ...typography.labelLarge,
      color: colors.neutral[0],
      marginLeft: spacing.sm,
    },
    trackingContainer: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.titleMedium,
      color: theme.text.secondary,
      marginBottom: spacing.lg,
    },
    trackingStep: {
      flexDirection: 'row',
      marginBottom: spacing.lg,
    },
    trackingDotContainer: {
      alignItems: 'center',
      width: 40,
    },
    trackingDot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trackingDotCompleted: {
      backgroundColor: colors.success.main,
    },
    trackingDotCurrent: {
      backgroundColor: colors.primary[500],
    },
    trackingDotPending: {
      backgroundColor: theme.background.tertiary,
    },
    trackingLine: {
      width: 2,
      flex: 1,
      marginTop: spacing.xs,
    },
    trackingLineCompleted: {
      backgroundColor: colors.success.main,
    },
    trackingLinePending: {
      backgroundColor: theme.border.light,
    },
    trackingInfo: {
      flex: 1,
      marginLeft: spacing.md,
      paddingBottom: spacing.md,
    },
    trackingLabel: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    trackingLabelPending: {
      color: theme.text.tertiary,
    },
    trackingTime: {
      ...typography.bodySmall,
      color: theme.text.tertiary,
      marginTop: spacing.xxs,
    },
    orderDetailsCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.xl,
      ...shadows.md,
      overflow: 'hidden',
    },
    restaurantHeader: {
      flexDirection: 'row',
      alignItems: 'center',
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
    restaurantInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    restaurantName: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    itemCount: {
      ...typography.bodySmall,
      color: theme.text.tertiary,
    },
    orderItems: {
      padding: spacing.lg,
    },
    orderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    orderItemName: {
      ...typography.bodyMedium,
      color: theme.text.primary,
    },
    orderItemQty: {
      ...typography.bodyMedium,
      color: theme.text.tertiary,
    },
    orderTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border.light,
    },
    totalLabel: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    totalValue: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    deliveryCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows.sm,
    },
    deliveryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    deliveryTitle: {
      ...typography.titleMedium,
      color: theme.text.primary,
      marginLeft: spacing.sm,
    },
    deliveryAddress: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
    },
    supportButton: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing['3xl'],
    },
  });

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Order Status</Text>
            <Text style={styles.orderNumber}>#{id}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="call-outline" size={24} color={theme.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Status Banner */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <LinearGradient
            colors={
              currentStatus === 'delivered'
                ? [colors.success.dark, colors.success.main]
                : [colors.primary[600], colors.primary[500]]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusCard}
          >
            <View style={styles.statusCardContent}>
              <Text style={styles.statusTitle}>
                {orderStatuses.find((s) => s.id === currentStatus)?.label}
              </Text>
              <Text style={styles.statusSubtitle}>
                {currentStatus === 'delivered'
                  ? 'Your order has been delivered. Enjoy!'
                  : 'Your order is being prepared with love'}
              </Text>
              {currentStatus !== 'delivered' && (
                <View style={styles.etaContainer}>
                  <Ionicons name="time" size={18} color={colors.neutral[0]} />
                  <Text style={styles.etaText}>Arriving in 15-20 mins</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Order Tracking Steps */}
        <View style={styles.trackingContainer}>
          <Text style={styles.sectionTitle}>ORDER PROGRESS</Text>
          {orderStatuses.map((status, index) => {
            const isCompleted = index < currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const isPending = index > currentStatusIndex;

            return (
              <Animated.View
                key={status.id}
                style={styles.trackingStep}
                entering={FadeInRight.delay(200 + index * 100).springify()}
              >
                <View style={styles.trackingDotContainer}>
                  <Animated.View
                    style={[
                      styles.trackingDot,
                      isCompleted && styles.trackingDotCompleted,
                      isCurrent && styles.trackingDotCurrent,
                      isPending && styles.trackingDotPending,
                      isCurrent && pulseStyle,
                    ]}
                  >
                    <Ionicons
                      name={
                        isCompleted
                          ? 'checkmark'
                          : (status.icon as any)
                      }
                      size={14}
                      color={
                        isPending ? theme.text.tertiary : colors.neutral[0]
                      }
                    />
                  </Animated.View>
                  {index < orderStatuses.length - 1 && (
                    <View
                      style={[
                        styles.trackingLine,
                        isCompleted
                          ? styles.trackingLineCompleted
                          : styles.trackingLinePending,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.trackingInfo}>
                  <Text
                    style={[
                      styles.trackingLabel,
                      isPending && styles.trackingLabelPending,
                    ]}
                  >
                    {status.label}
                  </Text>
                  {(isCompleted || isCurrent) && (
                    <Text style={styles.trackingTime}>
                      {isCurrent ? 'In progress' : '5:30 PM'}
                    </Text>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </View>

        {/* Order Details */}
        <Animated.View
          style={styles.orderDetailsCard}
          entering={FadeInDown.delay(400).springify()}
        >
          <View style={styles.restaurantHeader}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=100',
              }}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>Pizza Paradise</Text>
              <Text style={styles.itemCount}>3 items</Text>
            </View>
            <TouchableOpacity>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.text.tertiary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.orderItems}>
            <View style={styles.orderItem}>
              <Text style={styles.orderItemName}>Margherita Pizza</Text>
              <Text style={styles.orderItemQty}>x1</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderItemName}>Garlic Bread</Text>
              <Text style={styles.orderItemQty}>x2</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderItemName}>Cold Coffee</Text>
              <Text style={styles.orderItemQty}>x1</Text>
            </View>
          </View>

          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹527</Text>
          </View>
        </Animated.View>

        {/* Delivery Address */}
        <Animated.View
          style={styles.deliveryCard}
          entering={FadeInDown.delay(500).springify()}
        >
          <View style={styles.deliveryHeader}>
            <Ionicons name="location" size={20} color={colors.primary[500]} />
            <Text style={styles.deliveryTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.deliveryAddress}>
            Nilgiri Hostel, Room 234{"\n"}
            IIT Delhi Campus, New Delhi
          </Text>
        </Animated.View>

        {/* Support Button */}
        <View style={styles.supportButton}>
          <Button
            title="Need Help? Contact Support"
            variant="outline"
            onPress={() => {}}
            fullWidth
            icon={
              <Ionicons
                name="headset"
                size={18}
                color={colors.primary[500]}
                style={{ marginRight: spacing.sm }}
              />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
