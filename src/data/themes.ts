import { ThemePreset } from '../types';
import { extendedThemes } from './themesExtended';

// Curated themes across 26 distinct collections totaling exactly 1,500 themes (500 base + 1,000 extended)
const rawThemes: ThemePreset[] = [];

// Helper to push theme
const addTheme = (
  id: string,
  name: string,
  category: string,
  mode: 'light' | 'dark',
  previewColor: string,
  accentColor: string,
  accentHover: string,
  bgGradient: string,
  windowBg: string,
  headerBg: string,
  cardBg: string,
  textColor: string,
  secondaryText: string,
  borderCol: string,
) => {
  rawThemes.push({
    id,
    name,
    category,
    mode,
    previewColor,
    accentColor,
    accentHover,
    bgGradient,
    windowBg,
    headerBg,
    cardBg,
    textColor,
    secondaryText,
    borderCol,
  });
};

// 1. Windows Heritage (25 Themes)
const winHeritageList = [
  { id: 'win11_mica_dark', name: 'Windows 11 Mica Dark', mode: 'dark' as const, color: '#0078d4', bg: 'linear-gradient(135deg, #181c24, #12141a)', win: '#20222a', head: '#272932', card: '#2b2d38' },
  { id: 'win11_mica_light', name: 'Windows 11 Mica Light', mode: 'light' as const, color: '#0067b8', bg: 'linear-gradient(135deg, #edf2f7, #e2e8f0)', win: '#f8fafc', head: '#ffffff', card: '#ffffff' },
  { id: 'win10_acrylic_dark', name: 'Windows 10 Acrylic Dark', mode: 'dark' as const, color: '#0078d7', bg: 'linear-gradient(135deg, #171717, #0a0a0a)', win: '#1f1f1f', head: '#252525', card: '#2d2d2d' },
  { id: 'win10_light_default', name: 'Windows 10 Light Theme', mode: 'light' as const, color: '#005a9e', bg: 'linear-gradient(135deg, #f3f3f3, #e5e5e5)', win: '#ffffff', head: '#f7f7f7', card: '#fbfbfb' },
  { id: 'win8_metro_blue', name: 'Windows 8 Metro Ocean', mode: 'dark' as const, color: '#0097a7', bg: 'linear-gradient(135deg, #0d324d, #7f5a83)', win: '#1a2238', head: '#232b42', card: '#2a3450' },
  { id: 'win8_metro_purple', name: 'Windows 8 Metro Plum', mode: 'dark' as const, color: '#9c27b0', bg: 'linear-gradient(135deg, #2b0938, #180520)', win: '#240830', head: '#310b42', card: '#3e0e54' },
  { id: 'win7_aero_glass', name: 'Windows 7 Aero Glass', mode: 'light' as const, color: '#1e88e5', bg: 'linear-gradient(135deg, #c2e9fb, #a1c4fd)', win: '#ffffff', head: '#e8f4fc', card: '#f0f8ff' },
  { id: 'win7_aero_dark', name: 'Windows 7 Aero Night', mode: 'dark' as const, color: '#29b6f6', bg: 'linear-gradient(135deg, #102030, #0a121c)', win: '#142538', head: '#1a324b', card: '#203c5a' },
  { id: 'win7_basic_slate', name: 'Windows 7 Basic Slate', mode: 'light' as const, color: '#455a64', bg: 'linear-gradient(135deg, #cfd8dc, #eceff1)', win: '#f5f7f8', head: '#ffffff', card: '#ffffff' },
  { id: 'vista_aurora', name: 'Windows Vista Aurora', mode: 'dark' as const, color: '#00b0ff', bg: 'linear-gradient(135deg, #001f3f, #003366, #001122)', win: '#0d2238', head: '#122e4c', card: '#183b60' },
  { id: 'xp_luna_blue', name: 'Windows XP Luna Blue', mode: 'light' as const, color: '#0b5bca', bg: 'linear-gradient(135deg, #245edb, #3b82f6)', win: '#f0f4fc', head: '#245edb', card: '#ffffff' },
  { id: 'xp_silver', name: 'Windows XP Silver', mode: 'light' as const, color: '#546e7a', bg: 'linear-gradient(135deg, #b0bec5, #cfd8dc)', win: '#eceff1', head: '#dfe4e7', card: '#ffffff' },
  { id: 'xp_royale', name: 'Windows XP Royale Energy', mode: 'light' as const, color: '#1565c0', bg: 'linear-gradient(135deg, #1976d2, #64b5f6)', win: '#f4f8fc', head: '#1e88e5', card: '#ffffff' },
  { id: 'xp_zune_dark', name: 'Windows XP Zune Noir', mode: 'dark' as const, color: '#f4511e', bg: 'linear-gradient(135deg, #212121, #141414)', win: '#2a2a2a', head: '#333333', card: '#383838' },
  { id: 'win2000_pro', name: 'Windows 2000 Professional', mode: 'light' as const, color: '#0055ea', bg: 'linear-gradient(135deg, #3a6ea5, #004e92)', win: '#d4d0c8', head: '#000080', card: '#ffffff' },
  { id: 'win98_teal', name: 'Windows 98 Classic Teal', mode: 'light' as const, color: '#008080', bg: 'linear-gradient(135deg, #008080, #005a5a)', win: '#c0c0c0', head: '#000080', card: '#ffffff' },
  { id: 'win95_steel', name: 'Windows 95 Industrial Steel', mode: 'light' as const, color: '#000080', bg: 'linear-gradient(135deg, #55aaaa, #337777)', win: '#d4d0c8', head: '#000080', card: '#ffffff' },
  { id: 'win_nt4_workstation', name: 'Windows NT Workstation', mode: 'light' as const, color: '#283593', bg: 'linear-gradient(135deg, #3949ab, #1a237e)', win: '#cfd8dc', head: '#1a237e', card: '#ffffff' },
  { id: 'longhorn_slate', name: 'Longhorn Slate Build 4074', mode: 'dark' as const, color: '#78909c', bg: 'linear-gradient(135deg, #263238, #192227)', win: '#2d3b42', head: '#37474f', card: '#40525b' },
  { id: 'longhorn_jade', name: 'Longhorn Jade Plex', mode: 'dark' as const, color: '#26a69a', bg: 'linear-gradient(135deg, #004d40, #00241e)', win: '#0b3832', head: '#0e463f', card: '#14584f' },
  { id: 'whistler_water', name: 'Whistler Watercolor', mode: 'light' as const, color: '#0288d1', bg: 'linear-gradient(135deg, #b3e5fc, #81d4fa)', win: '#e1f5fe', head: '#0288d1', card: '#ffffff' },
  { id: 'neptune_horizon', name: 'Neptune Blue Horizon', mode: 'dark' as const, color: '#4fc3f7', bg: 'linear-gradient(135deg, #011627, #02203c)', win: '#052a4a', head: '#0a3860', card: '#0e4678' },
  { id: 'win31_hotdog', name: 'Windows 3.1 Hotdog Stand', mode: 'dark' as const, color: '#ffd600', bg: 'linear-gradient(135deg, #d50000, #ff0000)', win: '#000000', head: '#ffff00', card: '#1a0000' },
  { id: 'hi_contrast_black', name: 'Windows High Contrast Black', mode: 'dark' as const, color: '#00ff00', bg: '#000000', win: '#000000', head: '#0a0a0a', card: '#121212' },
  { id: 'hi_contrast_white', name: 'Windows High Contrast White', mode: 'light' as const, color: '#0000aa', bg: '#ffffff', win: '#ffffff', head: '#eeeeee', card: '#f8f8f8' },
];

winHeritageList.forEach((w) => {
  addTheme(
    w.id,
    w.name,
    'Windows Heritage',
    w.mode,
    w.color,
    w.color,
    w.color,
    w.bg,
    w.win,
    w.head,
    w.card,
    w.mode === 'dark' ? '#f3f4f6' : '#111827',
    w.mode === 'dark' ? '#9ca3af' : '#6b7280',
    w.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
  );
});

// 2. Developer & IDE Legends (45 Themes)
const ideThemes = [
  { id: 'tokyo_night', name: 'Tokyo Night', mode: 'dark' as const, color: '#7aa2f7', bg: '#1a1b26', win: '#24283b', head: '#1f2335', card: '#292e42' },
  { id: 'tokyo_storm', name: 'Tokyo Night Storm', mode: 'dark' as const, color: '#bb9af7', bg: '#24283b', win: '#1f2335', head: '#1a1b26', card: '#292e42' },
  { id: 'catppuccin_mocha', name: 'Catppuccin Mocha', mode: 'dark' as const, color: '#cba6f7', bg: '#1e1e2e', win: '#181825', head: '#11111b', card: '#313244' },
  { id: 'catppuccin_macchiato', name: 'Catppuccin Macchiato', mode: 'dark' as const, color: '#8aadf4', bg: '#24273a', win: '#1e2030', head: '#181926', card: '#363a4f' },
  { id: 'catppuccin_frappe', name: 'Catppuccin Frappé', mode: 'dark' as const, color: '#f4b8e4', bg: '#303446', win: '#292c3c', head: '#232634', card: '#414559' },
  { id: 'catppuccin_latte', name: 'Catppuccin Latte', mode: 'light' as const, color: '#1e66f5', bg: '#eff1f5', win: '#e6e9ef', head: '#dce0e8', card: '#ccd0da' },
  { id: 'nord_frost', name: 'Nord Frost', mode: 'dark' as const, color: '#88c0d0', bg: '#2e3440', win: '#3b4252', head: '#434c5e', card: '#4c566a' },
  { id: 'nord_aurora', name: 'Nord Aurora Green', mode: 'dark' as const, color: '#a3be8c', bg: '#242933', win: '#2e3440', head: '#3b4252', card: '#434c5e' },
  { id: 'dracula_purple', name: 'Dracula Vampire', mode: 'dark' as const, color: '#bd93f9', bg: '#282a36', win: '#21222c', head: '#191a21', card: '#44475a' },
  { id: 'dracula_blade', name: 'Dracula Blade Cyan', mode: 'dark' as const, color: '#8be9fd', bg: '#1e1f29', win: '#282a36', head: '#21222c', card: '#44475a' },
  { id: 'gruvbox_dark_hard', name: 'Gruvbox Dark Hard', mode: 'dark' as const, color: '#fe8019', bg: '#1d2021', win: '#282828', head: '#32302f', card: '#3c3836' },
  { id: 'gruvbox_dark_medium', name: 'Gruvbox Dark Medium', mode: 'dark' as const, color: '#fabd2f', bg: '#282828', win: '#32302f', head: '#3c3836', card: '#504945' },
  { id: 'gruvbox_light', name: 'Gruvbox Light Warm', mode: 'light' as const, color: '#af3a03', bg: '#fbf1c7', win: '#f2e5bc', head: '#ebdbb2', card: '#d5c4a1' },
  { id: 'one_dark_pro', name: 'One Dark Pro', mode: 'dark' as const, color: '#61afef', bg: '#21252b', win: '#282c34', head: '#1e2227', card: '#2c313a' },
  { id: 'one_light', name: 'One Light Clean', mode: 'light' as const, color: '#4078f2', bg: '#fafafa', win: '#f0f0f0', head: '#e5e5e6', card: '#ffffff' },
  { id: 'monokai_pro', name: 'Monokai Pro', mode: 'dark' as const, color: '#ffd866', bg: '#2d2a2e', win: '#221f22', head: '#19181a', card: '#403e41' },
  { id: 'monokai_octagon', name: 'Monokai Octagon', mode: 'dark' as const, color: '#fc9867', bg: '#282a3a', win: '#1e1f2b', head: '#161720', card: '#3a3d52' },
  { id: 'monokai_ristretto', name: 'Monokai Ristretto', mode: 'dark' as const, color: '#ff6188', bg: '#2c2525', win: '#211c1c', head: '#191515', card: '#403838' },
  { id: 'material_ocean', name: 'Material Ocean', mode: 'dark' as const, color: '#89ddff', bg: '#0f111a', win: '#1a1c25', head: '#12141d', card: '#232634' },
  { id: 'material_palenight', name: 'Material Palenight', mode: 'dark' as const, color: '#c792ea', bg: '#292d3e', win: '#1f2230', head: '#171923', card: '#32374d' },
  { id: 'solarized_dark', name: 'Solarized Dark', mode: 'dark' as const, color: '#268bd2', bg: '#002b36', win: '#073642', head: '#001e26', card: '#0d4250' },
  { id: 'solarized_light', name: 'Solarized Light Ivory', mode: 'light' as const, color: '#b58900', bg: '#fdf6e3', win: '#eee8d5', head: '#e0d8c3', card: '#ffffff' },
  { id: 'github_dark_default', name: 'GitHub Dark Default', mode: 'dark' as const, color: '#58a6ff', bg: '#0d1117', win: '#161b22', head: '#010409', card: '#21262d' },
  { id: 'github_dark_dimmed', name: 'GitHub Dark Dimmed', mode: 'dark' as const, color: '#539bf5', bg: '#22272e', win: '#2d333b', head: '#1c2128', card: '#373e47' },
  { id: 'github_light_clean', name: 'GitHub Light Crisp', mode: 'light' as const, color: '#0969da', bg: '#f6f8fa', win: '#ffffff', head: '#eaeef2', card: '#ffffff' },
  { id: 'night_owl', name: 'Night Owl Blue', mode: 'dark' as const, color: '#82aaff', bg: '#011627', win: '#0b2942', head: '#061b2d', card: '#113554' },
  { id: 'light_owl', name: 'Light Owl Warm', mode: 'light' as const, color: '#403f53', bg: '#f0f0f0', win: '#ffffff', head: '#e0e0e0', card: '#f9f9f9' },
  { id: 'cobalt2_neon', name: 'Cobalt2 Wes Bos', mode: 'dark' as const, color: '#ffc600', bg: '#193549', win: '#15232d', head: '#0d151c', card: '#1f4664' },
  { id: 'shades_of_purple', name: 'Shades of Purple', mode: 'dark' as const, color: '#fad000', bg: '#2d2b55', win: '#1e1e3f', head: '#171730', card: '#3b386e' },
  { id: 'synthwave_84', name: 'Synthwave 84 Retro', mode: 'dark' as const, color: '#ff7edb', bg: '#262335', win: '#1e1a2b', head: '#161320', card: '#342f49' },
  { id: 'laserwave_neon', name: 'LaserWave Violet', mode: 'dark' as const, color: '#40b4c4', bg: '#27212e', win: '#1f1925', head: '#18131d', card: '#362e40' },
  { id: 'ayu_mirage', name: 'Ayu Mirage', mode: 'dark' as const, color: '#ffcc66', bg: '#1f2430', win: '#171b24', head: '#13161d', card: '#2b3242' },
  { id: 'ayu_dark', name: 'Ayu Dark Luxury', mode: 'dark' as const, color: '#e6b450', bg: '#0b0e14', win: '#131721', head: '#0d1017', card: '#1a1f2c' },
  { id: 'ayu_light', name: 'Ayu Light Minimal', mode: 'light' as const, color: '#ff9940', bg: '#f8f9fa', win: '#ffffff', head: '#f0f1f2', card: '#ffffff' },
  { id: 'horizon_dark', name: 'Horizon Dark Sunset', mode: 'dark' as const, color: '#e95678', bg: '#1c1e26', win: '#16181f', head: '#101217', card: '#232530' },
  { id: 'andromeda_galaxy', name: 'Andromeda Cyan', mode: 'dark' as const, color: '#00e8c6', bg: '#262a33', win: '#1e222a', head: '#181b21', card: '#303540' },
  { id: 'panda_syntax', name: 'Panda Minimal', mode: 'dark' as const, color: '#19f9d8', bg: '#292a2b', win: '#242526', head: '#1e1f20', card: '#333536' },
  { id: 'vesper_dark', name: 'Vesper Midnight Amber', mode: 'dark' as const, color: '#ffc799', bg: '#101010', win: '#161616', head: '#0c0c0c', card: '#202020' },
  { id: 'poimandres_clean', name: 'Poimandres Teal', mode: 'dark' as const, color: '#5de4c7', bg: '#1b1e2e', win: '#171926', head: '#131520', card: '#25293d' },
  { id: 'rose_pine_main', name: 'Rosé Pine Rose', mode: 'dark' as const, color: '#ebbcba', bg: '#191724', win: '#1f1d2e', head: '#14121f', card: '#26233a' },
  { id: 'rose_pine_moon', name: 'Rosé Pine Moon', mode: 'dark' as const, color: '#ea9a97', bg: '#232136', win: '#2a273f', head: '#1c1a2c', card: '#393552' },
  { id: 'rose_pine_dawn', name: 'Rosé Pine Dawn', mode: 'light' as const, color: '#d7827e', bg: '#faf4ed', win: '#fffaf3', head: '#f2e9de', card: '#ffffff' },
  { id: 'radium_green', name: 'Radium Toxic Green', mode: 'dark' as const, color: '#10e784', bg: '#101318', win: '#161a22', head: '#0d0f13', card: '#202632' },
  { id: 'cyberpunk_2077_ide', name: 'Cyberpunk 2077 Yellow', mode: 'dark' as const, color: '#fcee0a', bg: '#0d0d0d', win: '#1a1a1a', head: '#121212', card: '#262626' },
  { id: 'zenburn_olive', name: 'Zenburn Earthy Tone', mode: 'dark' as const, color: '#8cd0d3', bg: '#3f3f3f', win: '#303030', head: '#262626', card: '#494949' },
];

ideThemes.forEach((t) => {
  addTheme(
    t.id,
    t.name,
    'Developer & IDE Legends',
    t.mode,
    t.color,
    t.color,
    t.color,
    t.bg,
    t.win,
    t.head,
    t.card,
    t.mode === 'dark' ? '#f8fafc' : '#0f172a',
    t.mode === 'dark' ? '#94a3b8' : '#64748b',
    t.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
  );
});

// Generator for Systematic Specialized Collections (3 to 12)
interface CollectionSpec {
  category: string;
  count: number;
  prefix: string;
  paletteHues: number[]; // Hues in degrees
  saturation: number;
  lightness: number;
  mode: 'dark' | 'light';
  names: string[];
}

const collections: CollectionSpec[] = [
  // 3. Cyberpunk & Sci-Fi (40)
  {
    category: 'Cyberpunk & Sci-Fi Neon',
    count: 40,
    prefix: 'cyber',
    paletteHues: [280, 190, 120, 45, 330, 160, 210, 25, 290, 50],
    saturation: 95,
    lightness: 55,
    mode: 'dark',
    names: [
      'Neon Matrix 01', 'Cyber Void Matrix', 'Acid Lime Terminal', 'Blade Runner Amber', 'Quantum Cyan Pulse',
      'Retrowave Sunset Glow', 'Hologram Blue Ray', 'Glitch Violet Horizon', 'Outrun Magenta Drive', 'Hyperdrive Purple Drift',
      'Mech Hangar Steel', 'Orbital Station Arc', 'Tachyon Pulse Burst', 'Starlight Nexus Core', 'Deep Core Magma',
      'Nanotech Silver Stream', 'Plasma Arc Reactor', 'Vaporwave Dream Pink', 'Neon Shinjuku Alley', 'Electric Velvet Shade',
      'Akihabara Night Light', 'Chrome Hazard Warning', 'Android Glow Cyan', 'Void Walker Stealth', 'Neural Link Synapse',
      'Pulsar Gold Emission', 'Subzero Frost Beam', 'Cyber Samurai Armor', 'Ghost In The Shell', 'Dark Matter Vortex',
      'Singularity Horizon', 'Ion Thruster Jet', 'Overclocked Silicon', 'Biohazard Toxic Wave', 'Stealth Fighter Carbon',
      'Deep Space Beacon 09', 'Supernova Flare Core', 'Laser Grid Scanner', 'Cybernetic Pink Glow', 'Grid Runner Pulse',
    ],
  },
  // 4. Jewels & Gemstones (40)
  {
    category: 'Jewels & Gemstones',
    count: 40,
    prefix: 'jewel',
    paletteHues: [220, 345, 150, 275, 45, 185, 300, 15, 80, 200],
    saturation: 85,
    lightness: 50,
    mode: 'dark',
    names: [
      'Royal Sapphire Blue', 'Burma Ruby Crimson', 'Colombian Emerald Green', 'Imperial Amethyst Royal', 'Citrine Spark Gold',
      'Black Diamond Facet', 'Rose Quartz Shimmer', 'Topaz Sun Amber', 'Aquamarine Deep Abyss', 'Opal Radiance Pastel',
      'Moonstone Mist Glow', 'Tanzanite Twilight Violet', 'Garnet Velvet Wine', 'Jade Dynasty Imperial', 'Turquoise Coast Lagoon',
      'Peridot Sparkle Leaf', 'Tourmaline Rainbow Pink', 'Amber Fossil Resin', 'Lapis Lazuli Egyptian', 'Onyx Obsidian Jet',
      'Morganite Blush Rose', 'Zircon Breeze Cyan', 'Alexandrite Magical Hue', 'Bloodstone Dragon Flare', 'Sunstone Solar Sparkle',
      'Carnelian Red Glow', 'Labradorite Flash Indigo', 'Malachite Swirl Green', 'Sphene Titanite Shine', 'Spinel Noble Brilliant',
      'Kunzite Lilac Dream', 'Heliodor Golden Beryl', 'Ametrine Bi-Color Splendor', 'Goshenite Pure Crystal', 'Rhodonite Petal Rosy',
      'Serpentine Forest Deep', 'Sodalite Royal Marine', 'Tiger Eye Golden Brown', 'Aventurine Shimmering Gold', 'Chrysoprase Apple Green',
    ],
  },
  // 5. Nature, Elements & Seasons (50)
  {
    category: 'Nature & Elements',
    count: 50,
    prefix: 'nature',
    paletteHues: [140, 340, 200, 30, 25, 100, 160, 210, 40, 70],
    saturation: 75,
    lightness: 45,
    mode: 'dark',
    names: [
      'Deep Forest Pine', 'Sakura Spring Blossom', 'Nordic Aurora Wave', 'Alpine Glacier Snow', 'Sahara Dunes Whisper',
      'Autumn Maple Flame', 'Ocean Abyss Mariana', 'Misty Mountain Ridge', 'Amazon Rainforest Canopy', 'Cherry Orchard Bloom',
      'Golden Wheat Field', 'Coral Reef Tropic', 'Volcanic Ash Cloud', 'Arctic Permafrost Frost', 'Lavender Fields Provence',
      'Sunset Horizon Glow', 'Desert Mirage Heat', 'Tropical Lagoon Blue', 'Redwood Giant Bark', 'Mossy Stone Creek',
      'Twilight Sky Lavender', 'Spring Meadow Flora', 'Stormy Sea Tempest', 'Bamboo Grove Serene', 'Frozen Tundra Glacier',
      'Wildfire Ember Spark', 'Midnight River Torrent', 'Morning Dew Petal', 'Canyon Clay Redrock', 'Savanna Dusk Horizon',
      'Thundercloud Storm Slate', 'Sunflower Golden Bloom', 'Peppermint Breeze Mint', 'Maple Syrup Warm Amber', 'Glacier Peak Summit',
      'Seafoam Wave Crest', 'Olive Grove Tuscan', 'Palm Oasis Oasis', 'Eucalyptus Morning Mist', 'Cedarwood Campfire Smoke',
      'Raindrop Ripple Glass', 'Iceland Moss Tectonic', 'Fjords Cold Deep', 'Sunlit Canopy Green', 'Autumn Amber Harvest',
      'Winter Solstice Frost', 'Summer Solstice Zenith', 'Spring Equinox Renewal', 'Moonlit Prairie Solitude', 'Deep Mangrove Estuary',
    ],
  },
  // 6. Luxury, Metals & Materials (40)
  {
    category: 'Luxury & Materials',
    count: 40,
    prefix: 'lux',
    paletteHues: [45, 30, 210, 340, 50, 20, 220, 15, 270, 0],
    saturation: 60,
    lightness: 55,
    mode: 'dark',
    names: [
      'Brushed Titanium Gray', 'Champagne Royal Gold', 'Matte Carbon Fiber', 'Rose Gold Prestige', 'Pure Platinum Luster',
      'Gunmetal Weapon Steel', 'Antique Brass Patina', 'Sterling Silver Polish', 'Burnished Copper Glint', 'Damascus Folded Steel',
      'White Gold Jewelry', 'Black Ceramic Watch', 'Raw Architectural Concrete', 'Carrara White Marble', 'Nero Marquina Black',
      'Royal Velvet Plum', 'Italian Saddlery Leather', 'Walnut Wood Grain', 'Espresso Dark Mahogany', 'Cashmere Soft Beige',
      'Obsidian Black Glass', 'Frosted Acrylic Pane', 'Alabaster Statuary Clean', 'Terracotta Sienese Clay', 'Raw Silk Weave',
      'Satin Bronze Hardware', 'Liquid Mercury Flow', 'Slate Stone Quarr', 'Basalt Volcanic Pillar', 'Cast Iron Cookware',
      'Gilded Age Filigree', 'Silk Jacquard Gold', 'Platinum Pearl Shell', 'Burlap Eco Rustic', 'Brushed Brass Chandelier',
      'Anodized Violet Case', 'Polished Chrome Mirror', 'Graphite Dark Ingot', 'Space Titanium Alloy', 'Ivory Tower Marble',
    ],
  },
  // 7. Minimal, Monochrome & Studio (30)
  {
    category: 'Minimal & Monochrome',
    count: 30,
    prefix: 'mono',
    paletteHues: [0, 210, 140, 40, 270],
    saturation: 10,
    lightness: 60,
    mode: 'dark',
    names: [
      'Pure Void OLED 100%', 'Absolute Stealth Black', 'Charcoal Minimalist Edge', 'Graphite Studio Draft', 'Neutral Smoke Mist',
      'Pure Paper Japanese White', 'Ash Gray Nordic Tone', 'Silver Lining Sleek', 'School Chalkboard Dark', 'Clean Canvas Primer',
      'Darkroom Infrared Film', 'Architect Blueprint Blue', 'Wireframe Neutral Gray', 'Minimal Zinc Industrial', 'Slate Monochrome Stone',
      'Mono Matrix Terminal', 'Ink & Feather Calligraphy', 'Soft Morning Fog', 'Cement Clean Modern', 'Carbon Neutrality Minimal',
      'Newspaper Morning Print', 'Architectural Whiteout', 'Phosphor Green Terminal', 'Amber Phosphor Cathode', 'Retro LCD Calculator',
      'High-Key Studio Lighting', 'Low-Key Noir Shadow', 'Matte Charcoal Velvet', 'Whiteout Blizzard Clean', 'Blackout Total Eclipse',
    ],
  },
  // 8. Cosmic, Space & Planets (40)
  {
    category: 'Cosmic & Astronomical',
    count: 40,
    prefix: 'space',
    paletteHues: [260, 220, 15, 45, 180, 290, 320, 140, 200, 30],
    saturation: 80,
    lightness: 50,
    mode: 'dark',
    names: [
      'Nebula Burst Orion', 'Andromeda Spiral Core', 'Event Horizon Void', 'Mars Rover Red Dust', 'Jupiter Great Red Spot',
      'Saturn Golden Rings', 'Lunar Regolith Gray', 'Solar Flare Corona', 'Deep Space Cold Vacuum', 'Interstellar Comet Trail',
      'Milky Way Galactic Arm', 'Orion Belt Blue Star', 'Sagittarius A Supermassive', 'Crab Nebula Pulsar', 'Kepler Echo Habitable',
      'Supercluster Laniakea', 'Cosmic Microwave Relic', 'Voyager Golden Record', 'Black Hole Accretion Disk', 'Titan Methane Lake',
      'Europa Under-Ice Ocean', 'Callisto Crater Moon', 'Ganymede Magnetic Shield', 'Venusian Sulfuric Cloud', 'Mercury Scorched Plain',
      'Neptune Deep Azure Wind', 'Uranus Pale Cyan Tilt', 'Pluto Heart Glaciers', 'Oort Cloud Icy Shell', 'Wormhole Spacetime Fold',
      'Dark Energy Expansion', 'Cosmic Ray Cascading', 'Pulsar Radio Lighthouse', 'Quasar Relativistic Jet', 'Red Giant Betelgeuse',
      'White Dwarf Sirius B', 'Magnetar Extreme Flux', 'Solar Eclipse Totality', 'Aurora Australis South', 'Stardust Pre-Solar Grain',
    ],
  },
  // 9. Pastel & Gentle Calms (50)
  {
    category: 'Pastel & Gentle Calms',
    count: 50,
    prefix: 'pastel',
    paletteHues: [280, 160, 25, 200, 50, 340, 90, 310, 180, 15],
    saturation: 65,
    lightness: 65,
    mode: 'light',
    names: [
      'Pastel Lavender Bloom', 'Pastel Mint Breeze', 'Pastel Peach Sundae', 'Pastel Sky Cerulean', 'Pastel Buttercup Flower',
      'Pastel Coral Blush', 'Soft Matcha Latte', 'Taiwanese Milk Tea', 'Strawberry Milk Shimmer', 'Vanilla Cream Custard',
      'Blueberry Morning Mist', 'Lilac Fog Whispers', 'Honey Oat Warmth', 'Pistachio Gelato Dream', 'Taro Sweet Cream',
      'Cotton Candy Carnival', 'Marshmallow Pink Fluff', 'Sage Green Whisper', 'Baby Powder Gentle Blue', 'Dusty Rose Vintage',
      'Pale Lemon Chiffon', 'Apricot Jam Glaze', 'Sea Salt Caramel', 'Coconut Water Refresh', 'Almond Breeze Natural',
      'Spring Blossom Pink', 'Icy Spearmint Fresh', 'Buttercream Cupcake', 'Lavender Macaron Cafe', 'Blue Hydrangea Petal',
      'Soft Papaya Slice', 'Frosted Mint Sorbet', 'Peachy Keen Glow', 'Lilac Dream Reverie', 'Soft Biscuit Bakery',
      'Sweet Melon Cantaloupe', 'Calm Eucalyptus Sprig', 'Pale Periwinkle Sky', 'Whipped Cream Cloud', 'Cloud Nine Peaceful',
      'Gentle Coastal Breeze', 'Cozy Flannel Blanket', 'Morning Haze Sunbeam', 'Cashmere Mist Scarf', 'Warm Wool Hearth',
      'Soft Terracotta Pot', 'Calm River Pebble', 'Linen Texture Breeze', 'Silky Dove Gray', 'Petal Soft Hydration',
    ],
  },
  // 10. Vibrant & Neon Gradients (50)
  {
    category: 'Vibrant Gradients',
    count: 50,
    prefix: 'vib',
    paletteHues: [330, 200, 270, 40, 160, 15, 290, 80, 220, 350],
    saturation: 90,
    lightness: 52,
    mode: 'dark',
    names: [
      'Sunset Blaze Fire', 'Electric Ocean Surge', 'Ultraviolet Dimension', 'Mango Tango Splash', 'Berry Splash Cocktail',
      'Aurora Borealis Wonder', 'Flamingo Sunset Pink', 'Neon Sunrise Miami', 'Fire & Ice Fusion', 'Tropic Thunder Storm',
      'Cosmic Candy Spark', 'Rainbow Prism Refract', 'Hyper Violet Spectrum', 'Citrus Punch Lemonade', 'Deep Sea Bioluminescence',
      'Toxic Wave Green', 'Dragon Breath Flare', 'Phoenix Flame Golden', 'Solarized Neon Day', 'Laser Pop Synth',
      'Super Sonic Velocity', 'Turbo Mint Energy', 'Bubblegum Pop Youth', 'Radio Active Red', 'Cyber Lime Glow',
      'Neon Fuchsia Club', 'Miami Vice 80s Vibe', 'Synth Pop Melancholy', 'Acid Rain Precipitation', 'Glow Stick Rave',
      'Laser Lemon Shock', 'High Voltage Surge', 'Cherry Bomb Explosion', 'Plasma Beam Cannon', 'Radioactive Isotope Glow',
      'Bioluminescent Wave', 'Infrared Vision Lens', 'Ultraviolet Burst Star', 'Sunburst Citrus Orange', 'Mega Magenta Flash',
      'Ultra Cyan Lightning', 'Strobe Light Pulse', 'Solar Wind Aurora', 'Prism Glow Diffraction', 'Cyberpunk Dusk Skyline',
      'Firefly Twilight Dance', 'Hyper Glow Phosphor', 'Wildberry Neon Burst', 'Tropical Sunset Silhouette', 'Electric Fruit Punch',
    ],
  },
  // 11. World Cities & Architecture (50)
  {
    category: 'World Cities & Heritage',
    count: 50,
    prefix: 'city',
    paletteHues: [210, 30, 280, 15, 140, 45, 190, 330, 80, 250],
    saturation: 65,
    lightness: 50,
    mode: 'dark',
    names: [
      'Tokyo Midnight Shinjuku', 'Paris Chic Haussmann', 'New York Loft Soho', 'London Fog Westminster', 'Kyoto Bamboo Arashiyama',
      'Seoul Cyber Gangnam', 'Santorini Sunset Aegean', 'Havana Tropic Malecón', 'Marrakech Spiced Medina', 'Venice Grand Canal',
      'Berlin Techno Industrial', 'Cairo Golden Pyramids', 'Reykjavik Glacier Thermal', 'Amsterdam Tulip Canal', 'Sydney Harbor Twilight',
      'Rio Carnival Copacabana', 'Dubai Ultra Marina', 'Mumbai Monsoon Gateway', 'Rome Terracotta Colosseum', 'Singapore Gardens Bay',
      'Hong Kong Neon Victoria', 'Istanbul Bosphorus Ferry', 'Barcelona Gaudi Mosaic', 'Vienna Imperial Opera', 'Prague Golden Spire',
      'Oslo Fjord Modernist', 'Zurich Alpine Minimal', 'San Francisco Golden Gate', 'Bangkok Emerald Wat', 'Cape Town Table Coast',
      'Honolulu Pacific Surf', 'Montreal Winter Old Port', 'Buenos Aires Tango Plaza', 'Edinburgh Royal Mile', 'Dublin Emerald Liffey',
      'Madrid Sun Puerta', 'Shanghai Bund Skyline', 'Toronto Tower Lake', 'Stockholm Gamla Stan', 'Taipei Night Shilin',
      'Lisbon Azulejo Tiles', 'Athens Acropolis Sun', 'Casablanca White Corniche', 'Monaco Monte Carlo Grand', 'Las Vegas Strip Mirage',
      'Miami South Beach Deco', 'Copenhagen Nyhavn Hygge', 'Seoul Han River Lights', 'Osaka Dotonbori Sign', 'Kyoto Zen Kinkaku-ji',
    ],
  },
  // 12. Algorithmic Chromatic Spectrum (40)
  {
    category: 'Chromatic Spectrum 360°',
    count: 40,
    prefix: 'spec',
    paletteHues: Array.from({ length: 40 }, (_, i) => Math.round((i * 360) / 40)),
    saturation: 85,
    lightness: 52,
    mode: 'dark',
    names: Array.from({ length: 40 }, (_, i) => {
      const deg = Math.round((i * 360) / 40);
      return `Harmonic Spectrum ${deg}° Precision`;
    }),
  },
];

// Helper to convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate all items in batches
collections.forEach((col) => {
  for (let i = 0; i < col.count; i++) {
    const hue = col.paletteHues[i % col.paletteHues.length];
    const accent = hslToHex(hue, col.saturation, col.lightness);
    const accentHover = hslToHex(hue, col.saturation, Math.min(85, col.lightness + 8));
    const name = col.names[i] || `${col.category} #${i + 1}`;
    const id = `${col.prefix}_${i + 1}_${hue}`;

    if (col.mode === 'dark') {
      const bg = `linear-gradient(135deg, ${hslToHex(hue, 35, 9)}, ${hslToHex((hue + 35) % 360, 45, 5)})`;
      const win = hslToHex(hue, 22, 13);
      const head = hslToHex(hue, 25, 10);
      const card = hslToHex(hue, 18, 17);
      addTheme(
        id,
        name,
        col.category,
        'dark',
        accent,
        accent,
        accentHover,
        bg,
        win,
        head,
        card,
        '#f8fafc',
        '#94a3b8',
        `rgba(${parseInt(accent.slice(1, 3), 16)}, ${parseInt(accent.slice(3, 5), 16)}, ${parseInt(accent.slice(5, 7), 16)}, 0.25)`,
      );
    } else {
      const bg = `linear-gradient(135deg, ${hslToHex(hue, 40, 96)}, ${hslToHex((hue + 30) % 360, 30, 92)})`;
      const win = '#ffffff';
      const head = hslToHex(hue, 35, 97);
      const card = hslToHex(hue, 20, 98);
      addTheme(
        id,
        name,
        col.category,
        'light',
        accent,
        accent,
        accentHover,
        bg,
        win,
        head,
        card,
        '#0f172a',
        '#64748b',
        `rgba(${parseInt(accent.slice(1, 3), 16)}, ${parseInt(accent.slice(3, 5), 16)}, ${parseInt(accent.slice(5, 7), 16)}, 0.2)`,
      );
    }
  }
});

export const themes: ThemePreset[] = [...rawThemes, ...extendedThemes];

export const defaultTheme: ThemePreset = themes[0]; // Windows 11 Mica Dark

export const getThemeById = (id: string): ThemePreset => {
  return themes.find((t) => t.id === id) || defaultTheme;
};

// Export category list with count
export const themeCategories: { name: string; count: number }[] = Array.from(
  themes.reduce((map, t) => {
    map.set(t.category, (map.get(t.category) || 0) + 1);
    return map;
  }, new Map<string, number>()),
).map(([name, count]) => ({ name, count }));
