import React, { useState, useRef, useEffect } from "react";
import { saveSessionToDB } from "../services/sessionService";
import "../styles/Editor.css";

const Editor = () => {
  const [text, setText] = useState("");

  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    typedChars: 0,
    pastedChars: 0,
    pasteRatio: 0,
  });

  const [keystrokes, setKeystrokes] = useState<any[]>([]);
  const [pastes, setPastes] = useState<any[]>([]);

  const [lastDown, setLastDown] = useState<number | null>(null);
  const [lastUp, setLastUp] = useState<number | null>(null);

  const [showPasteMsg, setShowPasteMsg] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const startTime = useRef(Date.now());
  const pasteCounter = useRef(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const countWords = (value: string) => {
    return value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  };

  const handleTyping = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    const diff = value.length - text.length;

    setText(value);

    setStats((prev) => ({
      ...prev,
      chars: value.length,
      words: countWords(value),
      typedChars: diff > 0 ? prev.typedChars + diff : prev.typedChars,
    }));
  };

  const onKeyDown = () => {
    setLastDown(Date.now());
  };

  const onKeyUp = () => {
    const now = Date.now();

    if (lastDown) {
      const hold = now - lastDown;
      const gap = lastUp ? lastDown - lastUp : 0;

      const event = {
        pressTime: lastDown - startTime.current,
        releaseTime: now - startTime.current,
        holdDuration: hold,
        gapBetweenKeys: gap,
      };

      setKeystrokes((prev) => [...prev, event]);
      setLastUp(now);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    const time = Date.now() - startTime.current;

    const pasteData = {
      time,
      length: pasted.length,
      id: pasteCounter.current,
    };

    pasteCounter.current += 1;

    const newPastedTotal = stats.pastedChars + pasted.length;
    const total = stats.typedChars + newPastedTotal;

    setPastes((prev) => [...prev, pasteData]);

    setStats((prev) => ({
      ...prev,
      pastedChars: newPastedTotal,
      pasteRatio: total > 0 ? newPastedTotal / total : 0,
    }));

    setShowPasteMsg(true);
    setTimeout(() => setShowPasteMsg(false), 2000);
  };

  // SAVE SESSION 
  const handleSaveSession = async () => {
    const sessionData = {
      content: text,
      wordCount: stats.words,
      charCount: stats.chars,
      totalTypedChars: stats.typedChars,
      totalPastedChars: stats.pastedChars,
      pasteRatio: stats.pasteRatio,
      pasteEvents: pastes,
      keystrokeEvents: keystrokes,
      sessionDuration: Date.now() - startTime.current,
    };

    try {
      await saveSessionToDB(sessionData);
      setStatusMsg("✔ Session saved successfully");
    } catch (err) {
      setStatusMsg("✖ Failed to save session");
    }

    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <div className="editor-container">
      {showPasteMsg && (
        <div className="paste-alert">Paste detected</div>
      )}

      <div className="editor-header">
        <h1>Vi-Notes</h1>
      </div>

      <div className="editor-main">
        <textarea
          ref={inputRef}
          value={text}
          onInput={handleTyping}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          placeholder="Start typing..."
          className="editor-textarea"
        />
      </div>

      <div className="editor-footer">
        <span>Words: {stats.words}</span>
        <span>Characters: {stats.chars}</span>
        <span>Typed: {stats.typedChars}</span>
        <span>Pasted: {stats.pastedChars}</span>
        <span>
          Paste Ratio: {(stats.pasteRatio * 100).toFixed(1)}%
        </span>
      </div>
       {statusMsg && <div className="status-msg">{statusMsg}</div>}

      <button onClick={handleSaveSession} className="save-btn">
        Save Session
      </button>
    </div>
  );
};

export default Editor;