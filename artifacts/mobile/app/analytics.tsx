import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Screen, Card, Header, SectionTitle } from "@/components/ClinicUI";
import { useColors } from "@/hooks/useColors";
import { useClinic } from "@/lib/ClinicContext";

export default function AnalyticsScreen() {
  const colors = useColors();
  const { appointments, calls } = useClinic();

  const stats = [
    { label: "Total Patients", value: "1,284", icon: "users", trend: "+12%" },
    { label: "Consultations", value: appointments.length.toString(), icon: "activity", trend: "+5%" },
    { label: "Wait Time", value: "14m", icon: "clock", trend: "-2m" },
    { label: "Satisfaction", value: "4.8", icon: "star", trend: "+0.1" },
  ];

  return (
    <Screen>
      <Header 
        eyebrow="Insights" 
        title="Practice Analytics" 
        subtitle="Real-time performance overview" 
      />

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <Card key={idx} style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                <Feather name={stat.icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
              <View style={styles.trendContainer}>
                <Text style={[styles.trendText, { color: stat.trend.startsWith('+') ? '#10B981' : '#EF4444' }]}>
                  {stat.trend}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <SectionTitle title="Weekly Patient Load" />
        <Card style={styles.chartPlaceholder}>
          <View style={{ height: 180, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: colors.accent, height: `${h}%`, borderRadius: 6 }} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Text key={i} style={{ fontSize: 12, color: colors.mutedForeground, width: '12%', textAlign: 'center' }}>{d}</Text>
            ))}
          </View>
        </Card>

        <SectionTitle title="Patient Demographics" />
        <Card>
          <DemographicRow label="In-person" percentage={75} color={colors.primary} />
          <DemographicRow label="Telehealth" percentage={25} color={colors.accent} />
        </Card>
      </View>
    </Screen>
  );
}

function DemographicRow({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  const colors = useColors();
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 14, color: colors.foreground, fontWeight: '500' }}>{label}</Text>
        <Text style={{ fontSize: 14, color: colors.mutedForeground }}>{percentage}%</Text>
      </View>
      <View style={{ height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: color }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    width: '48%',
    padding: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  trendContainer: {
    marginTop: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartPlaceholder: {
    padding: 20,
    marginTop: 8,
  }
});
