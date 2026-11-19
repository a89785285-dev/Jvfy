import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { addHistory, evaluateResponse, type EvaluationResult } from "@/lib/godmode";
import { Button, C, Card, ScreenTitle, Tag } from "@/components/godmode-ui";

const labels: Record<string, string> = {
  instruction_integrity: "سلامة التعليمات",
  confidentiality: "سرية المعلومات",
  safety_compliance: "الالتزام بالسلامة",
  refusal_quality: "جودة الرفض",
  helpfulness: "الفائدة",
  accuracy: "الدقة",
  injection_resistance: "مقاومة حقن التعليمات",
};

export default function Evaluator() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    if (!prompt.trim() || !response.trim() || busy) {
      setError("أدخل نص الطلب والرد قبل بدء التقييم.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const output = evaluateResponse(prompt, response);
      setResult(output);
      await addHistory({
        kind: "evaluation",
        title: `Response evaluation — ${output.overallScore}/4`,
        summary: `${output.warnings.length} warning(s) · deterministic`,
        score: output.overallScore,
      });
    } catch {
      setError("تعذر حفظ نتيجة التقييم. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenTitle
          eyebrow="Module 02"
          title="Response Evaluator"
          subtitle="قيّم الرد مقابل الطلب من سبعة أبعاد. التقييم محلي وحتمي وقابل للتفسير، وليس حكماً نهائياً على جودة النموذج."
        />
        <Card title="Prompt under test" icon="chatbox-ellipses-outline">
          <TextInput
            value={prompt}
            onChangeText={(value) => { setPrompt(value); setResult(null); setError(""); }}
            multiline
            placeholder="الصق نص الطلب هنا"
            placeholderTextColor={C.muted}
            style={inputStyle(100)}
          />
        </Card>
        <Card title="AI response" icon="return-down-forward-outline">
          <TextInput
            value={response}
            onChangeText={(value) => { setResponse(value); setResult(null); setError(""); }}
            multiline
            placeholder="الصق رد النموذج هنا"
            placeholderTextColor={C.muted}
            style={inputStyle(140)}
          />
          <View style={{ marginTop: 12 }}>
            <Button label={busy ? "Evaluating..." : "Evaluate response"} icon="shield-checkmark-outline" onPress={run} />
          </View>
          {error ? <Text style={{ color: C.red, fontSize: 12, marginTop: 9 }}>{error}</Text> : null}
        </Card>
        {result ? (
          <>
            <Card title={`Overall score · ${result.overallScore}/4`} icon="analytics-outline">
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Text style={{ color: C.text, fontSize: 34, fontWeight: "900" }}>{result.overallScore.toFixed(2)}</Text>
                <View style={{ flex: 1 }}>
                  <Tag label={result.overallScore >= 3.5 ? "STRONG" : result.overallScore >= 2.5 ? "REVIEW" : "NEEDS ATTENTION"} tone={result.overallScore >= 3.5 ? "green" : result.overallScore >= 2.5 ? "amber" : "red"} />
                  <Text style={{ color: C.muted, fontSize: 11, marginTop: 5 }}>منهج التقييم: قواعد محلية حتمية</Text>
                </View>
              </View>
              {Object.entries(result.scores).map(([key, value]) => (
                <View key={key} style={{ borderTopColor: C.border, borderTopWidth: 1, paddingVertical: 10 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ color: C.text, fontWeight: "600", flex: 1 }}>{labels[key] ?? key}</Text>
                    <Text style={{ color: value < 2 ? C.red : value < 4 ? C.amber : C.green, fontSize: 17, fontWeight: "800" }}>{value}/4</Text>
                  </View>
                  <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{result.explanations[key]}</Text>
                </View>
              ))}
            </Card>
            <Card title={`Review notes · ${result.warnings.length}`} icon="alert-circle-outline">
              {result.warnings.length ? result.warnings.map((warning, index) => (
                <Text key={index} style={{ color: C.red, fontSize: 12, lineHeight: 19, marginBottom: 7 }}>• {warning}</Text>
              )) : <Tag label="NO RULE-BASED WARNINGS" tone="green" />}
              <Text style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 10 }}>
                الدرجات ناتجة عن قواعد محدودة وقد تخطئ في فهم السياق أو اللغة. استخدمها كإشارة للمراجعة، لا كضمان أمني.
              </Text>
            </Card>
          </>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const inputStyle = (minHeight: number) => ({
  minHeight,
  color: C.text,
  backgroundColor: C.bg,
  borderRadius: 11,
  padding: 13,
  textAlignVertical: "top" as const,
  borderColor: C.border,
  borderWidth: 1,
  lineHeight: 20,
});
