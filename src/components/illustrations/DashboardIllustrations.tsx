/**
 * DashboardIllustrations.tsx
 * LexiAssist – Named SVG illustration components extracted from Figma export.
 * These are pure presentational components. Do not add logic here.
 */

import React from "react";
import Svg, { Path, G, Mask, Defs, LinearGradient, Stop } from "react-native-svg";

// ─────────────────────────────────────────────
// TextToSpeechIllustration
// Used in: Tool card 1 – "Text to speech Learning Hub"
// Accent: #407BFF (blue)
// ─────────────────────────────────────────────
export function TextToSpeechIllustration() {
  return (
    <Svg width={120} height={89} viewBox="0 0 120 89" fill="none">
      {/* Background simple – blue wash */}
      <G>
        <Path
          d="M23.21 0.97 C23.21 0.97 104.69 0.97 104.69 77.37 C104.69 77.37 23.21 77.37 23.21 0.97Z"
          fill="#407BFF"
          opacity={0.1}
        />
      </G>
      {/* Letter envelope body */}
      <G>
        <Path
          d="M52 24 L96 24 L96 87 L52 87 Z"
          fill="#407BFF"
          opacity={0.2}
        />
        <Path
          d="M52 24 L96 24 L96 87 L52 87 Z"
          fill="#407BFF"
          opacity={0.7}
        />
        {/* Envelope flap lines */}
        <Path d="M55 30 L93 30" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 36 L80 36" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 42 L85 42" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 48 L75 48" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 54 L88 54" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 60 L70 60" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 66 L82 66" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 72 L90 72" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 78 L76 78" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M55 84 L88 84" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" />
        {/* Open envelope top */}
        <Path
          d="M52 24 L74 42 L96 24"
          stroke="#263238"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stamp accent */}
        <Path d="M80 26 L94 26 L94 38 L80 38 Z" fill="#407BFF" />
        <Path d="M80 26 L94 26 L94 38 L80 38 Z" fill="#000" opacity={0.2} />
        <Path d="M83 30 L91 38" fill="#407BFF" />
      </G>
      {/* Mail post */}
      <G>
        <Path d="M20.77 41 L20.77 87" stroke="#263238" strokeWidth={1.5} strokeLinecap="round" />
        <Path
          d="M14 50 Q14 44 20.77 44 Q27.54 44 27.54 50 L27.54 60 Q27.54 66 20.77 66 Q14 66 14 60 Z"
          fill="#407BFF"
        />
        <Path
          d="M14 50 Q14 44 20.77 44 Q27.54 44 27.54 50 L27.54 60 Q27.54 66 20.77 66 Q14 66 14 60 Z"
          fill="#000"
          opacity={0.4}
        />
        <Path d="M17 54 L24.54 54" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
        <Path d="M20.77 52 L20.77 58" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
      </G>
      {/* Character – postal worker */}
      <G>
        {/* Body/shirt */}
        <Path d="M38 58 Q37 62 37 87 L56 87 Q56 62 55 58 Z" fill="#407BFF" />
        <Path d="M38 58 Q37 62 37 87 L56 87 Q56 62 55 58 Z" fill="#fff" opacity={0.4} />
        {/* Legs */}
        <Path d="M40 80 L40 87 L45 87 L45 80 Z" fill="#263238" />
        <Path d="M48 80 L48 87 L53 87 L53 80 Z" fill="#263238" />
        {/* Head */}
        <Path
          d="M43 40 Q43 34 46.5 34 Q50 34 50 40 Q50 46 46.5 46 Q43 46 43 40 Z"
          fill="#E4897B"
        />
        {/* Hair */}
        <Path d="M43 38 Q43 34 46.5 34 Q50 34 50 38 Z" fill="#263238" />
        {/* Face features */}
        <Path d="M45 41 Q46.5 43 48 41" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M44.5 39.5 L45.5 39.5" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M47.5 39.5 L48.5 39.5" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        {/* Arms */}
        <Path d="M38 60 Q34 64 36 70 L40 68 Q39 63 42 60 Z" fill="#407BFF" />
        <Path d="M38 60 Q34 64 36 70 L40 68 Q39 63 42 60 Z" fill="#fff" opacity={0.4} />
        <Path d="M55 60 Q59 64 57 70 L53 68 Q54 63 51 60 Z" fill="#407BFF" />
        {/* Hands */}
        <Path d="M35 69 Q33 72 35 74 Q37 74 38 72 Z" fill="#E4897B" />
        <Path d="M58 69 Q60 72 58 74 Q56 74 55 72 Z" fill="#EEC1BB" />
        {/* Collar/hat */}
        <Path d="M44 46 L49 46 L49 52 L44 52 Z" fill="#407BFF" opacity={0.7} />
        <Path d="M42 34 L51 34 L52 37 L41 37 Z" fill="#263238" />
        <Path d="M40 37 L53 37 L53 38.5 L40 38.5 Z" fill="#263238" />
      </G>
    </Svg>
  );
}

// ─────────────────────────────────────────────
// ReadingAssistantIllustration
// Used in: Tool card 2 – "Reading Assistant"
// Accent: #89CFF0 (sky blue)
// ─────────────────────────────────────────────
export function ReadingAssistantIllustration() {
  return (
    <Svg width={120} height={103} viewBox="0 0 120 103" fill="none">
      {/* Background simple – dark wash */}
      <Path
        d="M18.97 4.59 C18.97 4.59 110.01 4.59 110.01 63.8 C110.01 63.8 18.97 63.8 18.97 4.59 Z"
        fill="#000"
        opacity={0.03}
      />
      {/* Floor shadow */}
      <Path
        d="M7.51 98.5 Q60 103 112.49 98.5 Q60 94 7.51 98.5 Z"
        fill="#EBEBEB"
      />
      {/* Bookshelf */}
      <G>
        {/* Shelf board */}
        <Path d="M34.71 88 L118 88 L118 90 L34.71 90 Z" fill="#263238" />
        {/* Book 1 – dark */}
        <Path d="M38 60 L48 60 L48 88 L38 88 Z" fill="#37474F" />
        <Path d="M38 60 L40 60 L40 88 L38 88 Z" fill="#455A64" />
        {/* Book 2 – sky blue */}
        <Path d="M50 55 L62 55 L62 88 L50 88 Z" fill="#89CFF0" />
        <Path d="M50 55 L52 55 L52 88 L50 88 Z" fill="#000" opacity={0.2} />
        <Path d="M54 65 L59 65" stroke="#fff" strokeWidth={1} strokeLinecap="round" />
        <Path d="M54 70 L60 70" stroke="#fff" strokeWidth={1} strokeLinecap="round" />
        {/* Book 3 – dark tall */}
        <Path d="M64 50 L72 50 L72 88 L64 88 Z" fill="#455A64" />
        <Path d="M64 50 L66 50 L66 88 L64 88 Z" fill="#37474F" />
        {/* Book 4 – white */}
        <Path d="M74 62 L82 62 L82 88 L74 88 Z" fill="#EBEBEB" />
        <Path d="M74 62 L76 62 L76 88 L74 88 Z" fill="#DBDBDB" />
        {/* Book 5 – sky blue small */}
        <Path d="M84 66 L92 66 L92 88 L84 88 Z" fill="#89CFF0" />
        <Path d="M84 66 L86 66 L86 88 L84 88 Z" fill="#000" opacity={0.2} />
        {/* Book 6 – dark */}
        <Path d="M94 58 L102 58 L102 88 L94 88 Z" fill="#263238" />
        <Path d="M94 58 L96 58 L96 88 L94 88 Z" fill="#455A64" />
        {/* Decorative items on shelf */}
        <Path
          d="M104 80 Q108 75 112 80 Q108 85 104 80 Z"
          fill="#89CFF0"
        />
      </G>
      {/* Character – book lover sitting */}
      <G>
        {/* Body */}
        <Path d="M0.43 78 Q0 95 10 102 L60 102 Q70 95 70 78 Z" fill="#89CFF0" opacity={0.15} />
        {/* Legs/sitting */}
        <Path d="M8 88 Q8 103 20 103 L50 103 Q62 103 62 88 Z" fill="#263238" />
        {/* Torso */}
        <Path d="M18 58 Q15 70 15 88 L55 88 Q55 70 52 58 Z" fill="#89CFF0" />
        <Path d="M18 58 Q15 70 15 88 L55 88 Q55 70 52 58 Z" fill="#fff" opacity={0.3} />
        {/* Arms holding book */}
        <Path d="M15 68 Q8 72 10 80 L18 78 Q16 72 20 68 Z" fill="#89CFF0" />
        <Path d="M52 68 Q59 72 57 80 L49 78 Q51 72 48 68 Z" fill="#89CFF0" />
        {/* Hands */}
        <Path d="M9 79 Q7 82 9 85 Q12 85 13 82 Z" fill="#AD6359" />
        <Path d="M58 79 Q60 82 58 85 Q55 85 54 82 Z" fill="#AD6359" />
        {/* Open book */}
        <Path d="M14 72 Q35 68 35 72 Q35 85 14 85 Z" fill="#EBEBEB" />
        <Path d="M56 72 Q35 68 35 72 Q35 85 56 85 Z" fill="#DBDBDB" />
        <Path d="M14 72 L56 72" stroke="#263238" strokeWidth={0.8} strokeLinecap="round" />
        {/* Text lines on book */}
        <Path d="M18 76 L32 76" stroke="#263238" strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M18 79 L31 79" stroke="#263238" strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M18 82 L29 82" stroke="#263238" strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M38 76 L52 76" stroke="#263238" strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M38 79 L51 79" stroke="#263238" strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M38 82 L50 82" stroke="#263238" strokeWidth={0.6} strokeLinecap="round" />
        {/* Head */}
        <Path
          d="M28 38 Q28 28 35 28 Q42 28 42 38 Q42 48 35 48 Q28 48 28 38 Z"
          fill="#AD6359"
        />
        {/* Hair */}
        <Path d="M28 35 Q28 28 35 28 Q42 28 42 35 Z" fill="#263238" />
        {/* Face */}
        <Path d="M32 40 Q35 43 38 40" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M32 37 L33 37" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M37 37 L38 37" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        {/* Neck */}
        <Path d="M33 48 L33 58 L37 58 L37 48 Z" fill="#AD6359" />
        {/* Hearts floating */}
        <Path d="M22 38 Q22 34 25 36 Q28 34 28 38 Q28 42 25 44 Q22 42 22 38 Z" fill="#89CFF0" opacity={0.8} />
        <Path d="M21 25 Q21 22 23.5 24 Q26 22 26 25 Q26 28 23.5 30 Q21 28 21 25 Z" fill="#89CFF0" opacity={0.6} />
        <Path d="M23 14 Q23 12 25 13.5 Q27 12 27 14 Q27 16 25 17.5 Q23 16 23 14 Z" fill="#89CFF0" opacity={0.4} />
        <Path d="M21.35 45.5 Q21.35 42.5 23.5 44 Q25.65 42.5 25.65 45.5 Q25.65 48.5 23.5 50 Q21.35 48.5 21.35 45.5 Z" fill="#89CFF0" opacity={0.5} />
        <Path d="M24 52 Q24 50 25.5 51 Q27 50 27 52 Q27 54 25.5 55 Q24 54 24 52 Z" fill="#89CFF0" opacity={0.35} />
      </G>
    </Svg>
  );
}

// ─────────────────────────────────────────────
// StudyBuddyIllustration
// Used in: Tool card 3 – "StudyBuddy"
// Accent: #7E57C2 (purple)
// ─────────────────────────────────────────────
export function StudyBuddyIllustration() {
  return (
    <Svg width={120} height={89} viewBox="0 0 120 89" fill="none">
      {/* Background simple – purple wash */}
      <Path
        d="M20.02 3.34 C20.02 3.34 100 3.34 100 59.18 C100 59.18 20.02 59.18 20.02 3.34 Z"
        fill="#7E57C2"
        opacity={0.2}
      />
      {/* Shadow */}
      <Path
        d="M13.47 88.99 Q60 94 106.53 88.99 Q60 84 13.47 88.99 Z"
        fill="#F5F5F5"
      />
      {/* Plant pot left */}
      <G>
        <Path d="M53.09 69 L53.09 84 L60 84 L60 69 Z" fill="#263238" />
        <Path d="M50 75 Q53.09 69 60 69 Q60 75 50 75 Z" fill="#7E57C2" />
        <Path d="M50 75 Q53.09 69 60 69 Q60 75 50 75 Z" fill="#000" opacity={0.1} />
        <Path d="M60 66 Q63 69 60 69 Q60 66 60 69 Q57 69 60 66 Z" fill="#7E57C2" />
        <Path d="M56 62 Q60 58 64 62 Q60 66 56 62 Z" fill="#7E57C2" />
        <Path d="M56 62 Q60 58 64 62 Q60 66 56 62 Z" fill="#000" opacity={0.1} />
        <Path d="M53 58 Q56 53 60 56 Q58 60 53 58 Z" fill="#7E57C2" />
        <Path d="M60 56 Q64 53 67 58 Q63 60 60 56 Z" fill="#7E57C2" />
        <Path d="M49 52 Q53 47 57 51 Q55 55 49 52 Z" fill="#7E57C2" />
        <Path d="M60 52 Q64 47 68 51 Q66 55 60 52 Z" fill="#7E57C2" />
        <Path d="M51 45 Q55 41 58 45 Q56 48 51 45 Z" fill="#7E57C2" />
        <Path d="M62 45 Q65 41 68 45 Q66 48 62 45 Z" fill="#7E57C2" />
      </G>
      {/* Character 2 – right side, purple outfit */}
      <G>
        {/* Body */}
        <Path d="M70 45 Q67 55 67 85 L90 85 Q90 55 87 45 Z" fill="#7E57C2" />
        <Path d="M70 45 Q67 55 67 85 L90 85 Q90 55 87 45 Z" fill="#fff" opacity={0.1} />
        {/* Legs */}
        <Path d="M70 74 L70 85 L76 85 L76 74 Z" fill="#263238" />
        <Path d="M81 74 L81 85 L87 85 L87 74 Z" fill="#263238" />
        {/* Arms */}
        <Path d="M67 50 Q61 55 63 63 L70 61 Q68 55 72 50 Z" fill="#7E57C2" />
        <Path d="M67 50 Q61 55 63 63 L70 61 Q68 55 72 50 Z" fill="#fff" opacity={0.1} />
        <Path d="M90 50 Q96 55 94 63 L87 61 Q89 55 85 50 Z" fill="#7E57C2" />
        {/* Hands shaking */}
        <Path d="M62 62 Q60 65 62 68 Q65 68 66 65 Z" fill="#CE7A63" />
        <Path d="M95 62 Q97 65 95 68 Q92 68 91 65 Z" fill="#CE7A63" />
        {/* Head */}
        <Path
          d="M72 25 Q72 15 78.5 15 Q85 15 85 25 Q85 35 78.5 35 Q72 35 72 25 Z"
          fill="#CE7A63"
        />
        {/* Hair */}
        <Path d="M72 22 Q72 15 78.5 15 Q85 15 85 22 Z" fill="#263238" />
        {/* Face */}
        <Path d="M76 27 Q78.5 30 81 27" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M75 23 L76 23" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M81 23 L82 23" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        {/* Neck */}
        <Path d="M76 35 L76 45 L81 45 L81 35 Z" fill="#CE7A63" />
        {/* Collar accent */}
        <Path d="M74 43 L79.5 47 L85 43 L85 45 L79.5 49 L74 45 Z" fill="#7E57C2" />
        <Path d="M74 43 L79.5 47 L85 43 L85 45 L79.5 49 L74 45 Z" fill="#fff" opacity={0.1} />
      </G>
      {/* Character 1 – left side, light outfit */}
      <G>
        {/* Body */}
        <Path d="M33.98 46 Q31 56 31 85 L58 85 Q58 56 55 46 Z" fill="#7E57C2" />
        <Path d="M33.98 46 Q31 56 31 85 L58 85 Q58 56 55 46 Z" fill="#000" opacity={0.1} />
        {/* Legs */}
        <Path d="M34 74 L34 85 L40 85 L40 74 Z" fill="#263238" />
        <Path d="M49 74 L49 85 L55 85 L55 74 Z" fill="#263238" />
        {/* Arms extended for handshake */}
        <Path d="M55 52 Q62 56 60 64 L53 62 Q55 56 51 52 Z" fill="#7E57C2" />
        <Path d="M34 52 Q28 56 30 64 L37 62 Q35 56 39 52 Z" fill="#7E57C2" />
        {/* Hands */}
        <Path d="M29 63 Q27 66 29 69 Q32 69 33 66 Z" fill="#FFB573" />
        <Path d="M62 63 Q64 66 62 69 Q59 69 58 66 Z" fill="#FFB573" />
        {/* Head */}
        <Path
          d="M36 27 Q36 17 43.5 17 Q51 17 51 27 Q51 37 43.5 37 Q36 37 36 27 Z"
          fill="#FFB573"
        />
        {/* Hair */}
        <Path d="M36 23 Q36 17 43.5 17 Q51 17 51 23 Z" fill="#263238" />
        {/* Face */}
        <Path d="M40 29 Q43.5 32 47 29" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M39 25 L40 25" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M47 25 L48 25" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        {/* Nose */}
        <Path d="M43 26 L43 28" stroke="#ED893E" strokeWidth={0.5} strokeLinecap="round" />
        {/* Neck */}
        <Path d="M41 37 L41 46 L46 46 L46 37 Z" fill="#FFB573" />
        {/* Shirt detail */}
        <Path d="M38 44 L44 48 L50 44 L50 46 L44 50 L38 46 Z" fill="#7E57C2" />
        <Path d="M38 44 L44 48 L50 44 L50 46 L44 50 L38 46 Z" fill="#fff" opacity={0.2} />
      </G>
      {/* Line accents top left */}
      <G>
        <Path d="M54.92 22 L57 22" stroke="#7E57C2" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M54.92 25 L60 25" stroke="#7E57C2" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M54.92 28 L58 28" stroke="#7E57C2" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M54.92 31 L61 31" stroke="#7E57C2" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M54.92 34 L57 34" stroke="#7E57C2" strokeWidth={1.5} strokeLinecap="round" />
      </G>
    </Svg>
  );
}

// ─────────────────────────────────────────────
// SpeechToTextIllustration
// Used in: Tool card 4 – "Speech to Text (Writing Assistant)"
// Accent: #C53F3F (red)
// ─────────────────────────────────────────────
export function SpeechToTextIllustration() {
  return (
    <Svg width={100} height={99} viewBox="0 0 100 99" fill="none">
      {/* Background simple – light grey */}
      <Path
        d="M2.57 0 C2.57 0 97.42 0 97.42 81.58 C97.42 81.58 2.57 81.58 2.57 0 Z"
        fill="#F5F5F5"
      />
      {/* Phone device */}
      <G>
        {/* Device body */}
        <Path
          d="M29.74 3.56 Q29.74 0 35 0 L76.62 0 Q76.62 0 76.62 3.56 L76.62 95.2 Q76.62 99 71 99 L35 99 Q29.74 99 29.74 95.2 Z"
          fill="#263238"
        />
        {/* Screen */}
        <Path
          d="M32 8 L74.5 8 L74.5 92 L32 92 Z"
          fill="#E0E0E0"
        />
        {/* App header – red */}
        <Path d="M32 8 L74.5 8 L74.5 30 L32 30 Z" fill="#C53F3F" />
        {/* Waveform lines on screen */}
        <Path d="M36 40 L36 55" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M40 36 L40 59" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M44 43 L44 52" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M48 38 L48 57" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M52 41 L52 54" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M56 35 L56 60" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M60 43 L60 52" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M64 39 L64 56" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M68 45 L68 50" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M72 42 L72 53" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        {/* Text lines on lower screen */}
        <Path d="M36 65 L70 65" stroke="#455A64" strokeWidth={1} strokeLinecap="round" />
        <Path d="M36 70 L65 70" stroke="#455A64" strokeWidth={1} strokeLinecap="round" />
        <Path d="M36 75 L68 75" stroke="#455A64" strokeWidth={1} strokeLinecap="round" />
        <Path d="M36 80 L58 80" stroke="#455A64" strokeWidth={1} strokeLinecap="round" />
        {/* Home bar */}
        <Path d="M47 94 L59 94" stroke="#455A64" strokeWidth={2} strokeLinecap="round" />
        {/* Camera notch */}
        <Path d="M49 3 L57.5 3 Q57.5 6 53 6 Q49 6 49 3 Z" fill="#455A64" />
        {/* Record button on app */}
        <Path d="M47 16 Q47 12 53 12 Q59 12 59 16 Q59 20 53 20 Q47 20 47 16 Z" fill="#FAFAFA" opacity={0.3} />
        <Path d="M50 16 Q50 14 53 14 Q56 14 56 16 Q56 18 53 18 Q50 18 50 16 Z" fill="#C53F3F" />
      </G>
      {/* Character – person speaking */}
      <G>
        {/* Body – red shirt */}
        <Path d="M0 55 Q0 45 8 45 L28 45 Q36 45 36 55 L36 99 L0 99 Z" fill="#C53F3F" />
        <Path d="M4 45 L10 45 L10 99 L4 99 Z" fill="#fff" opacity={0.6} />
        <Path d="M14 45 L20 45 L20 99 L14 99 Z" fill="#fff" opacity={0.6} />
        {/* Arms */}
        <Path d="M0 55 Q-4 62 -2 72 L6 70 Q4 62 8 55 Z" fill="#C53F3F" />
        <Path d="M36 55 Q40 62 38 72 L30 70 Q32 62 28 55 Z" fill="#C53F3F" />
        {/* Hands */}
        <Path d="M-3 71 Q-5 75 -3 78 Q0 78 1 75 Z" fill="#FFBE9D" />
        <Path d="M39 71 Q41 75 39 78 Q36 78 35 75 Z" fill="#FFBE9D" />
        {/* Head */}
        <Path
          d="M8.54 15 Q8.54 5 18 5 Q27.52 5 27.52 15 Q27.52 25 18 25 Q8.54 25 8.54 15 Z"
          fill="#FFBE9D"
        />
        {/* Hair */}
        <Path d="M8.54 12 Q8.54 5 18 5 Q27.52 5 27.52 12 Z" fill="#263238" />
        {/* Face */}
        <Path d="M14 17 Q18 21 22 17" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M13 13 L14 13" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M22 13 L23 13" stroke="#263238" strokeWidth={0.7} strokeLinecap="round" />
        {/* Nose */}
        <Path d="M17 14 L17 16" stroke="#EB996E" strokeWidth={0.5} strokeLinecap="round" />
        {/* Ear */}
        <Path d="M8 14 Q5 14 5 17 Q5 20 8 20" stroke="#FFBE9D" strokeWidth={1} fill="none" />
        <Path d="M28 14 Q31 14 31 17 Q31 20 28 20" stroke="#FFBE9D" strokeWidth={1} fill="none" />
        {/* Neck */}
        <Path d="M16 25 L16 35 L20 35 L20 25 Z" fill="#FFBE9D" />
        {/* Cheeks */}
        <Path d="M11 17 Q12 19 13 18" stroke="#EB996E" strokeWidth={0.5} fill="none" />
        <Path d="M23 17 Q24 19 25 18" stroke="#EB996E" strokeWidth={0.5} fill="none" />
        {/* Shirt collar lines */}
        <Path d="M13 35 L18 40 L23 35 L23 38 L18 43 L13 38 Z" fill="#C53F3F" opacity={0.3} />
      </G>
      {/* Speech bubble */}
      <G>
        {/* Bubble */}
        <Path
          d="M1.7 10.16 Q1.7 5 7.5 5 L15.5 5 Q21 5 21 10.16 Q21 15.32 15.5 15.32 L6 15.32 L1.7 19 Z"
          fill="#FAFAFA"
        />
        {/* Dots inside bubble */}
        <Path d="M6 11 Q6.5 9.5 8 10 Q9.5 9.5 10 11 Q9.5 12.5 8 12 Q6.5 12.5 6 11 Z" fill="#263238" />
        <Path d="M10.5 11 Q11 9.5 12.5 10 Q14 9.5 14.5 11 Q14 12.5 12.5 12 Q11 12.5 10.5 11 Z" fill="#263238" />
        <Path d="M15 11 Q15.5 9.5 16.5 10 Q17.5 9.5 18 11 Q17.5 12.5 16.5 12 Q15.5 12.5 15 11 Z" fill="#263238" />
      </G>
      {/* Plant – right side */}
      <G>
        {/* Pot */}
        <Path d="M82.5 90 L82.5 99 L97 99 L97 90 Z" fill="#455A64" />
        <Path d="M80 84 Q89.75 90 99.5 84 L97 90 L82.5 90 Z" fill="#455A64" />
        {/* Stem */}
        <Path d="M89.75 84 L89.75 50" stroke="#263238" strokeWidth={1.5} strokeLinecap="round" />
        {/* Leaves going up the stem */}
        <Path d="M89.75 78 Q84 72 80 74 Q82 80 89.75 78 Z" fill="#263238" />
        <Path d="M89.75 78 Q84 72 80 74 Q82 80 89.75 78 Z" fill="#C53F3F" opacity={0.3} />
        <Path d="M89.75 72 Q96 66 100 68 Q98 74 89.75 72 Z" fill="#263238" />
        <Path d="M89.75 66 Q84 60 80 62 Q82 68 89.75 66 Z" fill="#263238" />
        <Path d="M89.75 60 Q96 54 100 56 Q98 62 89.75 60 Z" fill="#263238" />
        <Path d="M89.75 54 Q84 48 80 50 Q82 56 89.75 54 Z" fill="#263238" />
        <Path d="M89.75 48 Q96 42 100 44 Q98 50 89.75 48 Z" fill="#263238" />
        <Path d="M89.75 66 Q84 60 80 62 Q82 68 89.75 66 Z" fill="#C53F3F" opacity={0.3} />
      </G>
    </Svg>
  );
}

// ─────────────────────────────────────────────
// MemoryCardIcon
// Used in: Recent activity row – Flashcards type indicator
// ─────────────────────────────────────────────
export function MemoryCardIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5 3 L15 3 Q17 3 17 5 L17 17 Q17 19 15 19 L5 19 Q3 19 3 17 L3 5 Q3 3 5 3 Z"
        stroke="#555555"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M7 3 L7 8 L10 6 L13 8 L13 3"
        fill="#555555"
        stroke="#555555"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// LexiAssistLogoMark
// Used in: Top bar – brand logomark (hamburger icon area)
// ─────────────────────────────────────────────
export function LexiAssistLogoMark({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        d="M20 4 Q32 4 36 14 Q40 24 34 32 Q28 40 18 38 Q8 36 5 26 Q2 16 10 9 Q14 5 20 4 Z"
        fill="#ECF3EE"
      />
      <Path
        d="M14 14 L14 28 M14 14 L20 24 L26 14 M26 14 L26 28"
        stroke="#3C8350"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// FileIcon
// Used in: Recent activity rows – document indicator
// Gradient: #89CFF0 → #3C8350
// ─────────────────────────────────────────────
export function FileIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="fileGrad" x1="12" y1="2.25" x2="12" y2="21.75" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#89CFF0" />
          <Stop offset="1" stopColor="#3C8350" />
        </LinearGradient>
      </Defs>
      <Path
        d="M14 2.25 L6 2.25 Q4.5 2.25 4.5 3.75 L4.5 20.25 Q4.5 21.75 6 21.75 L18 21.75 Q19.5 21.75 19.5 20.25 L19.5 8.25 Z M14 2.25 L14 8.25 L19.5 8.25"
        fill="url(#fileGrad)"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// QuizIcon
// Used in: Recent activity rows – quiz type indicator
// ─────────────────────────────────────────────
export function QuizIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M3 2 L13 2 Q14.5 2 14.5 3.5 L14.5 12.5 Q14.5 14 13 14 L3 14 Q1.5 14 1.5 12.5 L1.5 3.5 Q1.5 2 3 2 Z"
        stroke="#000"
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M4 6 L7 6" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M9 5.5 L9 7.5 M8 6.5 L10 6.5" stroke="#000" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 10 L7 10" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M9 9.5 L11 11.5 M11 9.5 L9 11.5" stroke="#000" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// ClockIcon
// Used in: Recent activity rows – timestamp indicator
// ─────────────────────────────────────────────
export function ClockIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.5 Q13 1.5 13 8 Q13 14.5 8 14.5 Q3 14.5 3 8 Q3 1.5 8 1.5 Z M8 4.5 L8 8.5 L11 10"
        stroke="#000"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// GearIcon
// Used in: Top bar – settings button
// ─────────────────────────────────────────────
export function GearIcon({ size = 20, color = "#ECF3EE" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 6.5 Q13.5 6.5 13.5 10 Q13.5 13.5 10 13.5 Q6.5 13.5 6.5 10 Q6.5 6.5 10 6.5 Z"
        fill={color}
      />
      <Path
        d="M10 1 L11.5 3.5 Q13 3 14.5 4 L14.5 1.5 Q16 2 17 3 L15 5 Q15.5 6.5 15 8 L17.5 8.5 Q18 10 17.5 11.5 L15 12 Q14.5 13.5 15 15 L17 17 Q16 18 14.5 18.5 L14.5 16 Q13 17 11.5 16.5 L10 19 L8.5 16.5 Q7 17 5.5 16 L5.5 18.5 Q4 18 3 17 L5 15 Q4.5 13.5 5 12 L2.5 11.5 Q2 10 2.5 8.5 L5 8 Q5.5 6.5 5 5 L3 3 Q4 2 5.5 1.5 L5.5 4 Q7 3 8.5 3.5 Z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// MoonIcon
// Used in: Top bar – dark mode toggle
// ─────────────────────────────────────────────
export function MoonIcon({ size = 16, color = "#ECF3EE" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M13.5 10.5 Q10 14 5.5 12.5 Q1 11 1.5 6.5 Q2 3 5 2 Q3 5 4 8 Q5 11 8 12 Q11 13 13.5 10.5 Z"
        fill={color}
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// FABCancelIcon
// Used in: Floating action button (bottom right)
// The green rotated cross
// ─────────────────────────────────────────────
export function FABCancelIcon({ size = 60 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <Path
        d="M15 5 L45 5 Q55 5 55 15 L55 45 Q55 55 45 55 L15 55 Q5 55 5 45 L5 15 Q5 5 15 5 Z"
        fill="#3C8350"
      />
      <Path d="M20 30 L40 30 M30 20 L30 40" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
