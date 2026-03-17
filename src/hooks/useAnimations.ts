import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// ========== INTERSECTION OBSERVER ==========
export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(el);
      }
    }, { threshold: 0.12, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// ========== ANIMATED COUNTER ==========
export function useCounter(end: number, duration = 2000, start = 0, active = true) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!active) { setCount(start); return; }
    let startTime: number;
    let frame: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(start + (end - start) * eased));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, start, active]);

  return count;
}

// ========== TYPING EFFECT ==========
export function useTypingEffect(texts: string[], speed = 70, delSpeed = 35, pause = 2500) {
  const [display, setDisplay] = useState('');
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cur = texts[ti];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && ci < cur.length) {
      timeout = setTimeout(() => { setDisplay(cur.substring(0, ci + 1)); setCi(ci + 1); }, speed);
    } else if (!deleting && ci === cur.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && ci > 0) {
      timeout = setTimeout(() => { setDisplay(cur.substring(0, ci - 1)); setCi(ci - 1); }, delSpeed);
    } else if (deleting && ci === 0) {
      setDeleting(false);
      setTi((ti + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [ci, deleting, ti, texts, speed, delSpeed, pause]);

  return display;
}

// ========== ACTIVE SECTION ==========
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { threshold: 0.25 });
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

// ========== MOUSE PARALLAX ==========
export function useMouseParallax(intensity = 0.02) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      setPos({
        x: (e.clientX - window.innerWidth / 2) * intensity,
        y: (e.clientY - window.innerHeight / 2) * intensity,
      });
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [intensity]);

  return pos;
}

// ========== SCROLL PROGRESS ==========
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const h = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return progress;
}

// ========== CURSOR GLOW ==========
export function useCursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
    };
  }, []);

  return { pos, visible };
}

// ========== CARD TILT ==========
export function useCardTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`;
  }, [maxTilt]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
  }, []);

  return { ref, handleMove, handleLeave };
}

// ========== STAGGER CHILDREN ==========
export function useStaggerReveal(count: number) {
  const { ref, isInView } = useInView();
  return { ref, isInView, getDelay: (i: number) => `${i * 80}ms` };
}

// ========== MAGNETIC BUTTON ==========
export function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, [strength]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0, 0)';
  }, []);

  return { ref, handleMove, handleLeave };
}

// ========== TEXT SPLIT ANIMATION ==========
export function useSplitText(text: string) {
  return useMemo(() => text.split('').map((char, i) => ({
    char: char === ' ' ? '\u00A0' : char,
    delay: i * 30,
  })), [text]);
}

// ========== SMOOTH VALUE ==========
export function useSmoothValue(target: number, speed = 0.08) {
  const [value, setValue] = useState(target);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setValue(prev => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.01) return target;
        return prev + diff * speed;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, speed]);

  return value;
}
