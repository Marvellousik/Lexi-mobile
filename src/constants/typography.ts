// RULE: Every text element must have explicit lineHeight = fontSize * 1.4 minimum
// RULE: Large bold text (20pt+) gets letterSpacing: -0.3 to -0.5 (tighter = more premium)
// RULE: Body text gets letterSpacing: 0 to 0.1
// RULE: Uppercase labels get letterSpacing: 0.8 (more breathing room)
// RULE: No raw fontSize in component files — always use these presets

export const text = {
  // Display
  display: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.8, lineHeight: 38 },

  // Headings
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.2, lineHeight: 24 },
  h4: { fontSize: 16, fontWeight: '600' as const, letterSpacing: -0.1, lineHeight: 22 },

  // Body
  bodyLg: { fontSize: 16, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 24 },
  body:   { fontSize: 14, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 22 },
  bodySm: { fontSize: 13, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 20 },

  // UI
  label:   { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.1, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '400' as const, letterSpacing: 0.1, lineHeight: 16 },
  overline: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.8, lineHeight: 16 },  // uppercase labels

  // Interactive
  button:    { fontSize: 16, fontWeight: '600' as const, letterSpacing: 0, lineHeight: 20 },
  buttonSm:  { fontSize: 14, fontWeight: '600' as const, letterSpacing: 0, lineHeight: 18 },
  tabLabel:  { fontSize: 10, fontWeight: '500' as const, letterSpacing: 0.2, lineHeight: 12 },
} as const;
