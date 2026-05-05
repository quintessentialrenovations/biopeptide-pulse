import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Sarah - natural, warm feminine voice excellent for multilingual
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

// Normalize text for natural TTS pronunciation
function normalizeForSpeech(raw: string): string {
  let t = raw;

  // Units: mg, mcg, ml, kg, IU, etc.
  t = t.replace(/(\d+)\s*mcg/gi, "$1 microgramos");
  t = t.replace(/(\d+)\s*mg/gi, "$1 miligramos");
  t = t.replace(/(\d+)\s*ml/gi, "$1 mililitros");
  t = t.replace(/(\d+)\s*kg/gi, "$1 kilogramos");
  t = t.replace(/(\d+)\s*lb/gi, "$1 libras");
  t = t.replace(/(\d+)\s*cm/gi, "$1 centímetros");
  t = t.replace(/(\d+)\s*iu/gi, "$1 unidades internacionales");
  t = t.replace(/(\d+)\s*IU/g, "$1 unidades internacionales");

  // Percentages
  t = t.replace(/(\d+)\s*%/g, "$1 por ciento");
  t = t.replace(/(\d+)\s*porciento/gi, "$1 por ciento");

  // Common medical/peptide abbreviations
  t = t.replace(/\bGLP-1\b/g, "G L P uno");
  t = t.replace(/\bGIP\b/g, "G I P");
  t = t.replace(/\bGHRH\b/g, "G H R H");
  t = t.replace(/\bHGH\b/g, "hormona de crecimiento humana");
  t = t.replace(/\bGH\b/g, "hormona de crecimiento");
  t = t.replace(/\bIMC\b/g, "índice de masa corporal");
  t = t.replace(/\bFDA\b/g, "F D A");
  t = t.replace(/\bCOA\b/g, "certificado de análisis");
  t = t.replace(/\bAMPK\b/g, "A M P K");
  t = t.replace(/\bNAD\+?/g, "N A D plus");
  t = t.replace(/\bRLS\b/g, "R L S");
  t = t.replace(/\bDNA\b/g, "A D N");
  t = t.replace(/\bADN\b/g, "A D N");

  // Peptide names - improve pronunciation
  t = t.replace(/\bBPC-?157\b/gi, "B P C ciento cincuenta y siete");
  t = t.replace(/\bTB-?500\b/gi, "T B quinientos");
  t = t.replace(/\bCJC-?1295\b/gi, "C J C mil doscientos noventa y cinco");
  t = t.replace(/\bGHK-?Cu\b/gi, "G H K cobre");
  t = t.replace(/\bAOD-?9604\b/gi, "A O D nueve seis cero cuatro");
  t = t.replace(/\bSS-?31\b/gi, "S S treinta y uno");
  t = t.replace(/\bLL-?37\b/gi, "L L treinta y siete");
  t = t.replace(/\bIGF-?1?\s*LR3\b/gi, "I G F L R tres");
  t = t.replace(/\bIGF-?LR3\b/gi, "I G F L R tres");
  t = t.replace(/\bPE\s*22-?28\b/gi, "P E veintidós veintiocho");
  t = t.replace(/\bMOTS-?C\b/gi, "MOTS C");
  t = t.replace(/\bKPV\b/g, "K P V");
  t = t.replace(/\bVIP\b/g, "V I P");
  t = t.replace(/\bHCG\b/g, "H C G");
  t = t.replace(/\bPEG-?MGF\b/gi, "P E G M G F");
  t = t.replace(/\b5Amino\s*1MQ\b/gi, "cinco amino uno M Q");
  t = t.replace(/\bSNAP-?8\b/gi, "SNAP ocho");
  t = t.replace(/\bPT-?141\b/gi, "P T ciento cuarenta y uno");
  t = t.replace(/\bDAC\b/g, "D A C");

  // Dosing patterns: "2-3 veces" → "dos a tres veces"
  t = t.replace(/(\d+)-(\d+)\s*(veces|semanas|dias|meses)/gi, (_, a, b, unit) => {
    return `${numberToSpanish(a)} a ${numberToSpanish(b)} ${unit}`;
  });

  // Decimal numbers: "0.5" → "cero punto cinco"
  t = t.replace(/(\d+)\.(\d+)/g, (_, int, dec) => {
    return `${numberToSpanish(int)} punto ${numberToSpanish(dec)}`;
  });

  // URLs - simplify
  t = t.replace(/www\.biopeptidex\.net/gi, "biopeptidex punto net");
  t = t.replace(/https?:\/\/[^\s]+/g, "");

  // Remove markdown artifacts
  t = t.replace(/[*_#`]/g, "");

  // Clean up extra whitespace
  t = t.replace(/\s+/g, " ").trim();

  return t;
}

function numberToSpanish(n: string): string {
  const nums: Record<string, string> = {
    "0": "cero", "1": "uno", "2": "dos", "3": "tres", "4": "cuatro",
    "5": "cinco", "6": "seis", "7": "siete", "8": "ocho", "9": "nueve",
    "10": "diez", "11": "once", "12": "doce", "15": "quince", "20": "veinte",
    "30": "treinta", "40": "cuarenta", "50": "cincuenta",
  };
  return nums[n] || n;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text, voiceId } = await req.json();
    if (!text || typeof text !== "string" || text.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Invalid text (max 5000 chars)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const voice = voiceId || DEFAULT_VOICE_ID;
    const normalizedText = normalizeForSpeech(text);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.35,
            similarity_boost: 0.8,
            style: 0.55,
            use_speaker_boost: true,
            speed: 1.15,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("ElevenLabs error:", err);
      return new Response(
        JSON.stringify({ error: "TTS generation failed" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(audioBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    return new Response(
      JSON.stringify({ audio: base64 }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("TTS error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
