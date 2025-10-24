import { useLaunchParams, miniApp, useSignal } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";

import { routes } from "@/navigation/routes.jsx";
import React, { useState, useEffect, useRef } from "react";

// --- Constants (moved outside the component) ---

const colors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

const translations = {
  en: {
    title: "Decision Spinner",
    heading: "Decision Spinner",
    subheading: "Add options and spin the wheel!",
    spinButton: "Spin the Wheel!",
    placeholder: "Add an option...",
    footer: "Built in a day!",
    supportTitle: "Support the App!",
    supportSub: "Donate with Telegram Stars to keep this app running.",
    paymentSuccess: "Payment Successful!",
    paymentSuccessMsg: "Thank you for your support!",
    paymentFailed: "Payment Failed",
    paymentFailedMsg: "Something went wrong. Please try again.",
    addButton: "Add",
    geminiButton: "Suggest Ideas",
    geminiLoading: "Loading suggestions...",
    geminiError: "Error getting suggestions.",
    geminiPrompt:
      'Based on this list for a decision wheel, give me 5 more short, related ideas: {OPTIONS}. Return ONLY a JSON array of 5 strings. For example: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]',
    geminiPromptEmpty:
      'Give me 5 short, fun ideas for a decision wheel (e.g., \'Pizza\', \'Movie Night\'). Return ONLY a JSON array of 5 strings. For example: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]',
  },
  uk: {
    title: "Колесо Рішень",
    heading: "Колесо Рішень",
    subheading: "Додайте варіанти та крутіть колесо!",
    spinButton: "Крутити колесо!",
    placeholder: "Додати варіант...",
    footer: "Створено за день!",
    supportTitle: "Підтримайте додаток!",
    supportSub: "Пожертвуйте Telegram Stars, щоб цей додаток працював.",
    paymentSuccess: "Оплата Успішна!",
    paymentSuccessMsg: "Дякуємо за вашу підтримку!",
    paymentFailed: "Помилка Оплати",
    paymentFailedMsg: "Щось пішло не так. Будь ласка, спробуйте ще раз.",
    addButton: "Додати",
    geminiButton: "Запропонувати ідеї",
    geminiLoading: "Завантаження пропозицій...",
    geminiError: "Помилка отримання пропозицій.",
    geminiPrompt:
      'На основі цього списку для колеса рішень, дайте мені ще 5 коротких, пов\'язаних ідей: {OPTIONS}. Поверніть ТІЛЬКИ JSON-масив з 5 рядків. Наприклад: ["Ідея 1", "Ідея 2", "Ідея 3", "Ідея 4", "Ідея 5"]',
    geminiPromptEmpty:
      'Дайте мені 5 коротких, веселих ідей для колеса рішень (напр., \'Піца\', \'Вечір кіно\'). Поверніть ТІЛЬКИ JSON-масив з 5 рядків. Наприклад: ["Ідея 1", "Ідея 2", "Ідея 3", "Ідея 4", "Ідея 5"]',
  },
  es: {
    title: "Rueda de Decisiones",
    heading: "Rueda de Decisiones",
    subheading: "¡Añade opciones y gira la rueda!",
    spinButton: "¡Girar la Rueda!",
    placeholder: "Añadir una opción...",
    footer: "¡Hecho en un día!",
    supportTitle: "¡Apoya la App!",
    supportSub: "Dona con Telegram Stars para mantener esta app funcionando.",
    paymentSuccess: "¡Pago Exitoso!",
    paymentSuccessMsg: "¡Gracias por tu apoyo!",
    paymentFailed: "Pago Fallido",
    paymentFailedMsg: "Algo salió mal. Por favor, inténtalo de nuevo.",
    addButton: "Añadir",
    geminiButton: "Sugerir Ideas",
    geminiLoading: "Cargando sugerencias...",
    geminiError: "Error al obtener sugerencias.",
    geminiPrompt:
      'Basado en esta lista para una rueda de decisiones, dame 5 ideas cortas y relacionadas más: {OPTIONS}. Devuelve SÓLO un array JSON de 5 strings. Por ejemplo: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]',
    geminiPromptEmpty:
      'Dame 5 ideas cortas y divertidas para una rueda de decisiones (ej. \'Pizza\', \'Noche de cine\'). Devuelve SÓLO un array JSON de 5 strings. Por ejemplo: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]',
  },
  de: {
    title: "Entscheidungsrad",
    heading: "Entscheidungsrad",
    subheading: "Optionen hinzufügen und das Rad drehen!",
    spinButton: "Rad drehen!",
    placeholder: "Option hinzufügen...",
    footer: "An einem Tag gebaut!",
    supportTitle: "Unterstütze die App!",
    supportSub: "Spende mit Telegram Stars, damit diese App weiterläuft.",
    paymentSuccess: "Zahlung Erfolgreich!",
    paymentSuccessMsg: "Danke für deine Unterstützung!",
    paymentFailed: "Zahlung Fehlgeschlagen",
    paymentFailedMsg: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    addButton: "Hinzufügen",
    geminiButton: "Ideen vorschlagen",
    geminiLoading: "Lade Vorschläge...",
    geminiError: "Fehler beim Abrufen von Vorschlägen.",
    geminiPrompt:
      'Basierend auf dieser Liste für ein Entscheidungsrad, gib mir 5 weitere kurze, passende Ideen: {OPTIONS}. Gib NUR ein JSON-Array mit 5 Strings zurück. Zum Beispiel: ["Idee 1", "Idee 2", "Idee 3", "Idee 4", "Idee 5"]',
    geminiPromptEmpty:
      'Gib mir 5 kurze, unterhaltsame Ideen für ein Entscheidungsrad (z.B. \'Pizza\', \'Filmabend\'). Gib NUR ein JSON-Array mit 5 Strings zurück. Zum Beispiel: ["Idee 1", "Idee 2", "Idee 3", "Idee 4", "Idee 5"]',
  },
  fr: {
    title: "Roue de Décision",
    heading: "Roue de Décision",
    subheading: "Ajoutez des options et tournez la roue !",
    spinButton: "Tourner la roue !",
    placeholder: "Ajouter une option...",
    footer: "Fait en un jour !",
    supportTitle: "Soutenez l'application !",
    supportSub:
      "Faites un don avec Telegram Stars pour que cette application continue de fonctionner.",
    paymentSuccess: "Paiement Réussi !",
    paymentSuccessMsg: "Merci pour votre soutien !",
    paymentFailed: "Échec du Paiement",
    paymentFailedMsg: "Quelque chose s'est mal passé. Veuillez réessayer.",
    addButton: "Ajouter",
    geminiButton: "Suggérer des idées",
    geminiLoading: "Chargement des suggestions...",
    geminiError: "Erreur lors de la récupération des suggestions.",
    geminiPrompt:
      'Basé sur cette liste pour une roue de décision, donnez-moi 5 autres idées courtes et liées : {OPTIONS}. Retournez UNIQUEMENT un tableau JSON de 5 chaînes. Par exemple : ["Idée 1", "Idée 2", "Idée 3", "Idée 4", "Idée 5"]',
    geminiPromptEmpty:
      'Donnez-moi 5 idées courtes et amusantes pour une roue de décision (par ex. \'Pizza\', \'Soirée ciné\'). Retournez UNIQUEMENT un tableau JSON de 5 chaînes. Par exemple : ["Idée 1", "Idée 2", "Idée 3", "Idée 4", "Idée 5"]',
  },
  zh: {
    title: "决策转盘",
    heading: "决策转盘",
    subheading: "添加选项，转动转盘！",
    spinButton: "转动转盘！",
    placeholder: "添加一个选项...",
    footer: "一天之内建成！",
    supportTitle: "支持本应用！",
    supportSub: "使用 Telegram Stars 捐款，让本应用得以持续运行。",
    paymentSuccess: "支付成功！",
    paymentSuccessMsg: "感谢您的支持！",
    paymentFailed: "支付失败",
    paymentFailedMsg: "出了点问题。请再试一次。",
    addButton: "添加",
    geminiButton: "建议创意",
    geminiLoading: "正在加载建议...",
    geminiError: "获取建议时出错。",
    geminiPrompt:
      '根据这个决策轮的列表，再给我5个简短的相关创意：{OPTIONS}。只返回一个包含5个字符串的JSON数组。例如：["创意1", "创意2", "创意3", "创意4", "创意5"]',
    geminiPromptEmpty:
      '给我5个简短有趣的决策轮创意（例如“披萨”，“电影之夜”）。只返回一个包含5个字符串的JSON数组。例如：["创意1", "创意2", "创意3", "创意4", "创意5"]',
  },
};

// **IMPORTANT**: You MUST change this to your server's public URL.
const BOT_SERVER_URL = "https://tgappy.com";

// --- React Component ---
export function App() {
  // --- State ---
  const [options, setOptions] = useState([
    "Pizza 🍕",
    "Tacos 🌮",
    "Sushi 🍣",
    "Pasta 🍝",
  ]);
  const [lang, setLang] = useState("en");
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [starsLoading, setStarsLoading] = useState(false);
  const [tg, setTg] = useState(null);

  // --- Refs ---
  const canvasRef = useRef(null);
  const spinRotationRef = useRef(0); // To track cumulative rotation
  const optionInputRef = useRef(null);

  // Get current translation object
  const t = translations[lang] || translations["en"];

  // --- Effects ---

  // 1. Initial Load Effect (replaces window.onload)
  useEffect(() => {
    // Load options from localStorage
    const savedOptions = localStorage.getItem("decisionSpinnerOptions");
    if (savedOptions) {
      setOptions(JSON.parse(savedOptions));
    }

    const updateTheme = (themeParams) => {
      // Set CSS variables on the root element for all components to use
      const root = document.documentElement;
      root.style.setProperty(
        "--tg-theme-bg-color",
        themeParams.bg_color || "#ffffff"
      );
      root.style.setProperty(
        "--tg-theme-text-color",
        themeParams.text_color || "#000000"
      );
      root.style.setProperty(
        "--tg-theme-hint-color",
        themeParams.hint_color || "#999999"
      );
      root.style.setProperty(
        "--tg-theme-link-color",
        themeParams.link_color || "#007aff"
      );
      root.style.setProperty(
        "--tg-theme-button-color",
        themeParams.button_color || "#007aff"
      );
      root.style.setProperty(
        "--tg-theme-button-text-color",
        themeParams.button_text_color || "#ffffff"
      );
      root.style.setProperty(
        "--tg-theme-secondary-bg-color",
        themeParams.secondary_bg_color || "#f0f0f0"
      );
    };

    let telegramApp = null;
    try {
      telegramApp = window.Telegram.WebApp;
      telegramApp.ready();
      telegramApp.expand();
      setTg(telegramApp);

      // Apply initial theme
      updateTheme(telegramApp.themeParams);

      // Listen for theme changes
      telegramApp.onEvent("themeChanged", () =>
        updateTheme(telegramApp.themeParams)
      );
    } catch (e) {
      console.error(
        "Telegram WebApp script not found. Running in browser mode."
      );
      // Apply default theme if not in Telegram
      updateTheme({});
    }

    // Determine default language
    const browserLang = (
      telegramApp?.initDataUnsafe?.user?.language_code || navigator.language
    ).split("-")[0];
    let defaultLang = "en";

    if (translations.hasOwnProperty(browserLang)) {
      defaultLang = browserLang;
    }

    const savedLang =
      localStorage.getItem("decisionSpinnerLang") || defaultLang;
    setLang(savedLang);
  }, []); // Empty dependency array means this runs once on mount

  // 2. Draw Spinner Effect (runs when options or lang changes)
  useEffect(() => {
    const drawSpinner = () => {
      const canvas = canvasRef.current;
      if (!canvas || options.length === 0) return;

      const ctx = canvas.getContext("2d");
      const arc = Math.PI / (options.length / 2);

      const outsideRadius = 150;
      const textRadius = 110;
      const insideRadius = 0;
      const startAngle = 0; // Reset start angle for drawing

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.font = "bold 16px Inter, sans-serif";

      for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i % colors.length];

        ctx.beginPath();
        ctx.arc(160, 160, outsideRadius, angle, angle + arc, false);
        ctx.arc(160, 160, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(
          160 + Math.cos(angle + arc / 2) * textRadius,
          160 + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = options.length > 7 ? (i + 1).toString() : options[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }
    };

    drawSpinner();

    // Save options to localStorage whenever they change
    localStorage.setItem("decisionSpinnerOptions", JSON.stringify(options));
  }, [options, lang]); // Redraw if options or language changes

  // 3. Update document title when language changes
  useEffect(() => {
    document.title = t.title;
  }, [t.title]);

  // --- Handlers ---

  const handleAddOption = () => {
    const optionText = optionInputRef.current.value.trim();
    if (optionText && !options.includes(optionText)) {
      setOptions([...options, optionText]);
    }
    optionInputRef.current.value = "";
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddOption();
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  const handleSpin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setResult("");

    const randomSpins = Math.floor(Math.random() * 4) + 8;
    const degrees = randomSpins * 360 + Math.random() * 360;
    const totalRotation = spinRotationRef.current + degrees;
    spinRotationRef.current = totalRotation; // Update cumulative rotation

    const canvas = canvasRef.current;
    canvas.style.transition = "transform 4s cubic-bezier(0.25, 1, 0.5, 1)";
    canvas.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      const finalRotation = totalRotation % 360;
      const arcSize = 360 / options.length;
      const winningAngle = (360 - finalRotation + 270) % 360;
      const index = Math.floor(winningAngle / arcSize);

      setResult(options[index]);
      setIsSpinning(false);
    }, 4000); // Corresponds to the transition duration
  };

  // --- Gemini API ---

  const callGeminiApi = async (prompt, maxRetries = 3) => {
    const API_KEY = "AIzaSyD5z_90qKVlOebb0HEouZ3f-qtYJH7QctQ"; // Handled by the environment
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
      },
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
          const jsonText = result.candidates[0].content.parts[0].text;
          return JSON.parse(jsonText);
        } else {
          throw new Error("Invalid response structure from API.");
        }
      } catch (error) {
        console.error(`Gemini API call attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) return null;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
        );
      }
    }
  };

  const handleGeminiSuggestions = async () => {
    setGeminiLoading(true);
    let prompt;
    if (options.length > 0) {
      const optionsString = options.join(", ");
      prompt = t.geminiPrompt.replace("{OPTIONS}", optionsString);
    } else {
      prompt = t.geminiPromptEmpty;
    }

    try {
      const suggestions = await callGeminiApi(prompt);
      if (suggestions && Array.isArray(suggestions)) {
        const newOptions = suggestions.filter(
          (idea) =>
            typeof idea === "string" &&
            idea.trim().length > 0 &&
            !options.includes(idea.trim())
        );
        setOptions([...options, ...newOptions]);

        // Visual cue
        if (canvasRef.current) {
          canvasRef.current.style.transform = `${canvasRef.current.style.transform} scale(1.05)`;
          setTimeout(() => {
            if (canvasRef.current) {
              canvasRef.current.style.transform =
                canvasRef.current.style.transform.replace(" scale(1.05)", "");
            }
          }, 200);
        }
      } else {
        throw new Error("Failed to get valid suggestions.");
      }
    } catch (error) {
      console.error("Error handling Gemini suggestions:", error);
      if (tg) {
        tg.showPopup({ title: "Error", message: t.geminiError });
      } else {
        alert(t.geminiError);
      }
    } finally {
      setGeminiLoading(false);
    }
  };

  // --- Telegram Stars ---

  const requestDonation = async (amount) => {
    if (!tg) {
      alert("This feature is only available within Telegram.");
      return;
    }

    setStarsLoading(true);

    try {
      const response = await fetch(`${BOT_SERVER_URL}/create-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          initData: tg.initData,
        }),
      });

      if (!response.ok) throw new Error("Failed to create invoice.");

      const { invoiceUrl } = await response.json();

      tg.openInvoice(invoiceUrl, (status) => {
        if (status === "paid") {
          tg.showPopup({
            title: t.paymentSuccess,
            message: t.paymentSuccessMsg,
            buttons: [{ type: "ok" }],
          });
        } else if (status === "failed" || status === "cancelled") {
          tg.showPopup({
            title: t.paymentFailed,
            message: t.paymentFailedMsg,
            buttons: [{ type: "ok" }],
          });
        }
      });
    } catch (error) {
      console.error("Donation error:", error);
      tg.showPopup({
        title: "Error",
        message: "Could not connect to the server.",
      });
    } finally {
      setStarsLoading(false);
    }
  };

  // --- Render ---

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* --- STYLE DEFINITIONS --- */}
      <style>{`
                /* These classes apply theme-aware styles */
                .card {
                    background-color: var(--tg-theme-secondary-bg-color);
                }
                .input-field, .lang-select {
                    background-color: var(--tg-theme-bg-color);
                    color: var(--tg-theme-text-color);
                    border: 1px solid var(--tg-theme-hint-color);
                }
                /* Use theme color for Tailwind's focus ring */
                .focus\\:ring-indigo-500:focus {
                    --tw-ring-color: var(--tg-theme-button-color) !important;
                }
                .button-primary {
                    background-color: var(--tg-theme-button-color);
                    color: var(--tg-theme-button-text-color);
                }
                .button-secondary {
                    background-color: var(--tg-theme-secondary-bg-color);
                    color: var(--tg-theme-text-color);
                    border: 1px solid var(--tg-theme-hint-color);
                }
                .option-tag {
                    background-color: var(--tg-theme-secondary-bg-color);
                    color: var(--tg-theme-text-color);
                }
                /* Simple pointer arrow */
                .spinner-arrow {
                    width: 0; 
                    height: 0; 
                    border-left: 15px solid transparent; 
                    border-right: 15px solid transparent; 
                    border-top: 25px solid var(--tg-theme-button-color);
                }
            `}</style>

      {/* Language Selector */}
      <div className="w-full max-w-md mx-auto mb-4">
        <select
          id="lang-select"
          className="lang-select w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="en">English (English)</option>
          <option value="uk">Українська (Ukrainian)</option>
          <option value="es">Español (Spanish)</option>
          <option value="de">Deutsch (German)</option>
          <option value="fr">Français (French)</option>
          <option value="zh">中文 (Chinese)</option>
        </select>
      </div>

      <div className="card w-full max-w-md mx-auto rounded-2xl p-6 text-center">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--tg-theme-text-color, #111827)" }}
        >
          {t.heading}
        </h1>
        <p
          className="mb-6"
          style={{ color: "var(--tg-theme-hint-color, #6b7280)" }}
        >
          {t.subheading}
        </p>

        {/* Spinner Wheel */}
        <div className="relative w-80 h-80 mx-auto mb-6">
          <div className="spinner-arrow absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"></div>
          <canvas
            ref={canvasRef}
            id="spinner-canvas"
            width="320"
            height="320"
          ></canvas>
        </div>

        {/* Result Display */}
        <div
          className={`text-2xl font-semibold my-4 h-8 transition-opacity duration-300 ${
            result ? "opacity-100" : "opacity-0"
          }`}
        >
          {result || " "}
        </div>

        {/* Spin Button */}
        <button
          id="spin-btn"
          className="button-primary w-full font-bold py-3 px-4 rounded-lg text-lg transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSpin}
          disabled={isSpinning || options.length < 2}
        >
          {t.spinButton}
        </button>

        {/* Option Input */}
        <div className="mt-6">
          <div className="flex gap-2">
            <input
              type="text"
              id="option-input"
              ref={optionInputRef}
              className="input-field flex-grow rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t.placeholder}
              onKeyPress={handleInputKeyPress}
            />
            <button
              id="add-btn"
              className="button-secondary font-bold py-2 px-4 rounded-lg transition-transform transform active:scale-95"
              onClick={handleAddOption}
            >
              {t.addButton}
            </button>
          </div>

          {/* Gemini Feature */}
          <button
            id="gemini-btn"
            className="button-primary w-full font-bold py-2 px-4 rounded-lg text-sm mt-2 flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
            onClick={handleGeminiSuggestions}
            disabled={geminiLoading}
          >
            ✨ <span>{t.geminiButton}</span>
          </button>
          {geminiLoading && (
            <div
              className="text-sm mt-2"
              style={{ color: "var(--tg-theme-hint-color, #6b7280)" }}
            >
              {t.geminiLoading}
            </div>
          )}
        </div>

        {/* Options Display: Conditional Rendering */}
        {options.length <= 7 ? (
          <div
            id="options-container"
            className="mt-4 flex flex-wrap justify-center gap-2"
          >
            {options.map((option, index) => (
              <div
                key={index}
                className="option-tag rounded-full px-3 py-1 flex items-center gap-2"
                style={{
                  backgroundColor:
                    "var(--tg-theme-secondary-bg-color, #e5e7eb)",
                  color: "var(--tg-theme-text-color, #374151)",
                }}
              >
                <span>{option}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveOption(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            id="options-legend"
            className="mt-4 text-left w-full max-h-40 overflow-y-auto"
          >
            <ol className="list-decimal list-inside space-y-1">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center"
                  style={{ color: "var(--tg-theme-text-color, #374151)" }}
                >
                  <span className="truncate pr-2">{option}</span>
                  <button
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                    onClick={() => handleRemoveOption(index)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Telegram Stars Donation Section */}
      {tg && (
        <div className="card w-full max-w-md mx-auto rounded-2xl p-6 text-center mt-4">
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: "var(--tg-theme-text-color, #111827)" }}
          >
            {t.supportTitle}
          </h2>
          <p
            className="mb-4"
            style={{ color: "var(--tg-theme-hint-color, #6b7280)" }}
          >
            {t.supportSub}
          </p>
          {starsLoading && <div>Loading...</div>}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => requestDonation(100)}
              className="button-secondary p-3 rounded-lg text-sm"
              disabled={starsLoading}
            >
              ☕ 100 Stars
            </button>
            <button
              onClick={() => requestDonation(500)}
              className="button-secondary p-3 rounded-lg text-sm"
              disabled={starsLoading}
            >
              🚀 500 Stars
            </button>
          </div>
        </div>
      )}

      <footer
        className="mt-8 text-center text-sm"
        style={{ color: "var(--tg-theme-hint-color, #6b7280)" }}
      >
        {/* <p>{t.footer}</p> */}
      </footer>
    </div>
  );
}
