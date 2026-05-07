import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Screen, Card, Header, SectionTitle, ActionButton } from "@/components/ClinicUI";
import { useColors } from "@/hooks/useColors";
import { useClinic } from "@/lib/ClinicContext";

export default function DoctorScheduleScreen() {
  const colors = useColors();
  const { appointments, patients } = useClinic();

  const slots = [
    { time: "09:00 AM", status: "finished", patient: "Maya Sharma" },
    { time: "10:00 AM", status: "current", patient: "Arjun Nair" },
    { time: "11:00 AM", status: "upcoming", patient: "Vikram Das" },
    { time: "02:00 PM", status: "upcoming", patient: "Priya Singh" },
    { time: "03:00 PM", status: "break", patient: "Lunch Break" },
    { time: "04:00 PM", status: "upcoming", patient: "Rajesh Kumar" },
  ];

  return (
    <Screen>
      <Header 
        eyebrow="Schedule" 
        title="Your Daily Timeline" 
        subtitle="Tuesday, May 7, 2026" 
      />

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.dateStrip}>
          {['6', '7', '8', '9', '10'].map((d, i) => (
            <Pressable key={i} style={[styles.dateItem, d === '7' && { backgroundColor: colors.primary }]}>
              <Text style={[styles.dateDay, { color: d === '7' ? '#FFF' : colors.mutedForeground }]}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}
              </Text>
              <Text style={[styles.dateNum, { color: d === '7' ? '#FFF' : colors.foreground }]}>{d}</Text>
            </Pressable>
          ))}
        </View>

        <SectionTitle title="Timeline" />
        {slots.map((slot, idx) => (
          <View key={idx} style={styles.timelineRow}>
            <View style={styles.timeCol}>
              <Text style={[styles.timeText, { color: colors.mutedForeground }]}>{slot.time}</Text>
            </View>
            <View style={styles.lineCol}>
              <View style={[styles.dot, { backgroundColor: slot.status === 'current' ? colors.primary : colors.border }]} />
              {idx !== slots.length - 1 && <View style={[styles.line, { backgroundColor: colors.border }]} />}
            </View>
            <Pressable style={({ pressed }) => [
              styles.slotCard,
              { 
                backgroundColor: slot.status === 'current' ? colors.primary : colors.card,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}>
              <Text style={[styles.slotPatient, { color: slot.status === 'current' ? '#FFF' : colors.foreground }]}>
                {slot.patient}
              </Text>
              <Text style={[styles.slotStatus, { color: slot.status === 'current' ? 'rgba(255,255,255,0.8)' : colors.mutedForeground }]}>
                {slot.status === 'break' ? 'Personal Time' : 'Routine Checkup'}
              </Text>
              {slot.status === 'current' && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>In Progress</Text>
                </View>
              )}
            </Pressable>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  dateItem: {
    width: 60,
    height: 74,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  dateNum: {
    fontSize: 18,
    fontWeight: '700',
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timeCol: {
    width: 70,
    paddingTop: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  lineCol: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -4,
  },
  slotCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginLeft: 4,
  },
  slotPatient: {
    fontSize: 16,
    fontWeight: '700',
  },
  slotStatus: {
    fontSize: 13,
    marginTop: 2,
  },
  activeBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  }
});
