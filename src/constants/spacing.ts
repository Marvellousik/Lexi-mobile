export const sp = {
  px: 1,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '10': 40,
  '12': 48,
  '14': 56,
  '16': 64,
} as const;

// Screen horizontal padding: ALWAYS sp['6'] = 24pt on both sides
// Section vertical gap: ALWAYS sp['8'] = 32pt between major sections
// Element internal padding: ALWAYS sp['4'] = 16pt minimum
// Sibling element gap: ALWAYS sp['3'] = 12pt between related items
// Label-to-input gap: ALWAYS sp['1.5'] = 6pt
// Icon-to-text gap: ALWAYS sp['2'] = 8pt
