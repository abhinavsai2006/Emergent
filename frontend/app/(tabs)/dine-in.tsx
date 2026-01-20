/**
 * Dine-In Screen - Table booking and QR scan
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { Button, Card, Modal } from '../../src/components/ui';

const dineInRestaurants = [
  {
    id: '1',
    name: 'The Campus Cafe',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    availableTables: 4,
    waitTime: '10 min',
    distance: '200m',
  },
  {
    id: '2',
    name: 'Library Lounge',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    availableTables: 2,
    waitTime: '15 min',
    distance: '350m',
  },
  {
    id: '3',
    name: 'Sports Canteen',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    availableTables: 8,
    waitTime: '5 min',
    distance: '500m',
  },
];

export default function DineInScreen() {
  const { theme, isDark } = useTheme();
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState('Now');
  const [partySize, setPartySize] = useState(2);

  const timeSlots = ['Now', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '7:00 PM', '7:30 PM', '8:00 PM'];

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
    subtitle: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
      marginTop: spacing.xs,
    },
    scanBanner: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing['2xl'],
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    scanBannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.xl,
    },
    scanIconContainer: {
      width: 64,
      height: 64,
      borderRadius: borderRadius.lg,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.lg,
    },
    scanTextContainer: {
      flex: 1,
    },
    scanTitle: {
      ...typography.titleLarge,
      color: colors.neutral[0],
    },
    scanSubtitle: {
      ...typography.bodySmall,
      color: colors.neutral[200],
      marginTop: spacing.xs,
    },
    sectionHeader: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
    },
    restaurantCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.surface.card,
      overflow: 'hidden',
      ...shadows.md,
    },
    restaurantImage: {
      width: '100%',
      height: 140,
    },
    restaurantInfo: {
      padding: spacing.lg,
    },
    restaurantName: {
      ...typography.titleLarge,
      color: theme.text.primary,
    },
    restaurantMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      gap: spacing.lg,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      ...typography.bodySmall,
      color: theme.text.secondary,
      marginLeft: spacing.xs,
    },
    availabilityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success.light,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      marginTop: spacing.md,
    },
    availabilityText: {
      ...typography.labelSmall,
      color: colors.success.dark,
      marginLeft: spacing.xs,
    },
    bookButton: {
      marginTop: spacing.md,
    },
    // Modal styles
    modalContent: {
      padding: spacing.lg,
    },
    modalTitle: {
      ...typography.headlineSmall,
      color: theme.text.primary,
      marginBottom: spacing.xl,
    },
    inputLabel: {
      ...typography.labelMedium,
      color: theme.text.secondary,
      marginBottom: spacing.sm,
    },
    partySizeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xl,
      marginBottom: spacing.xl,
    },
    partySizeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    partySizeText: {
      ...typography.displaySmall,
      color: theme.text.primary,
    },
    timeSlotScroll: {
      marginBottom: spacing.xl,
    },
    timeSlot: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      marginRight: spacing.sm,
      borderWidth: 1,
    },
    timeSlotActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    timeSlotInactive: {
      backgroundColor: 'transparent',
      borderColor: theme.border.default,
    },
    timeSlotText: {
      ...typography.labelMedium,
    },
    timeSlotTextActive: {
      color: colors.neutral[0],
    },
    timeSlotTextInactive: {
      color: theme.text.primary,
    },
    qrContainer: {
      alignItems: 'center',
      padding: spacing['2xl'],
    },
    qrFrame: {
      width: 200,
      height: 200,
      borderWidth: 3,
      borderColor: colors.primary[500],
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background.secondary,
    },
    qrInstructions: {
      ...typography.bodyMedium,
      color: theme.text.secondary,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });

  const handleBookTable = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setShowBookingModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dine-In</Text>
          <Text style={styles.subtitle}>Book a table or scan to order</Text>
        </View>

        {/* Scan QR Banner */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <TouchableOpacity onPress={() => setShowQRModal(true)}>
            <LinearGradient
              colors={[colors.primary[600], colors.primary[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scanBanner}
            >
              <View style={styles.scanBannerContent}>
                <View style={styles.scanIconContainer}>
                  <Ionicons name="qr-code" size={32} color={colors.neutral[0]} />
                </View>
                <View style={styles.scanTextContainer}>
                  <Text style={styles.scanTitle}>Scan to Order</Text>
                  <Text style={styles.scanSubtitle}>
                    Already at a restaurant? Scan the table QR code to order
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.neutral[0]} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Available Tables */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Book a Table</Text>
        </View>

        {dineInRestaurants.map((restaurant, index) => (
          <Animated.View
            key={restaurant.id}
            entering={FadeInDown.delay(200 + index * 100).springify()}
          >
            <View style={styles.restaurantCard}>
              <Image
                source={{ uri: restaurant.image }}
                style={styles.restaurantImage}
                resizeMode="cover"
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location" size={14} color={theme.text.tertiary} />
                    <Text style={styles.metaText}>{restaurant.distance}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={14} color={theme.text.tertiary} />
                    <Text style={styles.metaText}>{restaurant.waitTime} wait</Text>
                  </View>
                </View>
                <View style={styles.availabilityBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success.dark} />
                  <Text style={styles.availabilityText}>
                    {restaurant.availableTables} tables available
                  </Text>
                </View>
                <View style={styles.bookButton}>
                  <Button
                    title="Book Table"
                    onPress={() => handleBookTable(restaurant)}
                    fullWidth
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* QR Scan Modal */}
      <Modal visible={showQRModal} onClose={() => setShowQRModal(false)}>
        <View style={styles.qrContainer}>
          <Text style={styles.modalTitle}>Scan Table QR Code</Text>
          <View style={styles.qrFrame}>
            <Ionicons name="scan" size={80} color={theme.text.tertiary} />
          </View>
          <Text style={styles.qrInstructions}>
            Point your camera at the QR code on your table to start ordering
          </Text>
        </View>
      </Modal>

      {/* Booking Modal */}
      <Modal visible={showBookingModal} onClose={() => setShowBookingModal(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Book at {selectedRestaurant?.name}
          </Text>

          <Text style={styles.inputLabel}>Party Size</Text>
          <View style={styles.partySizeContainer}>
            <TouchableOpacity
              style={styles.partySizeButton}
              onPress={() => setPartySize(Math.max(1, partySize - 1))}
            >
              <Ionicons name="remove" size={24} color={theme.text.primary} />
            </TouchableOpacity>
            <Text style={styles.partySizeText}>{partySize}</Text>
            <TouchableOpacity
              style={styles.partySizeButton}
              onPress={() => setPartySize(Math.min(10, partySize + 1))}
            >
              <Ionicons name="add" size={24} color={theme.text.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Select Time</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.timeSlotScroll}
          >
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time
                    ? styles.timeSlotActive
                    : styles.timeSlotInactive,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time
                      ? styles.timeSlotTextActive
                      : styles.timeSlotTextInactive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Button
            title="Confirm Booking"
            onPress={() => {
              setShowBookingModal(false);
              // Handle booking
            }}
            fullWidth
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
