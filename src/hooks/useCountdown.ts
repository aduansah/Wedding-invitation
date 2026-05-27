"use client";

import { useEffect, useState } from "react";

export type CountdownValues = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

const EMPTY_COUNTDOWN: CountdownValues = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isComplete: false,
};

function calculateCountdown(target: Date): CountdownValues {
  const now = Date.now();
  const distance = target.getTime() - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
    isComplete: false,
  };
}

export function useCountdown(targetDate: Date): CountdownValues {
  const [countdown, setCountdown] = useState<CountdownValues>(EMPTY_COUNTDOWN);

  useEffect(() => {
    const update = () => setCountdown(calculateCountdown(targetDate));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return countdown;
}
