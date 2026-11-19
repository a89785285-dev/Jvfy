import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { Button, C, Card, ScreenTitle, Tag, riskTone } from "@/components/godmode-ui";
import { addHistory, analyzePrompt, type AnalysisResult } from "@/lib/godmode";

export default function Analyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const output = analyzePrompt(text);
      setResult(output);
      await addHistory({ kind: "analysis", title: `Prompt analysis — ${output.classification}`, summary: `${output.riskScore}/100 risk · ${output.signals.length} signal(s)`, risk: output.riskScore });
    } catch {
      setError("تعذر حفظ نتيجة التحليل. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  return <ScreenContainer><ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
    <ScreenTitle eyebrow="Module 01" title="Prompt Analyzer" subtitle="حلّل النصوص العربية والإنجليزية بحثاً عن محاولات التلاعب بالتعليمات أو استخراج المعلومات المخفية. التحليل محلي وقائم على قواعد استدلالية، وليس حكماً على النوايا." />
    <Card title="Input prompt" icon="document-text-outline">
      <TextInput value={text} onChangeText={(value) => { setText(value); setResult(null); setError(""); }} multiline placeholder="اكتب أو الصق البرومبت هنا، بالعربية أو الإنجليزية..." placeholderTextColor={C.muted} style={{ minHeight: 150, color: C.text, backgroundColor: C.bg, borderRadius: 12, padding: 14, textAlignVertical: "top", borderColor: C.border, borderWidth: 1, lineHeight: 21 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
        <Text style={{ color: C.muted, fontSize: 11 }}>{text.length.toLocaleString()} characters</Text>
        <Text style={{ color: C.muted, fontSize: 11 }}>Arabic + English</Text>
      </View>
      <View style={{ marginTop: 12 }}><Button label={busy ? "Analyzing..." : "Run analysis"} icon="scan-outline" onPress={run} /></View>
      {error ? <Text style={{ color: C.red, fontSize: 12, marginTop: 9 }}>{error}</Text> : null}
    </Card>
    {result ? <>
      <Card title="Risk assessment" icon="shield-outline">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ width: 86, height: 86, borderRadius: 43, borderWidth: 7, borderColor: result.riskScore >= 55 ? C.red : result.riskScore >= 25 ? C.amber : C.green, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: C.text, fontSize: 22, fontWeight: "800" }}>{Math.round(result.riskScore)}</Text><Text style={{ color: C.muted, fontSize: 10 }}>/ 100</Text>
          </View>
          <View style={{ flex: 1 }}><Tag label={result.classification.toUpperCase()} tone={riskTone(result.classification) as "green" | "amber" | "red"} /><Text style={{ color: C.muted, lineHeight: 19, marginTop: 10 }}>{result.explanation}</Text></View>
        </View>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
          {Object.entries(result.layerScores).map(([layer, score]) => <View key={layer} style={{ flex: 1, backgroundColor: C.bg, borderRadius: 10, padding: 10 }}><Text style={{ color: C.muted, fontSize: 10 }}>{layer}</Text><Text style={{ color: C.text, fontSize: 18, fontWeight: "800", marginTop: 3 }}>{Math.round(score)}</Text></View>)}
        </View>
      </Card>
      <Card title={`Signals (${result.signals.length})`} icon="list-outline">
        {result.signals.length === 0 ? <Text style={{ color: C.green }}>لم يتم العثور على إشارات قوية.</Text> : result.signals.map((signal) => <View key={signal.ruleId} style={{ borderBottomColor: C.border, borderBottomWidth: 1, paddingVertical: 11 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: C.text, fontWeight: "700", flex: 1 }}>{signal.category.replaceAll("_", " ")}</Text><Tag label={signal.severity} tone={signal.severity === "low" ? "green" : signal.severity === "medium" ? "amber" : "red"} /></View>
          <Text style={{ color: C.blue, fontSize: 11, marginTop: 5 }}>{signal.ruleId} · {Math.round(signal.confidence * 100)}% confidence · {signal.layer}</Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>Evidence: {signal.evidence}</Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>{signal.explanation}</Text>
        </View>)}
      </Card>
      <Text style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginHorizontal: 3 }}>ملاحظة: قد تظهر نتائج إيجابية كاذبة؛ راجع النص والسياق قبل اتخاذ أي قرار.</Text>
    </> : null}
  </ScrollView></ScreenContainer>;
}
