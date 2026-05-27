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

REFERENCIA SZÖVEG – Grand Seiko 56GS (5646-7010):
"1959-ben csatlakozott a Seiko-hoz Taro Tanaka, a frissen diplomázott formatervező, aki a márka történetében az első valódi professzionális szakember volt ezen a területen. Legfőbb célja Tanakának az volt, hogy olyan órákat tervezzen, amelyek fantasztikus minőséget és valódi alternatívát nyújtanak a svájciakkal szemben. Elsőként a high-end modellek voltak fókuszban, a Grand Seiko-k és King Seiko-k.

A mára széleskörben ismert Grammar of Design filozófia 1962-ben született meg, amely alapvetően 4 fő pillérre épül. Minden felületnek, ami az órán található síknak és geometriailag tökéletesnek kell lennie, a számlapot körülvevő rámának egyszerű, de mégis íves formát kell kapnia. A vizuális torzítás nem megengedett, mindennek tükörfényesen kell csillognia és végezetül minden toknak egyedinek kell lennie, végleg leszámoltak a generikus, kerek tokformákkal.

Elsőként a csúcs King és Grand Seiko-k készültek ezen elvek alapján, a hirdetésben szereplő 5646-7010 vagy másnéven 56GS a második volt a sorban 1970-ben. Le sem tagadhatná a Tanaka-féle jegyeket, 36 mm-es óratok, csodás borotvaéles letörésekkel és tükrös felületekkel. 41 mm-es magasság mellé csupán 10.2 mm-es vastagság társul, amelyet az ultravékony 5646A szerkezetnek köszönhet. Az automata felhúzással is felszerelt darab, nap-dátum komplikációval is rendelkezik és megfelelő karbantartás után még ma is rendkívüli pontosságot tud.

A számlap több, mint 50 év után remekül öregedett, a világos sárgás-homokszínű árnyalat kiválóan illik az óra hangulatához. A Seiko felirat alatti Automatic felirat mellett büszkén viseli a Hi-Beat (4 Hz-es működés) és a Suwa Seikosha gyár apró S monogrammját is. Itt készültek a 60-as és 70-es években a pazar mechanikus szerkezetek és Grand Seiko-k, illetve Astronok.

Ez az 5646-7010-es Grand Seiko nem csak egy vintage óra a sok közül, hanem a japán márka mérföldköve is sok tekintetben. Egyrészt a Tanaka dizájn koncepció indulásának elejéről származik, amikor még vegytisztán kapta meg az összes stílusjegyet, másrészt technikai oldalról is magasra tették a mércét a benne lévő szerkezettel. Az 56GS külön érdekessége, hogy éppen a kvarcválság hajnalán jelent meg, amely sajnos ezt is elsodorta idővel. Ezzel pedig úgyis tekinthetünk rá, hogy abból a korszakból az utolsó mechanikus szerkezetes Grand Seiko, ugyanis 1975-től átterelődött a hangsúly a kvarc modellekre."

REFERENCIA SZÖVEG – Grand Seiko 5645-5010, négyzetes tok:
"A Seiko történetében Taro Tanaka neve összeforrt a márka időtállóságával és formai megújulásával. 1959-ben kezdett el dolgozni a cégnél formatervezőként, aki tulajdonképpen az első professzionális szakember volt ezen a területen a Seiko-nál. A küldetése az volt Tanakának, hogy olyan órákat tervezzen, amelyek fantasztikus minőséget és attraktív megjelenést biztosítanak a konkurenciával szemben. Ezt célkeresztben tartva 1962-ben született meg a Grammar of Design filozófia, amely alapvetően 4 fő pillérre épül. Minden felületnek, ami az órán található síknak és geometriailag tökéletesnek kell lennie, a számlapot körülvevő rámának egyszerű, de mégis íves formát kell kapnia. A vizuális torzítás nem megengedett, mindennek tükörfényesen kell csillognia és végezetül minden toknak egyedinek kell lennie, végleg leszámoltak a generikus, kerek tokformákkal.

Elsőként a King és Grand Seiko-k készültek ezen elvek alapján, a hirdetésben szereplő 5645-5010 pedig egy igazán méltó megtestesítője ennek a szellemiségnek, még ha nem is feltétlen felel meg minden kritériumnak. Az 1973-as katalógusban megjelenő modell legnagyobb érdekessége a négyzet alakú tok, amely azóta is egyedi, hiszen több mechanikus Grand Seiko nem készült ilyen formában. Ugyan a 35 mm x 41 mm-es méret első hallásra erősen vintage méret, viszont a Santos és a Monaco óta tudjuk, hogy ez a négyzetes tok nagyobbnak hat. A borotvaéles letörések és a tükrös felületek itt is megvannak és csupán 10.5 mm vastag a tok, amelyet az ultravékony 5646A szerkezetnek köszönhet. Az automata felhúzással is felszerelt darab, kanji japán nap és dátum komplikációval rendelkezik és megfelelő karbantartás után még ma is rendkívüli pontosságot tud.

A számlap Kira-Zuri textúrát kapott, amely gradiens sárga-fehér-barna árnyalatokban pompázik. A mintázat jelentése csillogó festészet, amely a japán festészeti technikából inspirálódik. Az ukiyo-e festményekben gyakran alkalmazták ezt a módszert, hogy a kabuki-színészek hátterének a textúráját jobban megmutassák. Ez, a számlapot tekintve tökéletesen működik is, hiszen ahogyan az órát forgatjuk úgy válnak láthatóvá az egyes rétegek és mélységek.

Ez az 5645-5010-es igazi kuriózum még az egyébként is ritka, vintage Grand Seiko-k körében. Ugyan nem limitált modellről van szó, de a gyártása korlátozott ideig történt és emiatt rendkívül nehéz beszerezni ezt az órát. Nem véletlenül vált a gyűjtők kedvencévé az elmúlt időszakban, de ez nem csak az alacsony darabszám miatt van. Az unikális tokforma, a magas minőségű és nagy odafigyeléssel összerakott szerkezet illetve az új Grand Seiko-knál is alkalmazott számlap textúra kombinációja adja a különlegességét."

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
    const { model, year, caseM, condition, lang, platform, image, imageType, feedback, previousResult } = await req.json();

    // Load saved references from Supabase
    const { data: refs } = await supabase
      .from("watch_references")
      .select("model, text")
      .order("created_at", { ascending: false })
      .limit(15);

    // Load saved feedback rules
    const { data: feedbackRules } = await supabase
      .from("watch_feedback")
      .select("feedback")
      .order("created_at", { ascending: false })
      .limit(20);

    const isHu = lang === "hu";
    let systemPrompt = isHu ? BASE_SYSTEM_PROMPT_HU : BASE_SYSTEM_PROMPT_EN;

    // Platform specific instructions
    if (platform === "facebook") {
      systemPrompt += isHu
        ? "

PLATFORM: Facebook hirdetés. Hosszabb, részletesebb, storytelling jellegű szöveg. 4-6 bekezdés."
        : "

PLATFORM: Facebook listing. Longer, detailed, storytelling style. 4-6 paragraphs.";
    }

    // Add saved feedback rules
    if (feedbackRules && feedbackRules.length > 0) {
      const rulesBlock = isHu
        ? `\n\nEZEK AZ ÁLLANDÓ STÍLUSSZABÁLYOK – mindig tartsd be őket:\n\n`
        : `\n\nTHESE ARE PERMANENT STYLE RULES – always follow them:\n\n`;
      systemPrompt += rulesBlock + feedbackRules.map((f, i) => `${i + 1}. ${f.feedback}`).join("\n");
    }

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
      // Save feedback rule permanently
      await supabase.from("watch_feedback").insert({ feedback });

      userText = isHu
        ? `Az előző szöveg:\n\n${previousResult}\n\nVisszajelzés: ${feedback}\n\nKérlek írj egy javított verziót a visszajelzés alapján, ugyanolyan stílusban.`
        : `Previous text:\n\n${previousResult}\n\nFeedback: ${feedback}\n\nPlease write an improved version based on the feedback, in the same style.`;
    } else {
      const trustedSources = [
        "egalizer.hu",
        "hodinkee.com",
        "thetokeiclub.jp",
        "fratellowatches.com",
        "monochrome-watches.com",
        "theseikoguy.com",
        "calibercorner.com"
      ].join(", ");

      userText = isHu
        ? `Írj hirdetési szöveget az alábbi óráról. FONTOS: Először keresd meg az órát ezeken a megbízható forrásokon: ${trustedSources}. Ha ott nem találsz elegendő információt, keress más forrásokban is. A talált adatokat természetesen dolgozd bele a szövegbe.\n\nMárka/modell: ${model}${year ? `\nGyártási év: ${year}` : ""}${caseM ? `\nTok: ${caseM}` : ""}${condition ? `\nÁllapot/megjegyzések: ${condition}` : ""}${image ? "\n\nA képen látható az óra." : ""}`
        : `Write a listing for the following watch. IMPORTANT: First search for information on these trusted sources: ${trustedSources}. If not enough information is found there, search other sources as well. Naturally weave the found data into the text.\n\nBrand/model: ${model}${year ? `\nYear: ${year}` : ""}${caseM ? `\nCase: ${caseM}` : ""}${condition ? `\nCondition: ${condition}` : ""}${image ? "\n\nThe watch is shown in the image." : ""}`;
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
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        system: systemPrompt,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 3,
          }
        ],
        messages: [{ role: "user", content }],
      }),
    });
    const response = await res.json();
    if (response.error) throw new Error(response.error.message);
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text || "")
      .join("");
    // Auto-save to history
    if (!feedback) {
      await supabase.from("watch_history").insert({ model, text, lang: lang || "hu" });
    }

    return Response.json({ text });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
