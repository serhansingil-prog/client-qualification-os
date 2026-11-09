"use client";

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "tr-TR";
  utterance.pitch = 0.9;
  const turkishVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.startsWith("tr"));
  if (turkishVoice) utterance.voice = turkishVoice;
  window.speechSynthesis.speak(utterance);
}
