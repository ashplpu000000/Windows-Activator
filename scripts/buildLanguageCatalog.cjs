const fs = require('fs');
const https = require('https');

const popularMeta = [
  { code: 'en', iso3: 'eng', englishName: 'English', nativeName: 'English', flag: '🇺🇸', region: 'International', rtl: false },
  { code: 'bn', iso3: 'ben', englishName: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'South Asia', rtl: false },
  { code: 'es', iso3: 'spa', englishName: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Americas & Europe', rtl: false },
  { code: 'hi', iso3: 'hin', englishName: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'South Asia', rtl: false },
  { code: 'zh', iso3: 'zho', englishName: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', region: 'East Asia', rtl: false },
  { code: 'zh-TW', iso3: 'zho', englishName: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', region: 'East Asia', rtl: false },
  { code: 'fr', iso3: 'fra', englishName: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Europe & Africa', rtl: false },
  { code: 'de', iso3: 'deu', englishName: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europe', rtl: false },
  { code: 'it', iso3: 'ita', englishName: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europe', rtl: false },
  { code: 'pt', iso3: 'por', englishName: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Americas & Europe', rtl: false },
  { code: 'ru', iso3: 'rus', englishName: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Eurasia', rtl: false },
  { code: 'ja', iso3: 'jpn', englishName: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'East Asia', rtl: false },
  { code: 'ko', iso3: 'kor', englishName: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'East Asia', rtl: false },
  { code: 'ar', iso3: 'ara', englishName: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East & Africa', rtl: true },
  { code: 'tr', iso3: 'tur', englishName: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Middle East & Europe', rtl: false },
  { code: 'vi', iso3: 'vie', englishName: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Southeast Asia', rtl: false },
  { code: 'id', iso3: 'ind', englishName: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Southeast Asia', rtl: false },
  { code: 'ms', iso3: 'msa', englishName: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Southeast Asia', rtl: false },
  { code: 'th', iso3: 'tha', englishName: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Southeast Asia', rtl: false },
  { code: 'tl', iso3: 'tgl', englishName: 'Filipino / Tagalog', nativeName: 'Tagalog', flag: '🇵🇭', region: 'Southeast Asia', rtl: false },
  { code: 'ur', iso3: 'urd', englishName: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', region: 'South Asia', rtl: true },
  { code: 'ta', iso3: 'tam', englishName: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'South Asia', rtl: false },
  { code: 'te', iso3: 'tel', englishName: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'South Asia', rtl: false },
  { code: 'mr', iso3: 'mar', englishName: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'South Asia', rtl: false },
  { code: 'fa', iso3: 'fas', englishName: 'Persian / Farsi', nativeName: 'فارسی', flag: '🇮🇷', region: 'Middle East', rtl: true },
  { code: 'he', iso3: 'heb', englishName: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Middle East', rtl: true },
  { code: 'uk', iso3: 'ukr', englishName: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Europe', rtl: false },
  { code: 'pl', iso3: 'pol', englishName: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Europe', rtl: false },
  { code: 'nl', iso3: 'nld', englishName: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Europe', rtl: false },
  { code: 'sv', iso3: 'swe', englishName: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Northern Europe', rtl: false },
  { code: 'no', iso3: 'nor', englishName: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Northern Europe', rtl: false },
  { code: 'da', iso3: 'dan', englishName: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Northern Europe', rtl: false },
  { code: 'fi', iso3: 'fin', englishName: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Northern Europe', rtl: false },
  { code: 'el', iso3: 'ell', englishName: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Southern Europe', rtl: false },
  { code: 'cs', iso3: 'ces', englishName: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Central Europe', rtl: false },
  { code: 'sk', iso3: 'slk', englishName: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', region: 'Central Europe', rtl: false },
  { code: 'hu', iso3: 'hun', englishName: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Central Europe', rtl: false },
  { code: 'ro', iso3: 'ron', englishName: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Eastern Europe', rtl: false },
  { code: 'bg', iso3: 'bul', englishName: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', region: 'Eastern Europe', rtl: false },
  { code: 'ca', iso3: 'cat', englishName: 'Catalan', nativeName: 'Català', flag: '🇪🇸', region: 'Southern Europe', rtl: false },
  { code: 'lt', iso3: 'lit', englishName: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', region: 'Northern Europe', rtl: false },
  { code: 'sl', iso3: 'slv', englishName: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', region: 'Central Europe', rtl: false },
  { code: 'lv', iso3: 'lav', englishName: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', region: 'Northern Europe', rtl: false },
  { code: 'et', iso3: 'est', englishName: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', region: 'Northern Europe', rtl: false },
  { code: 'af', iso3: 'afr', englishName: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', region: 'Southern Africa', rtl: false },
  { code: 'sw', iso3: 'swa', englishName: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'East Africa', rtl: false },
  { code: 'sr', iso3: 'srp', englishName: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', region: 'Southern Europe', rtl: false },
  { code: 'hr', iso3: 'hrv', englishName: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', region: 'Southern Europe', rtl: false },
  { code: 'eu', iso3: 'eus', englishName: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', region: 'Southern Europe', rtl: false },
  { code: 'gl', iso3: 'glg', englishName: 'Galician', nativeName: 'Galego', flag: '🇪🇸', region: 'Southern Europe', rtl: false }
];

https.get("https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    const lines = data.split("\n");
    const list = [];
    const seen = new Set();

    // 1. Add popular languages first
    for (const item of popularMeta) {
      list.push({
        code: item.code,
        iso3: item.iso3,
        englishName: item.englishName,
        nativeName: item.nativeName,
        region: item.region,
        flag: item.flag,
        rtl: item.rtl,
        popular: true
      });
      seen.add(item.code.toLowerCase());
      seen.add(item.iso3.toLowerCase());
    }

    // 2. Add all ISO 639-3 languages
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split("\t");
      if (parts.length >= 7) {
        const iso3 = parts[0].trim();
        const iso1 = parts[3].trim();
        const scope = parts[4].trim();
        const type = parts[5].trim();
        const refName = parts[6].trim();
        if (!iso3 || !refName) continue;

        const effectiveCode = iso1 || iso3;
        if (seen.has(effectiveCode.toLowerCase()) || seen.has(iso3.toLowerCase())) {
          continue;
        }
        seen.add(effectiveCode.toLowerCase());
        seen.add(iso3.toLowerCase());

        let typeLabel = "Living Language";
        let flag = "🌐";
        if (type === "E") { typeLabel = "Extinct Language"; flag = "📜"; }
        else if (type === "A") { typeLabel = "Ancient Language"; flag = "🏛️"; }
        else if (type === "H") { typeLabel = "Historical Language"; flag = "📜"; }
        else if (type === "C") { typeLabel = "Constructed Language"; flag = "🧩"; }

        list.push({
          code: effectiveCode,
          iso3: iso3,
          englishName: refName,
          nativeName: refName,
          region: typeLabel,
          flag: flag,
          rtl: false,
          popular: false
        });
      }
    }

    console.log("Re-generated languages count:", list.length);
    fs.writeFileSync("src/data/allLanguages.json", JSON.stringify(list));
    console.log("Successfully updated src/data/allLanguages.json");
  });
});
