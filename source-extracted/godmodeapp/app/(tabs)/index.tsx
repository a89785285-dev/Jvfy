import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { Button, C, Card, ScreenTitle, Stat, Tag } from "@/components/godmode-ui";
import { loadDataset, loadHistory, type DatasetCase, type HistoryItem } from "@/lib/godmode";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const router = useRouter(); const [history, setHistory] = useState<HistoryItem[]>([]); const [dataset, setDataset] = useState<DatasetCase[]>([]); const aiStatus = trpc.godmode.status.useQuery(undefined, { retry: false });
  useFocusEffect(useCallback(() => { loadHistory().then(setHistory); loadDataset().then(setDataset); }, []));
  return <ScreenContainer safeAreaClassName="bg-background"><ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 36 }}>
    <ScreenTitle eyebrow="Local security QA" title="GODMODE" subtitle="اختبر مقاومة التلاعب بالتعليمات محليًا، مع نتائج تفسيرية لا تنفذ النصوص ولا ترسلها خارجيًا." />
    <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}><Stat value={history.filter((x) => x.kind === "analysis").length} label="تحليلات prompts" color={C.blue} /><Stat value={history.filter((x) => x.kind === "evaluation").length} label="تقييمات responses" color={C.cyan} /><Stat value={dataset.length} label="حالات dataset" color={C.amber} /></View>
    <Card title="Quick actions" icon="flash-outline"><View style={{ gap: 10 }}><Button label="تحليل prompt جديد" icon="scan-outline" onPress={() => router.push("/(tabs)/analyzer")} /><Button label="تقييم response" icon="shield-checkmark-outline" variant="ghost" onPress={() => router.push("/(tabs)/evaluator")} /><Button label="فتح Prompt Studio" icon="sparkles-outline" variant="ghost" onPress={() => router.push("/(tabs)/prompt-studio")} /></View></Card>
    <Card title="System status" icon="pulse-outline"><View style={{ gap: 11 }}><View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: C.muted }}>Local rule engine</Text><Tag label="READY" tone="green" /></View><View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: C.muted }}>Server AI engine</Text><Tag label={aiStatus.isLoading ? "CHECKING" : aiStatus.data?.configured ? "CONFIGURED" : "API KEY REQUIRED"} tone={aiStatus.data?.configured ? "green" : "amber"} /></View><View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: C.muted }}>AI Studio data sharing</Text><Tag label="ON REQUEST" tone="amber" /></View></View></Card>
    <Card title="Recent activity" icon="time-outline" right={<Text style={{ color: C.muted, fontSize: 12 }}>{history.length} total</Text>}>{history.length === 0 ? <Text style={{ color: C.muted, lineHeight: 20 }}>لا يوجد نشاط بعد. ابدأ بتحليل prompt أو تقييم response.</Text> : history.slice(0, 4).map((item) => <View key={item.id} style={{ borderBottomColor: C.border, borderBottomWidth: 1, paddingVertical: 10 }}><View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: C.text, fontWeight: "700", flex: 1 }}>{item.title}</Text><Text style={{ color: item.kind === "analysis" ? C.blue : C.cyan, fontSize: 11 }}>{item.kind.toUpperCase()}</Text></View><Text style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{item.summary}</Text></View>)}</Card>
  </ScrollView></ScreenContainer>;
}
