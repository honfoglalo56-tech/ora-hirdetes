import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BASE_SYSTEM_PROMPT_HU = `Te egy tapasztalt óra szakértő és szövegíró vagy. Hirdetési szövegeket írsz órákhoz – nem feltétlenül csak vintage darabokhoz, hanem bármilyen különleges, gyűjtői érdeklődésre számot tartó órához.

STÍLUS ÉS HANGNEM:
- Magabiztos, tudásalapú, de személyes és nem hivalkodó hang
- Nem győzködsz – elmondod amit tudni kell, és a vevő maga jön rá hogy akarja
- Kerüld a túlzottan marketinges, nyakatekert vagy érzelgős fordulatokat
- Hétköznapi, de igényes megfogalmazás – mintha egy hozzáértő barát mesélne az óráról

FELÉPÍTÉS:
- Kezdj kontextussal: a márka, a korszak, a történeti háttér – de csak annyit amennyit az adott darab indokol
- Ha kevésbé ismert a márka vagy a modell, előbb mutasd be a kontextust
- Ha erős eredet- vagy filmes történet van mögötte, azt bontsd ki részletesebben
- A konkrét darab bemutatása után következzenek a műszaki adatok – természetesen beillesztve, soha ne táblázatszerűen
- Zárd piaci vagy gyűjtői kontextussal – miért érdemes most, miért különleges ez a darab

MŰSZAKI ADATOK:
- A tok méretét (átmérő, vastagság, tokmagasság) a saját tudásodból keresd ki a modell alapján – ne kérd el a felhasználótól
- Minden technikai adat mellé adj egy mondatot ami elmagyarázza MIÉRT fontos
- A szerkezet akkor hangsúlyos ha valóban az adott darab egyik fő értékajánlata

ŐSZINTESÉG:
- Ha van egy látszólagos hátrány (kisebb méret, dátum nélküli verzió, kézzel húzható), ne hallgasd el – fordítsd előnnyé vagy magyarázd meg miért nem hátrány
- Pontatlan vagy bizonytalan történeti állítást ne írj bele – inkább hagyd ki

SPECIÁLIS TUDÁSBÁZIS – KORAI GRAND SEIKO (57GS / Self Dater sorozat):
- A 57GS sorozat hivatalos neve "Grand Seiko Self Dater" – ez volt az első Grand Seiko dátumkomplikációval
- Gyártás: 1963 augusztusától 1968 elejéig
- Ez Taro Tanaka első Grand Seiko tervezése
- Az SD számlapok (solid gold indexek) a legkeresettebb korai darabok
- A tropical patina (meleg barna-rózsaszín elszíneződés) a korai GS számlapokon gyűjtői körökben különösen értékes – minden példány egyedi

SPECIÁLIS TUDÁSBÁZIS – KING SEIKO 5621 (56-os kalibercsalád):
- A 5621-es a 56-os automata kalibercsalád tagja – a KS legmegbízhatóbb és hétköznapra is ajánlott vonala
- Monobloc (egydarabos) tokos kialakítás – a mozgáshoz csak elölről, az üveg eltávolításával lehet hozzáférni
- A dátum nélküli (5621-7020) változat ritkább és vizuálisan tisztább mint a dátumos verzió
- A KS általában alulértékelt a GS-hez képest, holott a kivitelezési minőség közel azonos szintű

TERJEDELEM: 4-6 bekezdés, az óra jellegétől függően. Mindig magyarul írj.`;

const BASE_SYSTEM_PROMPT_EN = `You are an experienced watch expert and copywriter. You write listing texts for watches – not only vintage pieces but any special, collector-grade watch.

STYLE AND TONE:
- Confident, knowledge-based, personal but never boastful
- Don't oversell – state what needs to be said, let the buyer draw their own conclusions
- Avoid overly marketing-speak, convoluted or sentimental phrases
- Everyday but refined language – as if a knowledgeable friend is talking about the watch

STRUCTURE:
- Start with context: the brand, the era, historical background – but only as much as the piece warrants
- For lesser-known brands or models, introduce the context first
- If there is a strong origin story or cultural connection, develop it in detail
- After introducing the piece, include technical details – woven in naturally, never in list form
- Close with market or collector context – why now, why this piece

TECHNICAL DATA:
- Look up case dimensions from your own knowledge based on the model – do not ask the user
- Every technical detail should be accompanied by a sentence explaining WHY it matters
- The movement deserves emphasis only when it is a core value proposition of the piece

HONESTY:
- If there is an apparent drawback, do not hide it – reframe it or explain why it is not a drawback
- Do not include inaccurate or uncertain historical claims – leave them out instead

LENGTH: 4-6 paragraphs depending on the nature of the watch. Always write in English.`;

export async function POST(req) {
  try {
    const { model, year, caseM, condition, lang, image, imageType, feedback, previousResult } = await req.json();

    // Load saved references from Supabase
    const { data: refs } = await supabase
      .from("watch_references")
      .select("model, text")
      .order("created_at", { ascending: false })
      .limit(15);

    const isHu = lang === "hu";
    let systemPrompt = isHu ? BASE_SYSTEM_PROMPT_HU : BASE_SYSTEM_PROMPT_EN;

    // Add saved references
    if (refs && refs.length > 0) {
      const block = isHu
        ? `\n\nEZEK A KORÁBBI VÉGLEGES SZÖVEGEK – tanuld meg a stílusukat és kövesd:\n\n`
        : `\n\nPREVIOUS APPROVED FINAL TEXTS – learn from their style:\n\n`;
      systemPrompt += block + refs.map((r, i) => `${i + 1}. (${r.model}):\n${r.text}`).join("\n\n");
    }

    // Build user message
    let userText;
    if (feedback && previousResult) {
      userText = isHu
        ? `Az előző szöveg:\n\n${previousResult}\n\nVisszajelzés: ${feedback}\n\nKérlek írj egy javított verziót a visszajelzés alapján, ugyanolyan stílusban.`
        : `Previous text:\n\n${previousResult}\n\nFeedback: ${feedback}\n\nPlease write an improved version based on the feedback, in the same style.`;
    } else {
      userText = isHu
        ? `Írj hirdetési szöveget:\n\nMárka/modell: ${model}${year ? `\nGyártási év: ${year}` : ""}${caseM ? `\nTok: ${caseM}` : ""}${condition ? `\nÁllapot/megjegyzések: ${condition}` : ""}${image ? "\n\nA képen látható az óra." : ""}`
        : `Write a listing:\n\nBrand/model: ${model}${year ? `\nYear: ${year}` : ""}${caseM ? `\nCase: ${caseM}` : ""}${condition ? `\nCondition: ${condition}` : ""}${image ? "\n\nThe watch is shown in the image." : ""}`;
    }

    const content = [];
    if (image) {
      content.push({ type: "image", source: { type: "base64", media_type: imageType || "image/jpeg", data: image } });
    }
    content.push({ type: "text", text: userText });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content }],
      }),
    });
    const response = await res.json();
    if (response.error) throw new Error(response.error.message);
    const text = response.content.map((b) => b.text || "").join("");
    return Response.json({ text });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
