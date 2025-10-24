import React, { useState, useEffect, useRef } from "react";

// --- Constants ---
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
// Ensure this matches your actual deployed bot server URL
const BOT_SERVER_URL = "https://your-vps-domain.com"; // ** IMPORTANT: Update this **

// --- React Component ---
export function SpinnerPage() {
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
  const [themeParams, setThemeParams] = useState({});

  // --- Refs ---
  const canvasRef = useRef(null);
  const spinRotationRef = useRef(0);
  const optionInputRef = useRef(null);

  // Get current translation object
  const t = translations[lang] || translations["en"];

  // --- Helper function to apply CSS variables ---
  const applyCssVariables = (params) => {
    console.log("Applying CSS variables with params:", params);
    const root = document.documentElement;
    root.style.setProperty("--tg-theme-bg-color", params.bg_color || "#ffffff");
    root.style.setProperty(
      "--tg-theme-text-color",
      params.text_color || "#000000"
    );
    root.style.setProperty(
      "--tg-theme-hint-color",
      params.hint_color || "#999999"
    );
    root.style.setProperty(
      "--tg-theme-link-color",
      params.link_color || "#007aff"
    );
    root.style.setProperty(
      "--tg-theme-button-color",
      params.button_color || "#007aff"
    );
    root.style.setProperty(
      "--tg-theme-button-text-color",
      params.button_text_color || "#ffffff"
    );
    root.style.setProperty(
      "--tg-theme-secondary-bg-color",
      params.secondary_bg_color || "#f0f0f0"
    );
    document.body.style.backgroundColor = params.bg_color || "#ffffff";
  };

  // --- Effects ---

  // 1. Initial Load & Telegram Setup Effect
  useEffect(() => {
    console.log("SpinnerPage useEffect running...");

    // Load options from localStorage
    const savedOptions = localStorage.getItem("decisionSpinnerOptions");
    if (savedOptions) {
      try {
        const parsedOptions = JSON.parse(savedOptions);
        if (Array.isArray(parsedOptions) && parsedOptions.length > 0) {
          setOptions(parsedOptions);
        }
      } catch (e) {
        console.error("Failed to parse saved options:", e);
        localStorage.removeItem("decisionSpinnerOptions");
      }
    }

    // --- Telegram Integration ---
    let telegramApp = null;
    let isTelegramEnv = false; // Flag to track if we successfully init TG

    if (window.Telegram && window.Telegram.WebApp) {
      console.log("window.Telegram.WebApp found!");
      telegramApp = window.Telegram.WebApp;
      try {
        console.log("Calling telegramApp.ready()...");
        telegramApp.ready();
        console.log("Telegram WebApp is ready.");
        console.log("Initial Telegram Platform:", telegramApp.platform);

        setTg(telegramApp);
        setThemeParams(telegramApp.themeParams);
        applyCssVariables(telegramApp.themeParams);
        isTelegramEnv = true; // Mark as initialized

        const updateTheme = () => {
          console.log("themeChanged event received");
          setThemeParams(telegramApp.themeParams);
          applyCssVariables(telegramApp.themeParams);
        };
        telegramApp.onEvent("themeChanged", updateTheme);

        telegramApp.BackButton.show();
        const handleBackButtonClick = () => {
          console.log("Telegram Back Button clicked");
          window.history.back();
        };
        telegramApp.BackButton.onClick(handleBackButtonClick);

        // Cleanup
        return () => {
          console.log("Cleaning up SpinnerPage useEffect...");
          telegramApp.offEvent("themeChanged", updateTheme);
          if (telegramApp.BackButton.isVisible) {
            telegramApp.BackButton.offClick(handleBackButtonClick);
            telegramApp.BackButton.hide();
          }
        };
      } catch (e) {
        console.error("Error initializing Telegram WebApp:", e);
        // Fall through to browser mode styling if init fails
        setThemeParams({});
        applyCssVariables({});
      }
    }

    // If not initialized immediately, try after a delay
    if (!isTelegramEnv) {
      setTimeout(() => {
        if (window.Telegram && window.Telegram.WebApp && !tg) {
          // Check !tg to avoid re-init
          console.log("window.Telegram.WebApp found after delay!");
          telegramApp = window.Telegram.WebApp;
          try {
            telegramApp.ready();
            setTg(telegramApp);
            setThemeParams(telegramApp.themeParams);
            applyCssVariables(telegramApp.themeParams);
            console.log("Delayed Initial Platform:", telegramApp.platform);
            // Note: Can't set up listeners/cleanup in setTimeout easily
          } catch (e) {
            console.error("Error during delayed Telegram init:", e);
            if (!tg) applyCssVariables({}); // Only apply defaults if still not set
          }
        } else if (!tg) {
          // Only log/style if still not set
          console.warn(
            "Telegram WebApp script not found even after delay. Running in browser mode."
          );
          applyCssVariables({});
        }
      }, 500);
    }

    // Determine default language
    // Use tg state variable now, as it might be set after delay
    const currentTg = tg || telegramApp; // Use whichever is available
    const browserLang = (
      currentTg?.initDataUnsafe?.user?.language_code || navigator.language
    ).split("-")[0];
    let defaultLang = "en";
    if (translations.hasOwnProperty(browserLang)) {
      defaultLang = browserLang;
    }
    const savedLang =
      localStorage.getItem("decisionSpinnerLang") || defaultLang;
    setLang(savedLang);
    console.log("Language set to:", savedLang);
  }, [tg]); // Rerun effect slightly if tg is set after delay

  // 2. Draw Spinner Effect
  useEffect(() => {
    const drawSpinner = () => {
      const canvas = canvasRef.current;
      if (!canvas || options.length === 0) return;

      const ctx = canvas.getContext("2d");
      const numOptions = options.length;
      const arc = Math.PI / (numOptions / 2);

      const outsideRadius = 150;
      const textRadius = 110;
      const insideRadius = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentSecondaryBg = themeParams.secondary_bg_color || "#f0f0f0";
      const currentBtnTextColor = themeParams.button_text_color || "#ffffff";
      const currentHintColor = themeParams.hint_color || "#999999";

      ctx.strokeStyle = currentHintColor;
      ctx.lineWidth = 1;
      ctx.font = "bold 16px Inter, sans-serif";

      for (let i = 0; i < numOptions; i++) {
        const angle = i * arc;
        ctx.fillStyle = colors[i % colors.length];

        ctx.beginPath();
        ctx.arc(160, 160, outsideRadius, angle, angle + arc, false);
        ctx.arc(160, 160, insideRadius, angle + arc, angle, true);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = currentBtnTextColor;
        ctx.translate(
          160 + Math.cos(angle + arc / 2) * textRadius,
          160 + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = numOptions > 7 ? (i + 1).toString() : options[i];
        const maxTextWidth = arc * textRadius * 0.85;
        let displayText = text;

        let fontSize = 16;
        if (numOptions <= 10) {
          while (
            ctx.measureText(displayText).width > maxTextWidth &&
            fontSize > 10
          ) {
            fontSize -= 1;
            ctx.font = `bold ${fontSize}px Inter, sans-serif`;
            if (ctx.measureText(text).width > maxTextWidth && text.length > 5) {
              displayText =
                text.substring(
                  0,
                  Math.floor(
                    (text.length * maxTextWidth) / ctx.measureText(text).width
                  ) - 1
                ) + "…";
            } else {
              displayText = text;
            }
          }
        } else if (
          ctx.measureText(displayText).width > maxTextWidth &&
          text.length > 5
        ) {
          displayText =
            text.substring(
              0,
              Math.floor(
                (text.length * maxTextWidth) / ctx.measureText(text).width
              ) - 1
            ) + "…";
        }

        ctx.fillText(displayText, -ctx.measureText(displayText).width / 2, 0);
        ctx.restore();
        ctx.font = "bold 16px Inter, sans-serif";
      }
    };

    drawSpinner();

    if (options.length > 0 || localStorage.getItem("decisionSpinnerOptions")) {
      localStorage.setItem("decisionSpinnerOptions", JSON.stringify(options));
    }
  }, [options, lang, themeParams]);

  // 3. Update document title
  useEffect(() => {
    document.title = t.title;
    localStorage.setItem("decisionSpinnerLang", lang);
  }, [t.title, lang]);

  // --- Handlers (handleAddOption, handleInputKeyPress, handleRemoveOption, handleSpin) ---
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
    const degrees = Math.random() * 360;
    const totalDegrees = randomSpins * 360 + degrees;

    const newVisualRotation = spinRotationRef.current + totalDegrees;
    spinRotationRef.current = newVisualRotation % 360;

    const canvas = canvasRef.current;
    canvas.style.transition = "transform 4.5s cubic-bezier(0.1, 1, 0.3, 1)";
    canvas.style.transform = `rotate(${newVisualRotation}deg)`;

    setTimeout(() => {
      const finalAngle = newVisualRotation % 360;
      const arcSize = 360 / options.length;
      const winningAngle = (360 - finalAngle + 270) % 360;
      const index = Math.floor(winningAngle / arcSize);

      setResult(options[index]);
      setIsSpinning(false);
      tg?.HapticFeedback.notificationOccurred("success");
    }, 4500);
  };

  // --- Gemini API (callGeminiApi, handleGeminiSuggestions) ---
  const callGeminiApi = async (prompt, maxRetries = 3) => {
    const API_KEY = ""; // Handled by the environment
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
          console.error("Invalid response structure:", result);
          throw new Error("Invalid response structure from API.");
        }
      } catch (error) {
        console.error(`Gemini API call attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) return null;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
    return null;
  };

  const handleGeminiSuggestions = async () => {
    setGeminiLoading(true);
    tg?.MainButton.showProgress();
    let prompt;
    if (options.length > 0) {
      const optionsString = options.slice(0, 15).join(", ");
      prompt = t.geminiPrompt.replace("{OPTIONS}", optionsString);
    } else {
      prompt = t.geminiPromptEmpty;
    }

    try {
      const suggestions = await callGeminiApi(prompt);
      if (suggestions && Array.isArray(suggestions)) {
        const newOptions = suggestions
          .map((idea) => (typeof idea === "string" ? idea.trim() : ""))
          .filter((idea) => idea.length > 0 && idea.length < 50)
          .filter(
            (idea) =>
              !options.some((opt) => opt.toLowerCase() === idea.toLowerCase())
          );

        if (newOptions.length > 0) {
          setOptions((prevOptions) => [
            ...prevOptions,
            ...newOptions.slice(0, 5),
          ]);
        } else {
          if (tg)
            tg.showPopup({
              title: "Info",
              message: "No new unique suggestions found.",
            });
          else alert("No new unique suggestions found.");
        }

        if (canvasRef.current) {
          canvasRef.current.style.transform = `${
            canvasRef.current.style.transform || ""
          } scale(1.05)`;
          setTimeout(() => {
            if (canvasRef.current) {
              canvasRef.current.style.transform =
                canvasRef.current.style.transform.replace(" scale(1.05)", "");
            }
          }, 200);
        }
      } else {
        throw new Error(
          "Failed to get valid suggestions or all retries failed."
        );
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
      tg?.MainButton.hideProgress();
    }
  };

  // --- Telegram Stars (requestDonation) ---
  const requestDonation = async (amount) => {
    if (!tg || !tg.initData) {
      console.warn(
        "Telegram WebApp context not available or initData missing."
      );
      alert("This feature is only available within Telegram.");
      return;
    }

    setStarsLoading(true);
    tg.MainButton.showProgress();

    try {
      const response = await fetch(`${BOT_SERVER_URL}/create-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, initData: tg.initData }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Invoice creation failed:", response.status, errorBody);
        throw new Error(`Failed to create invoice. Status: ${response.status}`);
      }
      const { invoiceUrl } = await response.json();
      if (!invoiceUrl)
        throw new Error("Received empty invoice URL from server.");

      tg.openInvoice(invoiceUrl, (status) => {
        setStarsLoading(false);
        tg.MainButton.hideProgress();
        if (status === "paid") {
          tg.showPopup({
            title: t.paymentSuccess,
            message: t.paymentSuccessMsg,
            buttons: [{ type: "ok" }],
          });
          tg.HapticFeedback.notificationOccurred("success");
        } else if (status === "failed") {
          tg.showPopup({
            title: t.paymentFailed,
            message: t.paymentFailedMsg + " (Failed)",
            buttons: [{ type: "ok" }],
          });
          tg.HapticFeedback.notificationOccurred("error");
        } else if (status === "cancelled") {
          tg.HapticFeedback.notificationOccurred("warning");
        } else {
          console.warn("Unexpected invoice status:", status);
          tg.HapticFeedback.notificationOccurred("warning");
        }
      });
    } catch (error) {
      console.error("Donation error:", error);
      tg.showPopup({
        title: "Error",
        message: `Could not process donation: ${error.message}`,
      });
      setStarsLoading(false);
      tg.MainButton.hideProgress();
      tg.HapticFeedback.notificationOccurred("error");
    }
  };

  // --- Render ---
  console.log("Rendering SpinnerPage. tg:", tg, "tg.platform:", tg?.platform);
  // Restore original, correct condition
  const shouldRenderStars = tg && tg.platform !== "unknown";
  console.log("Should render Stars section?", shouldRenderStars);

  return (
    <React.Fragment>
      {/* --- STYLE DEFINITIONS --- */}
      <style>{`
                /* ... (styles remain the same) ... */
                body {
                    background-color: var(--tg-theme-bg-color, #ffffff);
                }
                .card {
                    background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
                    color: var(--tg-theme-text-color, #000000);
                }
                .input-field, .lang-select {
                    background-color: var(--tg-theme-bg-color, #ffffff);
                    color: var(--tg-theme-text-color, #000000);
                    border: 1px solid var(--tg-theme-hint-color, #999999);
                }
                 .lang-select:focus, .input-field:focus { /* Basic focus outline */
                     outline: 2px solid var(--tg-theme-button-color, #007aff);
                     outline-offset: 1px;
                 }
                .button-primary {
                    background-color: var(--tg-theme-button-color, #007aff);
                    color: var(--tg-theme-button-text-color, #ffffff);
                }
                 .button-primary:disabled {
                     opacity: 0.6;
                     cursor: not-allowed;
                 }
                .button-secondary {
                    background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
                    color: var(--tg-theme-text-color, #000000);
                    border: 1px solid var(--tg-theme-hint-color, #999999);
                }
                 .button-secondary:disabled {
                    opacity: 0.6; /* Dim disabled secondary buttons */
                    cursor: not-allowed;
                 }
                .option-tag {
                    background-color: var(--tg-theme-bg-color, #ffffff);
                    color: var(--tg-theme-text-color, #000000);
                    border: 1px solid var(--tg-theme-hint-color, #999999);
                }
                .spinner-arrow {
                    width: 0;
                    height: 0;
                    border-left: 15px solid transparent;
                    border-right: 15px solid transparent;
                    border-top: 25px solid var(--tg-theme-button-color, #007aff);
                }
                #options-legend ol li {
                     color: var(--tg-theme-text-color, #000000);
                }
                #options-legend {
                     background-color: var(--tg-theme-bg-color, #ffffff);
                     border-color: var(--tg-theme-hint-color, #999999);
                }
                /* Ensure Tailwind focus rings use theme color */
                .focus\\:ring-indigo-500:focus {
                     --tw-ring-color: var(--tg-theme-button-color, #007aff);
                     box-shadow: 0 0 0 2px var(--tw-ring-color); /* Manual ring for better compatibility */
                     outline: none; /* Remove default outline */
                }
            `}</style>

      <div
        className="flex flex-col items-center justify-start min-h-screen p-4 pt-8 overflow-x-hidden"
        style={{ backgroundColor: "var(--tg-theme-bg-color)" }}
      >
        {/* Language Selector */}
        <div className="w-full max-w-md mx-auto mb-4">
          <select
            id="lang-select"
            className="lang-select w-full rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
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

        {/* Main Card */}
        <div className="card w-full max-w-md mx-auto rounded-2xl p-6 text-center shadow-lg mb-4">
          <h1 className="text-3xl font-bold mb-2">{t.heading}</h1>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--tg-theme-hint-color)" }}
          >
            {t.subheading}
          </p>

          {/* Spinner Wheel */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-6">
            <div className="spinner-arrow absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"></div>
            <canvas
              ref={canvasRef}
              id="spinner-canvas"
              width="320"
              height="320"
              className="transition-transform duration-[4500ms]"
              style={{ transformOrigin: "center center" }}
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
            className="button-primary w-full font-bold py-3 px-4 rounded-lg text-lg transition transform active:scale-95 disabled:opacity-60 shadow-md"
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
                className="input-field flex-grow rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                placeholder={t.placeholder}
                onKeyPress={handleInputKeyPress}
              />
              <button
                id="add-btn"
                className="button-secondary font-bold py-2 px-4 rounded-lg transition transform active:scale-95"
                onClick={handleAddOption}
              >
                {t.addButton}
              </button>
            </div>

            {/* Gemini Feature */}
            <button
              id="gemini-btn"
              className="button-primary w-full font-bold py-2 px-4 rounded-lg text-sm mt-3 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-60 shadow-sm"
              onClick={handleGeminiSuggestions}
              disabled={geminiLoading}
            >
              {geminiLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "✨"
              )}
              <span>{geminiLoading ? t.geminiLoading : t.geminiButton}</span>
            </button>
          </div>

          {/* Options Display */}
          <div className="mt-4 w-full">
            {options.length <= 7 ? (
              <div
                id="options-container"
                className="flex flex-wrap justify-center gap-2"
              >
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="option-tag rounded-full px-3 py-1 flex items-center gap-2 text-sm"
                  >
                    <span className="truncate max-w-[100px]">{option}</span>
                    <button
                      className="text-red-500 hover:text-red-700 font-bold leading-none"
                      onClick={() => handleRemoveOption(index)}
                      aria-label={`Remove ${option}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                id="options-legend"
                className="text-left w-full max-h-32 overflow-y-auto border rounded-lg p-2"
              >
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {options.map((option, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center group"
                    >
                      <span className="truncate pr-2">
                        {index + 1}. {option}
                      </span>
                      <button
                        className="text-red-400 hover:text-red-600 font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity px-1"
                        onClick={() => handleRemoveOption(index)}
                        aria-label={`Remove ${option}`}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Telegram Stars Donation Section */}
        {/* Restore original condition */}
        {tg && tg.platform !== "unknown" && (
          <div className="card w-full max-w-md mx-auto rounded-2xl p-6 text-center mt-4 shadow-lg mb-4">
            <h2 className="text-xl font-bold mb-1">{t.supportTitle}</h2>
            <p
              className="mb-4 text-sm"
              style={{ color: "var(--tg-theme-hint-color)" }}
            >
              {t.supportSub}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => requestDonation(100)}
                className="button-secondary p-3 rounded-lg text-sm transition transform active:scale-95 disabled:opacity-60"
                disabled={starsLoading}
              >
                {starsLoading ? "..." : "☕ 100 ✨"}
              </button>
              <button
                onClick={() => requestDonation(500)}
                className="button-secondary p-3 rounded-lg text-sm transition transform active:scale-95 disabled:opacity-60"
                disabled={starsLoading}
              >
                {starsLoading ? "..." : "🚀 500 ✨"}
              </button>
            </div>
          </div>
        )}

        <footer
          className="mt-4 text-center text-xs"
          style={{ color: "var(--tg-theme-hint-color)" }}
        >
          <p>{t.footer}</p>
        </footer>
      </div>
    </React.Fragment>
  );
}
