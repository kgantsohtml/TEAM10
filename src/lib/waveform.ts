// Placeholder waveform: ~100 numbers for thin vertical bars (brief 6.5).

export function makePlaceholderWaveform(seed: number): number[] {
  const bars: number[] = [];
  let n = seed;

  for (let i = 0; i < 100; i++) {
    // Simple deterministic pseudo-random so each track looks different.
    n = (n * 1103515245 + 12345) % 2147483648;
    const value = 0.15 + (n % 1000) / 1000 * 0.85;
    bars.push(value);
  }

  return bars;
}
