/* ================================
URBANPIPER GEO REDIRECT ENGINE
================================ */

var run_redirect = true;

/* Load GEO script if not loaded */

if (!document.querySelector('script[src="https://country-check.urbanpiper.workers.dev/script.js"]')) {
  var geodata_script = document.createElement("script");
  geodata_script.src = "https://country-check.urbanpiper.workers.dev/script.js";
  document.head.appendChild(geodata_script);
}


/* ================================
REDIRECT ENTRY
================================ */

var url = new URL(window.location.href);

if (
  url.href.includes("utm_") ||
  url.href.includes("urbanpipervscompetidores") ||
  url.href.includes("urbanpiper-versus-otherpossystems")
) {
  // no redirect
} else {
  if (run_redirect && window.location.pathname === "/") {
    var source = getWithExpiry("source") || "";
    var country = getWithExpiry("country") || "";
    var lang = getWithExpiry("lang") || "";

    RedirectbyLoc(source, country, lang);
  }
}


/* ================================
REDIRECT FUNCTION
================================ */

function RedirectbyLoc(source = "", country = "", lang = "") {

  var loc = getLoc(window.GEO_DATA?.country || "", country, lang);
  var toUrl = "/";

  if (loc === "us") toUrl = "/us";
  if (loc === "uk") toUrl = "/uk";
  if (loc === "fr") toUrl = "/fr";
  if (loc === "es") toUrl = "/es";
  if (loc === "ae") toUrl = "/en-ae";
  if (loc === "ar-ae") toUrl = "/ar-ae";
  if (loc === "kw") toUrl = "/en-kw";
  if (loc === "ar-kw") toUrl = "/ar-kw";
  if (loc === "qa") toUrl = "/en-qa";
  if (loc === "ar-qa") toUrl = "/ar-qa";
  if (loc === "bh") toUrl = "/en-bh";
  if (loc === "ar-bh") toUrl = "/ar-bh";
  if (loc === "eg") toUrl = "/en-eg";
  if (loc === "ar-eg") toUrl = "/ar-eg";
  if (loc === "ar-sa") toUrl = "/ar-sa";

  if (window.location.pathname !== toUrl) {
    window.location.href = toUrl;
  }
}


/* ================================
LOCATION MAPPING
================================ */

function getLoc(country_code, country = "", lang = "") {

  if (country_code === "US" || country === "us") return "us";
  if (country_code === "GB" || country === "uk") return "uk";
  if (country_code === "FR" || country === "fr") return "fr";
  if (country === "mx" || country === "co" || country === "cl") return "es";

  if (country === "ae" && lang === "en") return "ae";
  if (country === "ae" && lang === "ar") return "ar-ae";

  if (country === "kw" && lang === "en") return "kw";
  if (country === "kw" && lang === "ar") return "ar-kw";

  if (country === "qa" && lang === "en") return "qa";
  if (country === "qa" && lang === "ar") return "ar-qa";

  if (country === "bh" && lang === "en") return "bh";
  if (country === "bh" && lang === "ar") return "ar-bh";

  if (country === "eg" && lang === "en") return "eg";
  if (country === "eg" && lang === "ar") return "ar-eg";

  return "main";
}


/* ================================
LOCAL STORAGE HELPERS
================================ */

function setWithExpiry(key, value, ttl) {

  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl
  };

  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {

  const itemStr = localStorage.getItem(key);

  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {

    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}
