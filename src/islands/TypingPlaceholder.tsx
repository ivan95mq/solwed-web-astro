import { useState, useEffect, useRef } from 'react';

const WORDS = ['miempresa', 'tuweb', 'tutienda', 'miweb'];
const TYPE_SPEED = 70;
const DELETE_SPEED = 40;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 500;

interface TypingPlaceholderProps {
  visible: boolean;
}

export function TypingPlaceholder({ visible }: TypingPlaceholderProps) {
  const [text, setText] = useState('');
  const wordIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!visible) return;

    const tick = () => {
      const currentWord = WORDS[wordIndex.current];

      if (!isDeleting.current) {
        charIndex.current++;
        setText(currentWord.slice(0, charIndex.current));

        if (charIndex.current === currentWord.length) {
          isDeleting.current = true;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_TYPE);
        } else {
          timeoutRef.current = setTimeout(tick, TYPE_SPEED);
        }
      } else {
        charIndex.current--;
        setText(currentWord.slice(0, charIndex.current));

        if (charIndex.current === 0) {
          isDeleting.current = false;
          wordIndex.current = (wordIndex.current + 1) % WORDS.length;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETE);
        } else {
          timeoutRef.current = setTimeout(tick, DELETE_SPEED);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETE);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none select-none">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default TypingPlaceholder;
