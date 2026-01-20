/**
 * Cart Screen - Review items and proceed to checkout
 */

import React from 'react';
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
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../src/hooks/useTheme';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius, shadows } from '../src/theme/spacing';
import { colors } from '../src/theme/colors';
import { Button } from '../src/components/ui';
import { useCartStore } from '../src/store/cartStore';

export default function CartScreen() {
  const { theme, isDark } = useTheme();
  const {
    items,
    restaurantName,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
  } = useCartStore();

  const deliveryFee = 25;
  const taxes = Math.round(subtotal() * 0.05);
  const total = subtotal() + deliveryFee + taxes;

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
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
      marginLeft: spacing.md,
    },
    clearButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    clearButtonText: {
      ...typography.labelMedium,
      color: colors.error.main,
    },
    restaurantInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: theme.background.secondary,
    },
    restaurantName: {
      ...typography.titleMedium,
      color: theme.text.primary,
      marginLeft: spacing.sm,
    },
    itemsContainer: {
      padding: spacing.lg,
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: borderRadius.md,
      backgroundColor: theme.background.tertiary,
    },
    itemInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    itemName: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    itemCustomizations: {
      ...typography.bodySmall,
      color: theme.text.tertiary,
      marginTop: spacing.xxs,
    },
    itemPriceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
    },
    itemPrice: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.secondary,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
    },
    quantityButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityText: {
      ...typography.labelLarge,
      color: theme.text.primary,
      paddingHorizontal: spacing.md,
    },
    deleteButton: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
    },
    addMoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border.light,
      borderRadius: borderRadius.lg,
      borderStyle: 'dashed',
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    addMoreText: {
      ...typography.labelMedium,
      color: colors.primary[500],
      marginLeft: spacing.sm,
    },
    summaryContainer: {
      backgroundColor: theme.surface.card,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      padding: spacing.xl,
      ...shadows.lg,
    },
    summaryTitle: {
      ...typography.titleMedium,
      color: theme.text.primary,
      marginBottom: spacing.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    summaryLabel: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
    },
    summaryValue: {
      ...typography.bodyMedium,
      color: theme.text.primary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border.light,
      marginVertical: spacing.md,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
    },
    totalLabel: {
      ...typography.titleLarge,
      color: theme.text.primary,
    },
    totalValue: {
      ...typography.titleLarge,
      color: theme.text.primary,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    emptyTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
      marginBottom: spacing.sm,
    },
    emptySubtitle: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
  });

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={theme.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cart</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="cart-outline" size={48} color={theme.text.tertiary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items from a restaurant to start your order
          </Text>
          <Button
            title="Browse Restaurants"
            onPress={() => router.push('/')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={theme.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Ionicons name="restaurant" size={20} color={theme.text.secondary} />
          <Text style={styles.restaurantName}>{restaurantName}</Text>
        </View>

        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.delay(index * 50).springify()}
            >
              <View style={styles.cartItem}>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.customizations && item.customizations.length > 0 && (
                    <Text style={styles.itemCustomizations}>
                      {item.customizations.join(', ')}
                    </Text>
                  )}
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPrice}>
                      ₹{item.price * item.quantity}
                    </Text>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Ionicons
                          name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                          size={18}
                          color={item.quantity === 1 ? colors.error.main : theme.text.primary}
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={18} color={colors.primary[500]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Add More Items */}
        <TouchableOpacity
          style={styles.addMoreContainer}
          onPress={() => router.back()}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.primary[500]} />
          <Text style={styles.addMoreText}>Add more items</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Order Summary */}
      <Animated.View
        style={styles.summaryContainer}
        entering={FadeInDown.springify()}
      >
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({totalItems()} items)</Text>
          <Text style={styles.summaryValue}>₹{subtotal()}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes & Charges</Text>
          <Text style={styles.summaryValue}>₹{taxes}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>

        <Button
          title="Proceed to Checkout"
          onPress={() => router.push('/checkout')}
          fullWidth
          size="large"
        />
      </Animated.View>
    </SafeAreaView>
  );
}
