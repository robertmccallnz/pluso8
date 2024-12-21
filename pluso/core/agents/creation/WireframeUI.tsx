import { useState, useEffect } from "preact/hooks";
import { WireframeQuestion, WireframeSession } from "../../core/agents/services/wireframe/types.ts";
import { Button } from "../../components/Button.tsx";
import { Card } from "../../components/Card.tsx";
import { Input } from "../../components/Input.tsx";
import { Select } from "../../components/Select.tsx";
import { Progress } from "../../components/Progress.tsx";

interface Props {
  session?: WireframeSession;
}

export default function WireframeUI({ session }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState<WireframeQuestion | null>(null);
  const [answers, setAnswers] = useState<Map<string, any>>(new Map());
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    if (session) {
      fetchNextQuestion();
    }
  }, [session]);

  const fetchNextQuestion = async () => {
    try {
      const response = await fetch(`/api/wireframe/question?sessionId=${session?.id}`);
      const question = await response.json();
      setCurrentQuestion(question);
      updateProgress();
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const updateProgress = () => {
    const totalQuestions = 5; // Update based on actual number
    setProgress((answers.size / totalQuestions) * 100);
  };

  const handleAnswer = async (value: any) => {
    if (!currentQuestion || !session) return;

    try {
      const response = await fetch("/api/wireframe/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          questionId: currentQuestion.id,
          value
        })
      });

      if (response.ok) {
        const newAnswers = new Map(answers);
        newAnswers.set(currentQuestion.id, value);
        setAnswers(newAnswers);
        
        if (progress < 100) {
          fetchNextQuestion();
        } else {
          generatePreview();
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const generatePreview = async () => {
    try {
      const response = await fetch(`/api/wireframe/preview?sessionId=${session?.id}`);
      const preview = await response.json();
      setPreview(preview);
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "multiple_choice":
        return (
          <Select
            options={currentQuestion.options?.map(opt => ({
              label: opt,
              value: opt
            })) || []}
            onChange={(value) => handleAnswer(value)}
            placeholder="Select an option"
          />
        );

      case "text":
        return (
          <Input
            type="text"
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
        );

      case "number":
        return (
          <Input
            type="number"
            onChange={(e) => handleAnswer(Number(e.target.value))}
            placeholder="Enter a number"
          />
        );

      case "boolean":
        return (
          <div class="flex gap-4">
            <Button
              onClick={() => handleAnswer(true)}
              variant="outline"
            >
              Yes
            </Button>
            <Button
              onClick={() => handleAnswer(false)}
              variant="outline"
            >
              No
            </Button>
          </div>
        );

      case "scale":
        return (
          <div class="flex gap-2">
            {[1, 2, 3, 4, 5].map(value => (
              <Button
                key={value}
                onClick={() => handleAnswer(value)}
                variant="outline"
                class="w-10 h-10"
              >
                {value}
              </Button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderPreview = () => {
    if (!preview) return null;

    return (
      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Agent Preview</h3>
        <div class="grid grid-cols-2 gap-4">
          <Card>
            <h4 class="font-medium">Capabilities</h4>
            <ul class="list-disc list-inside">
              {preview.capabilities.map((cap: string) => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h4 class="font-medium">ML Models</h4>
            <ul class="list-disc list-inside">
              {preview.mlModels.map((model: any) => (
                <li key={model.name}>{model.name}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h4 class="font-medium">Integrations</h4>
            <ul class="list-disc list-inside">
              {preview.integrations.map((int: string) => (
                <li key={int}>{int}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h4 class="font-medium">Security</h4>
            <p>Level: {preview.securityLevel}</p>
          </Card>
        </div>
        <Button
          onClick={() => window.location.href = `/agents/${preview.id}`}
          class="mt-4"
        >
          Create Agent
        </Button>
      </div>
    );
  };

  return (
    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <Progress value={progress} />
      
      {currentQuestion && (
        <Card class="p-6">
          <h2 class="text-2xl font-semibold mb-4">
            {currentQuestion.text}
          </h2>
          {renderQuestion()}
        </Card>
      )}

      {progress === 100 && renderPreview()}
    </div>
  );
}
