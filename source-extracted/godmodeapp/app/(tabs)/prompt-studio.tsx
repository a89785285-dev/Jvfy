import { useState } from "react";
import { ActivityIndicator, ScrollView, Share, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { Button, C, Card, ScreenTitle, Tag } from "@/components/godmode-ui";
import { trpc } from "@/lib/trpc";
import { addHistory } from "@/lib/godmode";

type Mode = "generate" | "analyze" | "evaluate" | "optimize";
const modes: Array<{ id: Mode; label: string; hint: string }> = [
  { id: "generate", label: "Generate", hint: "حوّل وصف المهمة إلى برومبت احترافي قابل لإعادة الاستخدام." },
  { id: "analyze", label: "Analyze", hint: "حلّل الوضوح والتعارضات ومؤشرات التلاعب والمخاطر." },
  { id: "evaluate", label: "Evaluate", hint: "قيّم استجابة مقابل البرومبت وفق معايير واضحة." },
  { id: "optimize", label: "Optimize", hint: "حسّن صياغة البرومبت مع الحفاظ على هدفه الأصلي." },
];
const titles: Record<Mode, string> = { generate: "Prompt Generator", analyze: "AI Prompt Analysis", evaluate: "AI Response Evaluation", optimize: "Auto Optimizer" };
const placeholders: Record<Mode, string> = {
  generate: "اكتب وصف المهمة والنتيجة التي تريدها...",
  analyze: "الصق البرومبت الذي تريد تحليله...",
  evaluate: "الصق البرومبت الأصلي هنا...",
  optimize: "الصق البرومبت الذي تريد تحسينه...",
};
export default function PromptStudio() {
  const [mode, setMode] = useState<Mode>("generate");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const runMutation = trpc.godmode.run.useMutation();
  async function run() {
    if (!prompt.trim() || (mode === "evaluate" && !response.trim())) return;
    setError(""); setOutput("");
    try {
      const result = await runMutation.mutateAsync({ mode, prompt: prompt.trim(), ...(mode === "evaluate" ? { response: response.trim() } : {}) });
      setOutput(result.output);
      await addHistory({ kind: mode === "evaluate" ? "evaluation" : "analysis", title: titles[mode], summary: `AI · ${result.model}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    }
  }
  async function shareOutput() { if (output) await Share.share({ title: titles[mode], message: output }); }
  return <ScreenContainer><ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 42 }}>
    <ScreenTitle eyebrow="AI WORKSPACE" title="Prompt Studio" subtitle="أربع أدوات مترابطة لإنشاء البرومبتات وتحليلها وتقييم الاستجابات وتحسين الصياغة عبر محرك AI على الخادم." />
    <Card title="Choose a tool" icon="sparkles-outline">
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {modes.map((item) => <View key={item.id} style={{ width: "48%" }}><Button label={item.label} variant={mode === item.id ? "primary" : "ghost"} onPress={() => { setMode(item.id); setOutput(""); setError(""); }} /></View>)}
      </View>
      <Text style={{ color: C.muted, lineHeight: 19, marginTop: 12 }}>{modes.find((item) => item.id === mode)?.hint}</Text>
    </Card>
    <Card title={mode === "evaluate" ? "Original prompt" : "Input"} icon="document-text-outline">
      <TextInput value={prompt} onChangeText={setPrompt} multiline placeholder={placeholders[mode]} placeholderTextColor={C.muted} style={{ minHeight: 132, color: C.text, backgroundColor: C.bg, borderRadius: 12, padding: 14, textAlignVertical: "top", borderColor: C.border, borderWidth: 1, lineHeight: 21 }} />
    </Card>
    {mode === "evaluate" ? <Card title="AI response to evaluate" icon="chatbox-ellipses-outline"><TextInput value={response} onChangeText={setResponse} multiline placeholder="الصق الاستجابة المراد تقييمها..." placeholderTextColor={C.muted} style={{ minHeight: 132, color: C.text, backgroundColor: C.bg, borderRadius: 12, padding: 14, textAlignVertical: "top", borderColor: C.border, borderWidth: 1, lineHeight: 21 }} /></Card> : null}
    <Button label={runMutation.isPending ? "Processing..." : titles[mode]} icon="flash-outline" onPress={run} />
    {runMutation.isPending ? <View style={{ padding: 22, alignItems: "center" }}><ActivityIndicator color={C.blue} /><Text style={{ color: C.muted, marginTop: 9 }}>يتواصل التطبيق مع محرك الذكاء الاصطناعي...</Text></View> : null}
    {error ? <Card title="Request failed" icon="alert-circle-outline"><Text style={{ color: C.red, lineHeight: 20 }}>{error}</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>تأكد من إعداد مفتاح API وعنوان الخدمة في بيئة الخادم.</Text></Card> : null}
    {output ? <Card title="AI result" icon="checkmark-circle-outline" right={<Tag label="AI OUTPUT" tone="green" />}><Text selectable style={{ color: C.text, fontSize: 14, lineHeight: 23 }}>{output}</Text><View style={{ marginTop: 14 }}><Button label="Share result" variant="ghost" icon="share-outline" onPress={shareOutput} /></View></Card> : null}
    <Text style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 4 }}>تنبيه: النصوص المدخلة تُرسل إلى مزود AI المضبوط على الخادم لتنفيذ الأداة المختارة. لا تُنفّذ الأداة البرومبتات المدخلة، ولا تضع مفاتيح API داخل التطبيق.</Text>
  </ScrollView></ScreenContainer>;
}
