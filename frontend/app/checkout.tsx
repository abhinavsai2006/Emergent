/**
 * Checkout Screen - Delivery details and payment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../src/hooks/useTheme';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius, shadows } from '../src/theme/spacing';
import { colors } from '../src/theme/colors';
import { Button, Card, Modal } from '../src/components/ui';
import { useCartStore } from '../src/store/cartStore';

const timeSlots = [
  'ASAP',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
];

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: 'phone-portrait', description: 'Google Pay, PhonePe, etc.' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'card', description: 'Visa, Mastercard, etc.' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'cash', description: 'Pay when delivered' },
  { id: 'wallet', name: 'Campus Wallet', icon: 'wallet', description: 'Balance: ₹500' },
];

export default function CheckoutScreen() {
  const { theme, isDark } = useTheme();
  const { items, restaurantName, subtotal, clearCart, setDeliveryAddress, orderType, setOrderType } = useCartStore();
  
  const [hostelBlock, setHostelBlock] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('ASAP');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const deliveryFee = orderType === 'delivery' ? 25 : 0;
  const taxes = Math.round(subtotal() * 0.05);
  const total = subtotal() + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    if (orderType === 'delivery' && (!hostelBlock || !roomNumber)) {
      // Show error
      return;
    }

    setIsPlacingOrder(true);
    
    // Simulate order placement
    setTimeout(() => {
      setDeliveryAddress({ hostelBlock, roomNumber });
      clearCart();
      setIsPlacingOrder(false);
      router.replace('/order/1'); // Navigate to order tracking
    }, 2000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    headerTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
      marginLeft: spacing.md,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: spacing.lg,
    },
    sectionTitle: {
      ...typography.titleMedium,
      color: theme.text.secondary,
      marginBottom: spacing.md,
    },
    orderTypeContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    orderTypeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1.5,
    },
    orderTypeActive: {
      backgroundColor: colors.primary[50],
      borderColor: colors.primary[500],
    },
    orderTypeInactive: {
      backgroundColor: theme.surface.card,
      borderColor: theme.border.light,
    },
    orderTypeText: {
      ...typography.labelMedium,
      marginLeft: spacing.sm,
    },
    orderTypeTextActive: {
      color: colors.primary[600],
    },
    orderTypeTextInactive: {
      color: theme.text.secondary,
    },
    addressCard: {
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.sm,
    },
    inputRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    inputContainer: {
      flex: 1,
    },
    inputLabel: {
      ...typography.labelMedium,
      color: theme.text.secondary,
      marginBottom: spacing.xs,
    },
    input: {
      backgroundColor: theme.background.secondary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      ...typography.bodyMedium,
      color: theme.text.primary,
      borderWidth: 1,
      borderColor: theme.border.light,
    },
    timeSlotButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.sm,
    },
    timeSlotLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeSlotText: {
      ...typography.titleMedium,
      color: theme.text.primary,
      marginLeft: spacing.md,
    },
    timeSlotValue: {
      ...typography.bodyMedium,
      color: colors.primary[500],
    },
    paymentCard: {
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      ...shadows.sm,
    },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    paymentOptionLast: {
      borderBottomWidth: 0,
    },
    paymentIcon: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    paymentInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    paymentName: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    paymentDescription: {
      ...typography.bodySmall,
      color: theme.text.tertiary,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: colors.primary[500],
    },
    radioUnselected: {
      borderColor: theme.border.default,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary[500],
    },
    instructionsInput: {
      backgroundColor: theme.surface.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...typography.bodyMedium,
      color: theme.text.primary,
      minHeight: 80,
      textAlignVertical: 'top',
      ...shadows.sm,
    },
    footer: {
      backgroundColor: theme.surface.card,
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border.light,
      ...shadows.lg,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    priceLabel: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
    },
    priceValue: {
      ...typography.bodyMedium,
      color: theme.text.primary,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
    },
    totalLabel: {
      ...typography.titleLarge,
      color: theme.text.primary,
    },
    totalValue: {
      ...typography.titleLarge,
      color: theme.text.primary,
    },
    // Time modal styles
    modalContent: {
      padding: spacing.lg,
    },
    modalTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
      marginBottom: spacing.lg,
    },
    timeSlotGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    timeSlotChip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
    },
    timeSlotChipActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    timeSlotChipInactive: {
      backgroundColor: 'transparent',
      borderColor: theme.border.default,
    },
    timeSlotChipText: {
      ...typography.labelMedium,
    },
    timeSlotChipTextActive: {
      color: colors.neutral[0],
    },
    timeSlotChipTextInactive: {
      color: theme.text.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ORDER TYPE</Text>
            <View style={styles.orderTypeContainer}>
              {(['delivery', 'takeaway'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.orderTypeButton,
                    orderType === type
                      ? styles.orderTypeActive
                      : styles.orderTypeInactive,
                  ]}
                  onPress={() => setOrderType(type)}
                >
                  <Ionicons
                    name={type === 'delivery' ? 'bicycle' : 'bag-handle'}
                    size={20}
                    color={
                      orderType === type
                        ? colors.primary[500]
                        : theme.text.tertiary
                    }
                  />
                  <Text
                    style={[
                      styles.orderTypeText,
                      orderType === type
                        ? styles.orderTypeTextActive
                        : styles.orderTypeTextInactive,
                    ]}
                  >
                    {type === 'delivery' ? 'Delivery' : 'Takeaway'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <Animated.View entering={FadeInDown.springify()}>
                <Text style={styles.sectionTitle}>DELIVERY ADDRESS</Text>
                <View style={styles.addressCard}>
                  <View style={styles.inputRow}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Hostel Block</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., Nilgiri"
                        placeholderTextColor={theme.text.tertiary}
                        value={hostelBlock}
                        onChangeText={setHostelBlock}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Room Number</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., 234"
                        placeholderTextColor={theme.text.tertiary}
                        value={roomNumber}
                        onChangeText={setRoomNumber}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Delivery Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DELIVERY TIME</Text>
            <TouchableOpacity
              style={styles.timeSlotButton}
              onPress={() => setShowTimeModal(true)}
            >
              <View style={styles.timeSlotLeft}>
                <Ionicons name="time" size={20} color={theme.text.secondary} />
                <Text style={styles.timeSlotText}>Scheduled Time</Text>
              </View>
              <Text style={styles.timeSlotValue}>{selectedTimeSlot}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
            <View style={styles.paymentCard}>
              {paymentMethods.map((method, index) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    index === paymentMethods.length - 1 && styles.paymentOptionLast,
                  ]}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <View style={styles.paymentIcon}>
                    <Ionicons
                      name={method.icon as any}
                      size={22}
                      color={theme.text.secondary}
                    />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentName}>{method.name}</Text>
                    <Text style={styles.paymentDescription}>
                      {method.description}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radioOuter,
                      selectedPayment === method.id
                        ? styles.radioSelected
                        : styles.radioUnselected,
                    ]}
                  >
                    {selectedPayment === method.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SPECIAL INSTRUCTIONS</Text>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Any special requests? (e.g., no onions, extra napkins)"
              placeholderTextColor={theme.text.tertiary}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        {/* Footer with Total and Place Order */}
        <View style={styles.footer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{subtotal()}</Text>
          </View>
          {orderType === 'delivery' && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>₹{deliveryFee}</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes</Text>
            <Text style={styles.priceValue}>₹{taxes}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
          <Button
            title={isPlacingOrder ? 'Placing Order...' : `Place Order - ₹${total}`}
            onPress={handlePlaceOrder}
            fullWidth
            size="large"
            loading={isPlacingOrder}
            disabled={orderType === 'delivery' && (!hostelBlock || !roomNumber)}
          />
        </View>

        {/* Time Slot Modal */}
        <Modal visible={showTimeModal} onClose={() => setShowTimeModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Delivery Time</Text>
            <View style={styles.timeSlotGrid}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlotChip,
                    selectedTimeSlot === slot
                      ? styles.timeSlotChipActive
                      : styles.timeSlotChipInactive,
                  ]}
                  onPress={() => {
                    setSelectedTimeSlot(slot);
                    setShowTimeModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timeSlotChipText,
                      selectedTimeSlot === slot
                        ? styles.timeSlotChipTextActive
                        : styles.timeSlotChipTextInactive,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
