import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { Button, C, Card, ScreenTitle, Stat, Tag } from "@/components/godmode-ui";
import { advanceGenesisTask, generateGenesisPlan, getGenesisProgress, type GenesisPlan, type GenesisTask } from "@/lib/genesis";

const STORAGE_KEY = "godmode.genesis.latest.v1";
const statusLabel = (status: GenesisTask["status"]) => status === "done" ? "مكتملة" : status === "in_progress" ? "قيد التنفيذ" : "بانتظار التنفيذ";
const statusTone = (status: GenesisTask["status"]) => status === "done" ? "green" as const : status === "in_progress" ? "amber" as const : "blue" as const;

export default function GenesisScreen() {
  const [brief, setBrief] = useState("");
  const [plan, setPlan] = useState<GenesisPlan | null>(null);
  const [ready, setReady] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(1);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        try { setPlan(JSON.parse(value) as GenesisPlan); } catch { setPlan(null); }
      }
    }).catch(() => undefined).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready && plan) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan)).catch(() => undefined);
  }, [plan, ready]);

  const progress = useMemo(() => getGenesisProgress(plan?.tasks ?? []), [plan]);
  const doneCount = plan?.tasks.filter((task) => task.status === "done").length ?? 0;

  const createPlan = () => {
    try {
      const next = generateGenesisPlan(brief);
      setPlan(next);
      setExpandedPhase(1);
    } catch (error) {
      Alert.alert("الفكرة تحتاج تفاصيل أكثر", error instanceof Error ? error.message : "تعذر إنشاء الخطة.");
    }
  };

  const updateTask = (taskId: string) => {
    setPlan((current) => current ? { ...current, tasks: advanceGenesisTask(current.tasks, taskId) } : current);
  };

  return (
    <ScreenContainer safeAreaClassName="bg-background">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 42 }} keyboardShouldPersistTaps="handled">
        <ScreenTitle eyebrow="Autonomous project architecture" title="GENESIS" subtitle="حوّل فكرتك إلى خطة هندسية من ست مراحل، مع وكلاء متخصصين ومهام ومخرجات قابلة للتحقق." />

        <Card title="Idea intake" icon="bulb-outline">
          <Text style={{ color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 12 }}>اكتب ما تريد بناءه، والمشكلة التي يحلها، وأي شروط مهمة. كلما كانت الفكرة أوضح كانت الخطة أدق.</Text>
          <TextInput value={brief} onChangeText={setBrief} multiline placeholder="مثال: أريد بناء منصة تعليمية على أندرويد تستخدم الذكاء الاصطناعي لإنشاء مسارات تعلم واختبارات..." placeholderTextColor={C.muted} textAlignVertical="top" style={{ minHeight: 118, color: C.text, backgroundColor: C.panel2, borderColor: C.border, borderWidth: 1, borderRadius: 13, padding: 13, fontSize: 14, lineHeight: 21 }} />
          <View style={{ height: 12 }} />
          <Button label="توليد مخطط المشروع" icon="sparkles" onPress={createPlan} />
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 9 }}>المخطط الحالي يُنشأ محلياً بقواعد هندسية واضحة؛ لا يدّعي تشغيل نماذج أو وكلاء سحابيين.</Text>
        </Card>

        {plan ? <>
          <View style={{ flexDirection: "row", gap: 9, marginBottom: 14 }}>
            <Stat value={plan.tasks.length} label="مهام مخططة" color={C.blue} />
            <Stat value={plan.phases.length} label="مراحل" color={C.cyan} />
            <Stat value={`${progress}%`} label="التقدم" color={C.green} />
          </View>

          <Card title="Mission control" icon="planet-outline" right={<Tag label={plan.projectType.toUpperCase()} tone="green" />}>
            <Text style={{ color: C.text, fontSize: 18, fontWeight: "800", lineHeight: 25 }}>{plan.projectName}</Text>
            <Text style={{ color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 7 }}>{plan.brief}</Text>
            <View style={{ height: 14 }} />
            <View style={{ height: 8, borderRadius: 8, backgroundColor: C.panel2, overflow: "hidden" }}>
              <View style={{ height: 8, width: `${progress}%`, backgroundColor: C.green, borderRadius: 8 }} />
            </View>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 7 }}>{doneCount} / {plan.tasks.length} مهام مكتملة</Text>
          </Card>

          <Card title="Agent command" icon="git-network-outline">
            <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 }}>أدوار متخصصة لتقسيم العمل. في هذه المرحلة هي أدوار تخطيط وإسناد محلية، وليست نماذج مستقلة تعمل في الخلفية.</Text>
            {plan.agents.map((agent) => {
              const assigned = plan.tasks.filter((task) => task.agentId === agent.id).length;
              return <View key={agent.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, gap: 10 }}>
                <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: `${agent.color}20`, alignItems: "center", justifyContent: "center" }}><Ionicons name="hardware-chip-outline" size={18} color={agent.color} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: "800", fontSize: 12 }}>{agent.name}</Text>
                  <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{agent.specialty}</Text>
                </View>
                <Tag label={`${assigned} مهام`} />
              </View>;
            })}
          </Card>

          <Card title="System architecture" icon="layers-outline">
            {plan.architecture.map((item, index) => <View key={item} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 9 }}>
              <Tag label={String(index + 1)} />
              <Text style={{ color: C.text, flex: 1, fontSize: 13 }}>{item}</Text>
            </View>)}
          </Card>

          <Card title="Project modules" icon="apps-outline">
            <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginBottom: 10 }}>مكونات مستنتجة من متطلبات فكرتك، وليست قائمة ثابتة لكل المشاريع.</Text>
            {plan.modules.map((module) => <View key={module} style={{ flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 7, borderTopWidth: 1, borderTopColor: C.border }}>
              <Ionicons name="cube-outline" size={16} color={C.cyan} />
              <Text style={{ color: C.text, flex: 1, fontSize: 12 }}>{module}</Text>
            </View>)}
          </Card>

          <Card title="Engineering considerations" icon="construct-outline">
            {plan.technicalConsiderations.map((item) => <View key={item} style={{ flexDirection: "row", gap: 9, marginBottom: 9 }}>
              <Ionicons name="shield-checkmark-outline" size={17} color={C.amber} />
              <Text style={{ color: C.text, fontSize: 12, lineHeight: 19, flex: 1 }}>{item}</Text>
            </View>)}
          </Card>

          <Card title="Execution roadmap" icon="map-outline" right={<Tag label="6 PHASES" />}>
            {plan.phases.map((phase) => {
              const tasks = plan.tasks.filter((task) => task.phase === phase.id);
              const phaseDone = tasks.filter((task) => task.status === "done").length;
              const expanded = expandedPhase === phase.id;
              return <View key={phase.id} style={{ borderTopColor: C.border, borderTopWidth: 1, paddingTop: 12, paddingBottom: 7 }}>
                <Text onPress={() => setExpandedPhase(expanded ? 0 : phase.id)} style={{ color: C.text, fontSize: 14, fontWeight: "800" }}>{String(phase.id).padStart(2, "0")}  {phase.title}  ·  {phaseDone}/{tasks.length} <Text style={{ color: C.blue }}>{expanded ? "−" : "+"}</Text></Text>
                <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 5 }}>{phase.objective}</Text>
                {expanded ? tasks.map((task) => {
                  const agent = plan.agents.find((item) => item.id === task.agentId);
                  return <View key={task.id} style={{ backgroundColor: C.panel2, borderRadius: 12, padding: 11, marginTop: 9 }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: C.text, fontWeight: "700", fontSize: 13, lineHeight: 19 }}>{task.title}</Text>
                        <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{agent?.name} · {task.deliverable}</Text>
                      </View>
                      <Tag label={statusLabel(task.status)} tone={statusTone(task.status)} />
                    </View>
                    <Text style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 7 }}>{task.detail}</Text>
                    <View style={{ alignItems: "flex-end", marginTop: 9 }}>
                      <Text onPress={() => updateTask(task.id)} style={{ color: C.blue, fontWeight: "800", fontSize: 12 }}>تحديث الحالة ←</Text>
                    </View>
                  </View>;
                }) : null}
              </View>;
            })}
          </Card>

          <Card title="Risk register" icon="warning-outline">
            {plan.risks.map((risk, index) => <View key={risk} style={{ flexDirection: "row", gap: 9, marginBottom: 9 }}>
              <Ionicons name="alert-circle-outline" size={17} color={C.amber} />
              <Text style={{ color: C.text, fontSize: 12, lineHeight: 19, flex: 1 }}>{risk}</Text>
            </View>)}
          </Card>

          <Card title="Definition of done" icon="checkmark-done-outline">
            {plan.acceptanceCriteria.map((criterion) => <View key={criterion} style={{ flexDirection: "row", gap: 9, marginBottom: 9 }}>
              <Ionicons name="checkmark-circle-outline" size={17} color={C.green} />
              <Text style={{ color: C.text, fontSize: 12, lineHeight: 19, flex: 1 }}>{criterion}</Text>
            </View>)}
          </Card>

          <Card title="Next command" icon="flag-outline">
            <Text style={{ color: C.text, fontSize: 13, lineHeight: 21 }}>{plan.nextStep}</Text>
            <View style={{ height: 12 }} />
            <Button label="خطة جديدة" icon="refresh" variant="ghost" onPress={() => { setBrief(""); setPlan(null); }} />
          </Card>
        </> : <Card title="Awaiting mission" icon="radio-outline">
          <Text style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>لا توجد مهمة نشطة بعد. اكتب فكرة مشروعك لتوليد خارطة طريق، وتوزيع المهام على ستة تخصصات، وتحديد المخاطر ومعايير التسليم.</Text>
        </Card>}
      </ScrollView>
    </ScreenContainer>
  );
}
