import { ThemePreset } from '../types';

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

interface CollectionDef {
  category: string;
  count: number;
  prefix: string;
  paletteHues: number[];
  saturation: number;
  lightness: number;
  mode: 'dark' | 'light';
  names: string[];
}

const extendedCollections: CollectionDef[] = [
  // 13. Retro Computers & Vintage OS (75 themes)
  {
    category: 'Retro Computing & Vintage OS',
    count: 75,
    prefix: 'retro',
    paletteHues: [180, 210, 45, 120, 280, 200, 30, 240, 160, 20, 260, 320],
    saturation: 60,
    lightness: 50,
    mode: 'dark',
    names: [
      'Commodore 64 Classic Blue', 'Amiga Workbench 1.3 Topaz', 'Amiga Workbench 3.1 Slate', 'Apple Macintosh Classic 1984',
      'Apple System 7 Platinum', 'NeXTSTEP Titanium Slate', 'BeOS Electric Yellow', 'Atari ST GEM Desktop',
      'MS-DOS 6.22 Command Prompt', 'Sinclair ZX Spectrum Rainbow', 'IBM OS/2 Warp Cobalt', 'Silicon Graphics IRIX Indigo',
      'Sun Solaris OpenWindows', 'Xerox Alto BitBLT', 'Acorn RISC OS Arthur', 'Windows 3.1 Hotdog Stand',
      'Windows 3.1 Ocean Breeze', 'Windows 3.1 Emerald Isle', 'Palm OS 3.0 Graphite', 'Windows Mobile 6.5 Pocket PC',
      'Sony PlayStation BIOS 1994', 'Nintendo Game Boy Olive Green', 'SEGA Dreamcast Spiral Orange', 'VT220 Amber Terminal',
      'IBM 3270 Green Phosphor', 'DEC PDP-11 Paper Tape', 'TRS-80 Level II CRT', 'Apple IIe Monochromatic',
      'Atari 2600 Woodgrain', 'ColecoVision Arcade Blue', 'Commodore VIC-20 Cyan', 'Sinclair QL Crimson',
      'Mac OS 8 Copland Dream', 'Mac OS 9 Graphite Brushed', 'Windows Chicago Build 58s', 'Windows Cairo Concept Gold',
      'Windows Nashville Aero Pre', 'Windows Memphis 1997', 'Windows Whistler Beta 2419', 'Windows Longhorn Milestone 3',
      'Windows Longhorn Plex Blue', 'Windows Longhorn Slate 4074', 'Windows Longhorn Jade 4015', 'MSX Turbo-R Crimson',
      'Sharp X68000 Cyber Black', 'NEC PC-9801 Ivory', 'Fujitsu FM Towns Martian', 'Sega Saturn CD Player BIOS',
      'Nintendo 64 Memory Card Blue', 'GameCube Purple Cube', 'Xbox Original Green Flubber', 'Nokia 3310 Monochrome LCD',
      'Sony CLIÉ Palm Palmtop', 'BlackBerry 7230 Blue Screen', 'Newton MessagePad Green', 'Cyberdeck Matrix Amber P3',
      'Tektronix 4014 Storage Tube', 'Altair 8800 Front Panel Red', 'IMSAI 8080 Blue LED', 'Cray-1 Supercomputer Maroon',
      'ENIAC Vacuum Tube Glow', 'Vax VMS Cyan Terminal', 'HP-UX Motive Slate', 'SCO UNIX Coral Prompt',
      'NeXTstation Turbo Black', 'NeXTdimension Color Cube', 'Plan 9 from Bell Labs White', 'Symbian OS Series 60 Silver',
      'Palm WebOS Card Interface', 'Sony PlayStation 2 Dark Ocean', 'SEGA Genesis 16-Bit Gold', 'SNES Classic Controller Gray',
      'Game Boy Color Atomic Purple', 'Game Boy Advance Glacier', 'Nintendo DS Silver Dual'
    ],
  },

  // 14. Anime & Manga Aesthetics (75 themes)
  {
    category: 'Anime & Manga Aesthetics',
    count: 75,
    prefix: 'anime',
    paletteHues: [270, 330, 45, 160, 190, 15, 230, 290, 55, 345, 210, 120],
    saturation: 85,
    lightness: 56,
    mode: 'dark',
    names: [
      'Neo Tokyo Akira Crimson', 'Evangelion Unit-01 Violet', 'Evangelion Unit-02 Asuka Red', 'Evangelion Unit-00 Prototype',
      'Studio Ghibli Meadow Green', 'Spirited Away Bathhouse Gold', 'Princess Mononoke Forest Spirit', 'Howls Moving Castle Starlight',
      'Dragon Ball Super Saiyan Auric', 'Capsule Corp Turqouise', 'Namekian Mystic Emerald', 'Sailor Moon Crystal Moonstone',
      'Sailor Mars Shrine Crimson', 'Sailor Mercury Ice Glaze', 'Sailor Jupiter Thunder Oak', 'Sailor Venus Radiant Citrine',
      'Attack on Titan Survey Scout Green', 'Demon Slayer Hinokami Flame', 'Demon Slayer Water Breathing Azure', 'Demon Slayer Thunder Clap Yellow',
      'Demon Slayer Insect Wisteria Violet', 'Cyberpunk Edgerunners Sandevistan Yellow', 'Ghost in the Shell Tachikoma Blue', 'Ghost in the Shell Motoko Purple',
      'Cowboy Bebop Swordfish Red', 'Cowboy Bebop Jazz Sunset Amber', 'Naruto Sage Mode Mandarin', 'Naruto Rasengan Cyan Vortex',
      'Akatsuki Cloud Crimson Velvet', 'Bleach Bankai Kuroitsuki Obsidian', 'Bleach Hollow Mask Porcelain', 'Jujutsu Kaisen Infinite Void Cyan',
      'Jujutsu Kaisen Sukuna Malevolent Cinnabar', 'One Piece Gear 5 Nika Pearl', 'One Piece Thousand Sunny Gold', 'Fullmetal Alchemist Transmutation Blue',
      'Fullmetal Alchemist Ouroboros Red', 'Death Note Shinigami Apple Noir', 'Hunter x Hunter Godspeed Electric', 'Hunter x Hunter Kurapika Scarlet',
      'My Hero All Might Detroit Blue', 'My Hero Deku One For All Emerald', 'Neon Genesis NERV Burgundy', 'Steins Gate Divergence 1.048596',
      'Tokyo Ghoul Kakugan Red', 'Sword Art Online Elucidator Teal', 'Fate Stay Night Excalibur Gold', 'Fate Stay Night Unlimited Blade Works',
      'Mob Psycho 100 Mob Explosion 100%', 'Bocchi the Rock Mango Box Pink', 'Chainsaw Man Pochita Orange', 'Spy x Family Anya Peanut Beige',
      'Violet Evergarden Letter Azure', 'Your Name Twilight Comet Blue', 'Weathering With You Sky Clear Azure', 'A Silent Voice Sakura Pale',
      'Trigun Vash Crimson Duster', 'Berserk Dragonslayer Eclipse Crimson', 'JoJo Golden Wind Giorno Pink', 'JoJo Stardust Star Platinum Purple',
      'JoJo Diamond Unbreakable Crazy Diamond', 'Kill la Kill Scissor Blade Scarlet', 'Gurren Lagann Drill Heaven Red', 'Code Geass Geass Eye Vermilion',
      'Code Geass Zero Cape Purple', 'Promare Mad Burnish Neon Pink', 'Initial D Fujiwara Panda Tofu', 'FLCL Haruko Vespa Yellow',
      'Samurai Champloo Hip-Hop Edo', 'Puella Magi Madoka Hope Pink', 'Puella Magi Homura Time Silver', 'Made in Abyss White Whistle Bone',
      'Vinland Saga Northern Sea Gale', 'Frieren Mage 1000-Year Spell Silver', 'Dungeon Meshi Delicious Roast Amber'
    ],
  },

  // 15. Gaming & Esports Realms (80 themes)
  {
    category: 'Gaming & Esports Realms',
    count: 80,
    prefix: 'game',
    paletteHues: [25, 45, 140, 200, 280, 350, 175, 100, 310, 220, 60, 15],
    saturation: 80,
    lightness: 54,
    mode: 'dark',
    names: [
      'Dark Souls Firelink Bonfire', 'Elden Ring Erdtree Golden Radiance', 'Elden Ring Ranni Dark Moon Indigo', 'Bloodborne Hunter Moonlight Greatsword',
      'Sekiro Deflection Spark Orange', 'Armored Core Rubicon Coral Red', 'Cyberpunk 2077 Arasaka Scarlet', 'Cyberpunk 2077 Trauma Team White',
      'Witcher 3 White Wolf Silver Medallion', 'Halo Master Chief Spartan Olive 117', 'Halo Cortana Hologram Cyan', 'Portal Aperture Science Blue',
      'Portal Aperture Science Orange', 'Half-Life Black Mesa Hazard Orange', 'Half-Life Lambda Citadel Steel', 'Mass Effect N7 Carbon & Crimson',
      'Mass Effect Paragon Azure', 'Mass Effect Renegade Blood Red', 'Destiny 2 Traveler Radiant Light', 'Destiny 2 Darkness Stasis Ice',
      'Destiny 2 Strand Weave Emerald', 'Final Fantasy VII Mako Energy Cyan', 'Final Fantasy VII Buster Sword Steel', 'Final Fantasy VII Sephiroth Masamune',
      'Final Fantasy XIV Crystal Tower Azure', 'Final Fantasy XVI Phoenix Fire', 'Fallout Pip-Boy 3000 Phosphor Amber', 'Fallout Vault-Tec Blue & Gold',
      'Skyrim Dragonborn Nordic Steel', 'Skyrim Elder Scroll Auric', 'Doom Eternal Praetor Suit Olive', 'Doom Eternal Crucible Blade Blood',
      'BioShock Rapture Art Deco Gold', 'BioShock Infinite Columbia Sky Blue', 'The Legend of Zelda Triforce Gold', 'The Legend of Zelda Master Sword Azure',
      'The Legend of Zelda Sheikah Slate Cyan', 'The Legend of Zelda Zonai Construct Green', 'Super Mario Bros Super Mushroom Red', 'Super Mario Star Power Rainbow Gold',
      'Sonic the Hedgehog Green Hill Emerald', 'Sonic the Hedgehog Speed Demon Cobalt', 'Metroid Prime Varia Suit Amber', 'Metroid Prime Phazon Hazardous Indigo',
      'Minecraft Diamond Ore Azure', 'Minecraft Netherite Forge Obsidian', 'Minecraft Redstone Dust Pulse', 'Minecraft Emerald Village Green',
      'Overwatch Tracer Chronal Blue', 'Overwatch Genji Dragonblade Lime', 'Apex Legends Wraith Void Walker Violet', 'Apex Legends Octane Stim Acid Lime',
      'Valorant Radiant Radianite Cyan', 'Valorant Phantom Vandal Gold', 'League of Legends Hextech Magic Blue', 'League of Legends Demacia Gold & Ivory',
      'League of Legends Noxus Crimson Legion', 'League of Legends Shadow Isles Spectral Mist', 'Dota 2 Aegis of Champions Gold', 'Dota 2 Radiant Ancient Emerald',
      'Dota 2 Dire Ancient Cinnabar', 'World of Warcraft Alliance Lion Blue', 'World of Warcraft Horde Warchief Red', 'World of Warcraft Lich King Frostmourne',
      'StarCraft Protoss Psionic Blue', 'StarCraft Zerg Creep Violet', 'StarCraft Terran Marine Steel', 'Monster Hunter Rathalos Crimson Scale',
      'Monster Hunter Zinogre Thunder Jade', 'God of War Leviathan Axe Runic Frost', 'God of War Blades of Chaos Flame', 'Red Dead Redemption Sunset Ochre',
      'Grand Theft Auto Vice City Neon Pink', 'Gran Turismo Nurburgring Asphalt', 'Forza Horizon Festival Ultraviolet', 'Civilization Wonder Civilization Marble',
      'Stardew Valley Prismatic Shard Prism', 'Hollow Knight Void Heart Obsidian', 'Hades Zagreus Bloodstone Infernal', 'Dead Cells Collector Cell Blue'
    ],
  },

  // 16. Cinema & Pop Culture (70 themes)
  {
    category: 'Cinema & Pop Culture',
    count: 70,
    prefix: 'cinema',
    paletteHues: [35, 120, 215, 340, 275, 185, 45, 10, 160, 295],
    saturation: 75,
    lightness: 52,
    mode: 'dark',
    names: [
      'Blade Runner 2049 Spinner Amber', 'Blade Runner Tears in Rain Neon Blue', 'The Matrix Digital Code Cascades', 'Tron Legacy Recognizer Crimson',
      'Tron Legacy Grid Encom Azure', 'Star Wars Galactic Empire Death Star Gray', 'Star Wars Jedi Holocron Azure', 'Star Wars Sith Kyber Crimson',
      'Star Wars Mandalorian Beskar Silver', 'Star Wars Ahsoka Dual White Blades', 'Interstellar Gargantua Black Hole Accretion', 'Interstellar TARS Monolith Charcoal',
      '2001 Space Odyssey HAL 9000 Optic Red', '2001 Space Odyssey Starchild Monolith', 'Dune Arrakis Melange Spice Orange', 'Dune Fremen Stillsuit Desert Sand',
      'Dune Bene Gesserit Obsidian Veil', 'Wes Anderson Grand Budapest Palace Rose', 'Wes Anderson Moonrise Kingdom Khaki & Gold', 'Wes Anderson French Dispatch Monochrome',
      'Mad Max Fury Road Chrome & Sand', 'Stranger Things Upside Down Midnight Indigo', 'Stranger Things Hawkins Lab CRT Green', 'The Batman Gotham Nocturnal Shadow',
      'The Dark Knight Joker Acid Violet', 'Barbie Dreamhouse Malibu Hot Magenta', 'Oppenheimer Trinity Test Nuclear Flame', 'Oppenheimer Manhattan Project Graphite',
      'Lord of the Rings Rivendell Silver Leaves', 'Lord of the Rings Mordor Eye of Sauron Fire', 'Lord of the Rings Gondor White Tree Silver', 'Harry Potter Gryffindor Scarlet & Gold',
      'Harry Potter Slytherin Silver & Emerald', 'Harry Potter Ravenclaw Bronze & Azure', 'Harry Potter Hufflepuff Badger Amber', 'Jurassic Park Amber Mosquito Gold',
      'Jurassic Park Isla Nublar Canopy Green', 'Indiana Jones Golden Idol Relic', 'Pulp Fiction Big Kahuna Sunset Gold', 'Kill Bill Yellow Tracksuit Katana',
      'Fight Club Project Mayhem Bar Soap Pink', 'Fight Club Chemical Burn Ochre', 'Inception Spinning Totem Pewter', 'Tenet Temporal Inversion Cobalt & Crimson',
      'Arrival Heptapod Circular Logogram Smoke', 'Alien Weyland-Yutani Xenomorph Acid', 'Aliens Colonial Marines Camo Olive', 'Predator Thermal Heat Vision Infrared',
      'Terminator T-800 Endoskeleton Chrome', 'Terminator T-1000 Liquid Metal Mercury', 'RoboCop Omni Consumer Products Steel', 'Back to the Future DeLorean Flux Capacitor',
      'Ghostbusters Proton Pack Stream Amber', 'The Shining Overlook Hotel Carpet Hexagon', 'Twin Peaks Black Lodge Chevron Velvet', 'A Clockwork Orange Korova Milk White',
      'Taxi Driver Nighttime 8th Avenue Neon', 'Drive Synth Horizon Neon Scorpion', 'La La Land Sunset Griffith Violet', 'Spider-Man Across the Spider-Verse Punk',
      'Iron Man Mark III Hot Rod Red & Gold', 'Black Panther Wakanda Vibranium Purple', 'Captain America Vibranium Shield Blue & Red', 'Doctor Strange Eldritch Mandala Spark',
      'Guardians of the Galaxy Awesome Mix Cassette', 'The Godfather Corleone Shadow Venetian', 'Casablanca Rick Cafe Moroccan Amber', 'Citizen Kane Rosebud Smoldering Ember',
      'Metropolis Maria Art Deco Brass', 'Nosferatu German Expressionist Shadow'
    ],
  },

  // 17. Mythological & Ancient Pantheons (70 themes)
  {
    category: 'Mythological & Ancient Pantheons',
    count: 70,
    prefix: 'myth',
    paletteHues: [45, 195, 280, 150, 15, 230, 90, 320, 210, 35],
    saturation: 78,
    lightness: 54,
    mode: 'dark',
    names: [
      'Mount Olympus Nectar Gold', 'Zeus Olympian Lightning Cyan', 'Poseidon Abyssal Trident Azure', 'Hades Underworld Stygian Obsidian',
      'Athena Parthenon Olive Wisdom', 'Apollo Golden Sun Chariot', 'Artemis Silver Crescent Moon', 'Ares Spartan Blood Bronze',
      'Aphrodite Sea Foam Pearl Blush', 'Hermes Winged Sandal Caduceus Gold', 'Dionysus Vineyard Wine Velvet', 'Hephaestus Volcanic Anvil Ember',
      'Persephone Pomegranate Ruby', 'Demeter Golden Wheat Harvest', 'Valkyrie Bifrost Rainbow Bridge', 'Thor Mjolnir Thunder Strike',
      'Odin Allfather Raven Shadow Hugin', 'Loki Trickster Mischief Emerald', 'Freyja Folkvangr Amber Tears', 'Hel Niflheim Glacial Permafrost',
      'Baldur Radiant Light Blessing', 'Fenrir Unchained Iron Shackle', 'Jormungandr Midgard World Serpent', 'Yggdrasil World Ash Tree Sap',
      'Surtr Muspelheim Primordial Fire', 'Anubis Embalmer Shadow Jackal', 'Ra Sun God Solar Barque Gold', 'Horus Falcon Eye Lapis Lazuli',
      'Osiris Resurrection Nile Teal', 'Isis Magic Knot Carnelian', 'Set Desert Storm Red Ochre', 'Thoth Scribe Papyrus Turquoise',
      'Sekhmet Lioness Sun Wrath', 'Bastet Cat Goddess Bronze & Turquoise', 'Sobek Crocodile Nile Marsh Reed', 'Maat Feather of Truth Sky Azure',
      'Shiva Nataraja Cosmic Dance Indigo', 'Vishnu Sustainer Garuda Azure', 'Brahma Creator Golden Egg Hiranyagarbha', 'Ganesha Lotus Blossom Saffron',
      'Durga Mahishasura Lion Vermilion', 'Kali Dark Mother Skull Garland Obsidian', 'Krishna Peacock Feather Viridian', 'Saraswati Veena Pure Swan Ivory',
      'Lakshmi Abundance Lotus Rose', 'Hanuman Sun Leap Orange Sindoor', 'Amaterasu Omikami Rising Sun Pearl', 'Susanoo Tempest Ocean Gale',
      'Tsukuyomi Silver Night Moon Domain', 'Inari Fox Spirit Vermilion Torii', 'Raijin Thunder Drum Electric', 'Fujin Wind Bag Whirlwind Sage',
      'Quetzalcoatl Plumed Serpent Jade', 'Tezcatlipoca Smoking Obsidian Mirror', 'Huitzilopochtli Hummingbird Sun Fire', 'Tlaloc Cloudburst Rain Emerald',
      'Kukulkan Mayan Pyramid Solar Serpent', 'Pachamama Andean Mother Earth Terracotta', 'Inti Incan Sun God Pure Gold', 'Gilgamesh Epic of Uruk Lapis Gate',
      'Ishtar Gate of Babylon Glazed Cobalt', 'Enkidu Cedar Forest Wild Verdant', 'Marduk Dragon Tiamat Slaying Gold', 'Ogun Orisha Iron Forge Steel',
      'Oya Tempest Wind Violet Storm', 'Shango Thunder Axe Lightning Crimson', 'Yemoja Oceanic Mother Azure Waves', 'Oshun Sweet River Waters Amber Honey',
      'Dagda Cauldron of Plenty Celtic Gold', 'Morrigan Battle Crow Midnight Plum'
    ],
  },

  // 18. Mineralogy & Rare Crystals (70 themes)
  {
    category: 'Mineralogy & Rare Crystals',
    count: 70,
    prefix: 'mineral',
    paletteHues: [175, 290, 50, 130, 210, 340, 25, 260, 85, 315],
    saturation: 76,
    lightness: 55,
    mode: 'dark',
    names: [
      'Bismuth Iridescent Step Pyramid', 'Opal Lightning Ridge Black Fire', 'Labradorite Spectrolite Blue Flash', 'Fluorite Hexagonal Violet Gradient',
      'Malachite Banded Botryoidal Green', 'Rhodochrosite Stalactite Rose Incan', 'Lapis Lazuli Afghan Pyrite Spark', 'Azurite Cobalt Chessylite Depth',
      'Pyrite Golden Fools Cubic Brass', 'Obsidian Rainbow Volcanic Glass', 'Tigers Eye Chatoyant Golden Fiber', 'Larimar Dominican Caribbean Azure',
      'Moonstone Adularescence Blue Sheen', 'Alexandrite Color-Change Teal to Ruby', 'Aquamarine Beryl Santa Maria Blue', 'Tourmaline Watermelon Bi-Color',
      'Kunzite Spodumene Lilac Crystal', 'Morganite Peachy Pink Beryl', 'Tanzanite Merelani Royal Violet', 'Peridot Olivine Volcanic Lime',
      'Chrysoberyl Cats Eye Cymophane', 'Spinel Burmese Flame Orange', 'Benitoite California State Blue', 'Chrysocolla Malachite Eilat Stone',
      'Charoite Siberian Purple Swirl', 'Seraphinite Siberian Green Feather', 'Sugilite Royal Lavulite Wesselite', 'Rhodonite Black Veined Pink',
      'Prehnite Epidote Spray Pistachio', 'Celestite Geode Madagascar Sky Blue', 'Apophyllite Zeolite Pyramid Green', 'Stilbite Peach Bowtie Cluster',
      'Cavansite Pentagonite Wagholi Blue', 'Crocoite Tasmanian Needle Red', 'Wulfenite Los Lamentos Caramel Orange', 'Vanadinite Mibladen Hexagonal Ruby',
      'Dioptase Tsumeb Intense Emerald', 'Euclase Colombian Blue Ice', 'Phenakite High-Frequency Colorless', 'Danburite Golden Charcas Crystal',
      'Scapolite Rainbow Tanzanian Sun', 'Zircon Starlight Heat-Treated Cyan', 'Topaz Imperial Ouro Preto Peach', 'Topaz Swiss Electric Blue',
      'Garnet Spessartine Mandarin Orange', 'Garnet Tsavorite Merelani Green', 'Garnet Demantoid Horsetail Inclusion', 'Garnet Rhodolite Grape Violet',
      'Smithsonite Turquoise Botryoidal', 'Hemimorphite Electric Neon Blue', 'Aurichalcite Sky Blue Feather', 'Variscite Utah Webbed Green',
      'Turquoise Sleeping Beauty Robin Egg', 'Coral Fossilized Agatized Chrysanthemum', 'Amethyst Brandberg Phantom Scepter', 'Quartz Smoky Cairngorm Morion',
      'Quartz Rose Madagascar Gem Silica', 'Quartz Rutilated Venus Hair Golden', 'Quartz Tourmalinated Needle Inclusions', 'Quartz Herkimer Diamond Double Terminated',
      'Agate Botswana Banded Charcoal', 'Agate Fire Arizona Rainbow Bubble', 'Agate Moss Montana Forest Branch', 'Jasper Ocean Madagascar Orbicular',
      'Jasper Mookaite Australian Ochre & Wine', 'Jasper Rainforest Australian Spherulitic', 'Chalcedony Blue Ellensburg Lavender', 'Carnelian Sunset Translucent Orange',
      'Chrysoprase Australian Apple Green', 'Bloodstone Heliotrope Red Jasper Spots'
    ],
  },

  // 19. Weather & Atmospheric Wonders (70 themes)
  {
    category: 'Weather & Atmospheric Wonders',
    count: 70,
    prefix: 'weather',
    paletteHues: [205, 235, 160, 40, 270, 15, 185, 310, 110, 60],
    saturation: 72,
    lightness: 52,
    mode: 'dark',
    names: [
      'Supercell Mesocyclone Indigo', 'Ball Lightning Turquoise Plasma', 'St. Elmos Fire Masthead Violet', 'Midnight Sun Arctic Polar Glare',
      'Haboob Saharan Dust Wall Ochre', 'Hailstorm Severe Downdraft Slate', 'Noctilucent Mesospheric Azure Ice', 'Crepuscular Rays Twilight God Rays',
      'Sun Dog 22° Parhelion Ice Halo', 'Monsoon Cloudburst Bay of Bengal', 'Frostbite Siberian Permafrost Glaze', 'Volcanic Ash Plume Dirty Lightning',
      'Red Sprite Mesospheric Plasma Flash', 'Blue Jet Stratospheric Conduit', 'Morning Dew Spiderweb Pearl', 'Tornado F5 Fujita Vortex Charcoal',
      'Aurora Australis Southern Emerald Ring', 'Aurora Borealis Northern Crimson Corona', 'Diamond Dust Clear Sky Ice Crystals', 'Virga Precipitating Evaporation Veil',
      'Mammatus Clouds Sunset Ochre Pouch', 'Kelvin-Helmholtz Breaking Wave Cloud', 'Lenticular Cloud Mountain Peak UFO', 'Asperitas Undulating Violent Sky',
      'Morning Glory Roll Cloud Gulf of Carpentaria', 'Derecho Straight-Line Wind Shelf', 'Downburst Microburst Radial Gale', 'Heat Lightning Distant Silent Summer',
      'Fog Bank Golden Gate Marine Layer', 'Rime Ice Mount Washington Anemometer', 'Glaze Ice Black Ice Highway Reflection', 'Sea Smoke Arctic Lead Thermal Vapor',
      'Tsunami Deep Oceanic Wave Front', 'Waterspout Floridian Coral Spout', 'Dust Devil Martian Regolith Whirl', 'Fire Whirl California Bushfire Vortex',
      'Catatumbo Relámpago Infinite Lightning', 'Everlasting Storm Maracaibo Teal', 'Polar Vortex Deep Arctic Freeze', 'Chinook Snow Eater Warm Gale',
      'Sirocco Mediterranean Ochre Wind', 'Mistral Provencal Azure Gale', 'Santa Ana Desert Canyon Flare', 'Calima Canary Islands Dust Veil',
      'Alpenglow Mont Blanc Alpine Rose', 'Green Flash Horizon Sunset Glint', 'Circumzenithal Arc Upside-Down Rainbow', 'Fogbow White Ghostly Arc',
      'Glory Brocken Spectre Solar Rings', 'Corona Lunar Pollen Diffracted Rings', 'Bishop Ring Volcanic Aerosol Halo', 'Light Pillar Ice Crystal Vertical Beam',
      'Subsun Specular Cloud Reflection', 'Zodiacal Light False Dawn Dust', 'Gegenschein Anti-Solar Interplanetary Glow', 'Airglow Chemiluminescent Green Sky',
      'Equatorial Plasma Bubble Ionospheric', 'Magnetic Reconnection Solar Flare', 'Coronal Mass Ejection Earth Direct', 'Geomagnetic Storm G5 Carrington Red',
      'Whistler Wave VLF Audio Lightning', 'Chorus Emission Magnetospheric Birds', 'Ionospheric Scintillation GPS Flicker', 'Stepped Leader Lightning Branch',
      'Positive Giant Superbolt Flash', 'Ribbon Lightning Wind Blown Stroke', 'Beaded Lightning Pinched Channel', 'Anvil Crawler Intra-Cloud Discharge',
      'Spider Lightning Stratiform Underside', 'Dry Thunderstorm Mojave Desert Flash'
    ],
  },

  // 20. Coffee, Tea & Gastronomy (70 themes)
  {
    category: 'Coffee, Tea & Gastronomy',
    count: 70,
    prefix: 'gastro',
    paletteHues: [25, 40, 120, 15, 340, 50, 80, 200, 300, 150],
    saturation: 68,
    lightness: 50,
    mode: 'dark',
    names: [
      'Espresso Crema Velvet Roast', 'Matcha Uji Ceremonial Jade', 'Earl Grey Bergamot Golden Amber', 'Lavender Infused London Fog',
      'Chai Masala Cinnamon Cardamom', 'Cafe au Lait Parisian Silk', 'Dark Chocolate Truffle 85% Cacao', 'Salted Caramel Fleur de Sel Toffee',
      'Pistachio Bronte Cream Gelato', 'Tiramisu Treviso Cocoa Mascarpone', 'French Macaron Ispahan Rose Lychee', 'Boba Brown Sugar Tiger Milk',
      'Uji Hojicha Roasted Green Tea', 'Hibiscus Crimson Petal Tisane', 'Acai Berry Amazonian Midnight Bowl', 'Ethiopian Yirgacheffe Jasmine Peach',
      'Colombian Supremo Honey Process', 'Sumatra Mandheling Cedar Spice', 'Guatemala Antigua Smoky Cocoa', 'Kenya AA Blackcurrant Winey',
      'Affogato Vanilla Espresso Float', 'Cortado Spanish Steamed Glass', 'Flat White Melbourne Silky Microfoam', 'Turkish Coffee Cardamom Cezve',
      'Vietnamese Ca Phe Trung Egg Foam', 'Irish Coffee Whiskey Whipped Cream', 'Sencha First Flush Shincha Green', 'Gyokuro Pearl Dew Shade Grown',
      'Genmaicha Toasted Brown Rice Green', 'Jasmine Dragon Pearls Silver Needle', 'Da Hong Pao Big Red Robe Wuyi Oolong', 'Tieguanyin Iron Goddess of Mercy',
      'Darjeeling First Flush Champagne Tea', 'Assam Golden Tips Malty Breakfast', 'Lapsang Souchong Pine Smoke Wuyi', 'Rooibos Cederberg Red Bush Sun',
      'Yerba Mate Gourd Bombilla Green', 'Tie Guan Yin Imperial Orchid', 'Matcha White Chocolate Ganache', 'Vanilla Bean Bourbon Madagascar Pod',
      'Tonka Bean Venezuelan Almond Smoke', 'Saffron Crocus Spanish Red Stigma', 'Cardamom Green Pod Mysore Queen', 'Star Anise Vietnamese Spice Star',
      'Cinnamon Ceylon True Sweet Bark', 'Nutmeg Grenada Mace Scarlet Lacing', 'Clove Zanzibar Island Flower Bud', 'Ginger Wild Blue Mountain Fresh',
      'Turmeric Golden Latte Curcumin Root', 'Wasabi Shizuoka Fresh Grated Stem', 'Black Truffle Perigord Winter Earth', 'White Truffle Alba Autumn Gold',
      'Balsamic Modena Tradizionale 25 Year', 'Olive Oil Nocellara del Belice Emerald', 'Manuka Honey New Zealand MGO 850+', 'Maple Syrup Quebec Amber Rich Tap',
      'Crème Brûlée Caramelized Sugar Crust', 'Mille-Feuille Vanilla Custard Flakes', 'Canelé de Bordeaux Beeswax Rum', 'Croissant Beurre dIsigny Flaky',
      'Pain au Chocolat Double Valrhona Bar', 'Opera Cake Coffee Ganache Almond', 'Sacher Torte Viennese Apricot Glaze', 'Black Forest Kirschwasser Sour Cherry',
      'Kouign-Amann Breton Butter Sugar', 'Baklava Gaziantep Pistachio Syrup', 'Knafeh Nablus Sweet Cheese Kataifi', 'Halva Tahini Sesame Marble Swirl',
      'Turkish Delight Rosewater Pistachio', 'Mochi Daifuku Fresh Ichigo Strawberry'
    ],
  },

  // 21. High Fashion & Haute Couture (70 themes)
  {
    category: 'High Fashion & Haute Couture',
    count: 70,
    prefix: 'couture',
    paletteHues: [25, 345, 210, 50, 150, 280, 185, 320, 10, 240],
    saturation: 75,
    lightness: 52,
    mode: 'dark',
    names: [
      'Chanel Tweed Bouclé Noir & Blanc', 'Hermès Birkin Togo Orange H', 'Yves Saint Laurent Le Smoking Tuxedo', 'Gucci Flora Botanical Heritage',
      'Tiffany & Co. Robin Egg 1837 Blue', 'Christian Louboutin Rouge Loubi Lacquer', 'Burberry Trench Gabardine Honey', 'Dior Haute Houndstooth Bar Jacket',
      'Versace Medusa Barocco Gilded Filigree', 'Prada Saffiano Charcoal Cross-Hatch', 'Bottega Veneta Intrecciato Parakeet Green', 'Balenciaga Cyber Gothic Armor',
      'Alexander McQueen Royal Highland Tartan', 'Valentino Rosso Silk Georgette', 'Maison Margiela Tabi Split-Toe White', 'Comme des Garçons Play Heart Red',
      'Thom Browne Grosgrain Stripe Navy', 'Armani Privé Midnight Silk Velvet', 'Fendi Zucca Monogram Tobacco & Black', 'Givenchy Antigona Architectural Noir',
      'Loewe Puzzle Anagram Calfskin Tan', 'Celine Triomphe Canvas Monogram', 'Saint Laurent Rive Gauche Leopard Velvet', 'Tom Ford Black Orchid Satin Lapel',
      'Brunello Cucinelli Solomeo Cashmere Taupe', 'Loro Piana Vicuña Andean Golden Fleece', 'Berluti Patina Venezia Leather Tobacco', 'Goyard Goyardine Chevron Canvas Black',
      'Rimowa Aluminium Original Silver Grooves', 'Cartier Panthère Emerald & Onyx', 'Van Cleef & Arpels Alhambra Mother-of-Pearl', 'Bulgari Serpenti Diamond Scales',
      'Chopard Happy Diamonds Crystal Floating', 'Piaget Altiplano Ultra-Thin Rose Gold', 'Audemars Piguet Royal Oak Tapisserie Blue', 'Patek Philippe Nautilus Porcellain 5711',
      'Rolex Submariner Hulk Green Ceramic', 'Rolex Daytona Cosmograph Panda White', 'Omega Speedmaster Moonwatch Hesalite', 'Jaeger-LeCoultre Reverso Duoface Art Deco',
      'Vacheron Constantin Overseas Maltese Blue', 'A. Lange & Söhne Lange 1 Outsize Date', 'Breguet Classique Guilloché Coin Edge', 'Blancpain Fifty Fathoms Ocean Sapphire',
      'Richard Mille NTPT Carbon Skeleton', 'MB&F Horological Machine Space Age', 'Urwerk Satellite Wandering Hour Gunmetal', 'De Bethune Starry Varius Blued Titanium',
      'Graff Yellow Diamond Radiant Vivid', 'Harry Winston Ultimate Winston Cluster', 'Mikimoto Akoya Cultured Pearl Luster', 'Buccellati Rigato Engraved Gold Lace',
      'Schiaparelli Shocking Pink Surrealistic', 'Iris van Herpen 3D Biomimetic Skeleton', 'Gautier Breton Sailor Stripe Marinière', 'Issey Miyake Pleats Please Structural Coral',
      'Yohji Yamamoto Deconstructed Black Crow', 'Rick Owens Geobasket Brutalist Chalk', 'Raf Simons Riot Riot Riot Camouflage', 'Dries Van Noten Belgian Floral Brocade',
      'Jacquemus Le Chiquito Lavender Suede', 'Off-White Industrial Belt Hazard Yellow', 'Acne Studios Stockholm Millennial Rose', 'Ami Paris De Coeur Heart Embroidered',
      'Zegna Oasi Linen Trivero Cream', 'Lanvin Jeanne Arpège Blue Ribbon', 'Courrèges Space Age Vinyl White', 'Paco Rabanne 1969 Metal Mesh Disc',
      'Halston Studio 54 Liquid Lamé Gold', 'Vivienne Westwood Seditionaries Punk Plaid'
    ],
  },

  // 22. Deep Oceanic Trenches & Marine Biology (70 themes)
  {
    category: 'Deep Oceanic Trenches & Marine',
    count: 70,
    prefix: 'ocean',
    paletteHues: [210, 185, 160, 240, 290, 130, 200, 330, 70, 220],
    saturation: 82,
    lightness: 50,
    mode: 'dark',
    names: [
      'Mariana Trench Challenger Deep 11000m', 'Bioluminescent Anglerfish Photophore', 'Great Barrier Reef Living Coral Bloom', 'Siphonophore Giant Pelagic Thread',
      'Giant Squid Architeuthis Abyssal Ink', 'Narwhal Arctic Polar Tusker Frost', 'Blue Whale Antarctic Krill Swarm', 'Crown-of-Thorns Acanthaster Neon',
      'Comb Jelly Ctenophore Diffraction Prism', 'Flying Fish Exocoetidae Glaucous Wing', 'Giant Kelp Forest Canopy Monterey', 'Sea Anemone Symbiotic Tentacle Wave',
      'Manta Ray Oceanic Wing Glide Indigo', 'Chambered Nautilus Fibonacci Septa', 'Vampire Squid Vampyroteuthis Cloak', 'Barreleye Macropinna Transparent Dome',
      'Gulper Eel Saccopharynx Pelagic Maw', 'Black Swallower Chiasmodon Deep Gulf', 'Dumbo Octopus Grimpoteuthis Ear Fin', 'Frilled Shark Chlamydoselachus Primitive',
      'Goblin Shark Mitsukurina Jaws Pink', 'Coelacanth Living Fossil Latimeria', 'Hydrothermal Vent Black Smoker Chimney', 'Hydrothermal Vent White Smoker Aragonite',
      'Riftia Pachyptila Giant Tube Worm Red', 'Yeti Crab Kiwa Hirsuta Hydrothermal', 'Scaly-Foot Snail Iron Sulfide Armor', 'Sea Pig Scotoplanes Benthic Herd',
      'Benthic Xenophyophore Single Cell Giant', 'Hadal Amphipod Hirondellea Gigas', 'Atolla Jellyfish Ring Flash Crimson', 'Crystal Jelly Aequorea Victoria GFP',
      'Lion Mane Jellyfish Cyanea Medusa', 'Portuguese Man o War Physalia Sail', 'Blue Glaucus Dragon Sea Slug Cerata', 'Leafy Seadragon Phycodurus Camouflage',
      'Weedy Seadragon Phyllopteryx Ruby', 'Pygmy Seahorse Gorgonian Fan Coral', 'Mantis Shrimp Peacock Hyper Spectral', 'Bobbit Worm Eunice Aphroditois Rainbow',
      'Mimic Octopus Thaumoctopus Camouflage', 'Blue-Ringed Octopus Hapalochlaena Warning', 'Flamboyant Cuttlefish Metasepia Waves', 'Giant Pacific Octopus Enteroctopus Rouge',
      'Moray Eel Gymnothorax Leopard Ribbons', 'Ribbon Eel Rhinomuraena Blue Ribbon', 'Mandarin Fish Synchiropus Psychedelic', 'Parrotfish Scarus Turquoise Beak',
      'Clownfish Amphiprion Ocellaris White Stripe', 'Regal Tang Paracanthurus Electric Royal', 'Moorish Idol Zanclus Bannerfish Stripes', 'Lionfish Pterois Feathered Venom Fin',
      'Stonefish Synanceia Reef Cryptic Stone', 'Whale Shark Rhincodon White Star Constellation', 'Hammerhead Sphyrna Schooling Seamount', 'Great White Carcharodon Counter Shading',
      'Tiger Shark Galeocerdo Pelagic Shadow', 'Mako Shark Isurus Deep Indigo Torpedo', 'Basking Shark Cetorhinus Plankton Filter', 'Green Sea Turtle Chelonia Mydas Lagoon',
      'Hawksbill Turtle Eretmochelys Shell Agate', 'Leatherback Turtle Dermochelys Pelagic Slate', 'Orca Killer Whale Killer Dorsal Noir', 'Beluga Whale Delphinapterus Arctic Ice',
      'Dolphin Spinner Stenella Aerial Acrobat', 'Manatee Trichechus Crystal River Warmth', 'Sea Otter Enhydra Kelp Wrap Fur', 'Harbor Seal Phoca Vitulina Coastal Rock',
      'Walrus Odobenus Bering Sea Tusk Amber', 'Elephant Seal Mirounga Deep Diver'
    ],
  },

  // 23. Architectural Eras & Movements (70 themes)
  {
    category: 'Architectural Eras & Movements',
    count: 70,
    prefix: 'arch',
    paletteHues: [35, 200, 260, 110, 15, 175, 45, 225, 310, 140],
    saturation: 62,
    lightness: 54,
    mode: 'dark',
    names: [
      'Bauhaus Dessau Primary Functionalism', 'Art Deco Chrysler Spire Chrome', 'Brutalist Boston City Hall Concrete', 'Gothic Notre Dame Cathedral Limestone',
      'Mid-Century Modern Eames Walnut & Ochre', 'Japanese Wabi-Sabi Hinoki Cypress', 'Moorish Alhambra Palace Ceramic Zellige', 'Deconstructivist Gehry Titanium Bilbao',
      'Victorian Painted Ladies San Francisco', 'Scandinavian Hygge Light Birch White', 'Renaissance Brunelleschi Florence Duomo', 'Beaux-Arts Grand Central Terminal Brass',
      'Baroque Versailles Hall of Mirrors Gold', 'Rococo Sanssouci Pastel Filigree', 'Romanesque Durham Cathedral Norman Arch', 'Byzantine Hagia Sophia Gold Mosaic',
      'Ancient Roman Pantheon Oculus Light', 'Classical Greek Parthenon Pentelic Marble', 'Ancient Egyptian Karnak Hypostyle Column', 'Mesopotamian Ishtar Gate Glazed Cobalt',
      'Persian Persepolis Apadana Relief Basalt', 'Mughal Taj Mahal Translucent White Marble', 'Ottoman Blue Mosque Iznik Tiles', 'Russian Onion Dome St. Basils Crimson',
      'International Style Seagram Building Bronze', 'Constructivist Tatlin Tower Iron Spiral', 'Futurist SantElia Citta Nuova Electric', 'Metabolism Nakagin Capsule Tower Modular',
      'Postmodernist Piazza dItalia New Orleans', 'High-Tech Pompidou Center Primary Tubes', 'Parametric Zaha Hadid Flowing White Ribbons', 'Critical Regionalism Barragan Magenta Walls',
      'Minimalist Tadao Ando Smooth Shuttering', 'Prairie School Frank Lloyd Wright Fallingwater', 'Googie Space Age Theme Building LAX', 'Streamline Moderne Ocean Liner Curve',
      'Arts and Crafts William Morris Willow Bough', 'Art Nouveau Victor Horta Tassel Ironwork', 'Secessionist Otto Wagner Postal Sparkasse', 'De Stijl Gerrit Rietveld Red & Blue',
      'Expressionist Erich Mendelsohn Einstein Tower', 'Organic Architecture Taliesin West Desert Stone', 'Tropical Modernism Geoffrey Bawa Lunuganga', 'Svensk Tenn Josef Frank Botanicals',
      'Shingle Style Newport Rhode Island Cedar', 'Federal Style Boston Beacon Hill Brick', 'Greek Revival Plantation Column Portico', 'Italianate Brownstone New York Cornice',
      'Second Empire Mansard Slate Roof Paris', 'Châteauesque Biltmore Estate Indiana Stone', 'Colonial Revival White Clapboard Shutter', 'Tudor Revival Half-Timber Black & White',
      'Mission Revival San Juan Capistrano Stucco', 'Spanish Colonial Revival Santa Barbara Tile', 'Pueblo Revival Taos Adobe Mud Brick', 'Bungalow Craftsman Pasadena Arroyo Stone',
      'Geodesic Dome Buckminster Fuller Struts', 'Space Architecture ISS Cupola Module', 'Vernacular Cycladic Whitewashed Blue Dome', 'Nordic Stave Church Borgund Tarred Timber',
      'Himalayan Dzong Fortress Ochre & White', 'Torii Gate Fushimi Inari Sacred Vermilion', 'Pagoda Fogong Temple Wooden Interlocking', 'Hanging Monastery Hengshan Cliff Planks',
      'Stepwell Chand Baori Geometric Sandstone', 'Petra Treasury Al-Khazneh Rose Rock', 'Mesa Verde Cliff Palace Sandstone Alcove', 'Machu Picchu Incan Ashlar Granite Fitting',
      'Angkor Wat Khmer Sandstone Bas-Relief', 'Borobudur Stupa Volcanic Andesite Stone'
    ],
  },

  // 24. Music Genres & Audio Production (70 themes)
  {
    category: 'Music Genres & Soundwaves',
    count: 70,
    prefix: 'audio',
    paletteHues: [280, 45, 195, 340, 130, 220, 15, 310, 85, 170],
    saturation: 84,
    lightness: 54,
    mode: 'dark',
    names: [
      'Lo-Fi Chill Beats Vintage Cassette Warmth', 'Heavy Metal Distortion Boss HM-2 Obsidian', 'Synthwave 1984 Sunset Grid Outrun', 'Acid Techno Roland TB-303 Neon Lime',
      'Detroit Deep House Motor City Velvet', 'Delta Blues Muddy Waters Indigo Slide', 'Classical Symphony Mahler 2nd Brass', 'Drum and Bass Amen Break 174 BPM',
      'Vaporwave Floral Shoppe Roman Bust Pastel', 'Jazz Blue Note Rudy Van Gelder Midnight', 'Reggae Roots Dub King Tubby Green & Gold', 'Shoegaze My Bloody Valentine Fuzzy Lilac',
      'Post-Punk Joy Division Unknown Pleasures Wave', 'Ambient Brian Eno Music for Airports Sky', 'Krautrock Kraftwerk Autobahn Minimalist', 'Psychedelic Rock Pink Floyd Dark Moon Prism',
      'Grunge Nirvana Nevermind Sub Pop Cyan', 'Trip-Hop Bristol Massive Attack Blue Lines', 'Funk Parliament Mothership Star Child Gold', 'Motown Detroit Hitsville USA Red Studio',
      'Hip-Hop Boom Bap SP-1200 12-Bit Grit', 'Trap 808 Sub-Bass Atlanta 808 Boom', 'Grime London East Bow E3 White Label', 'Afrobeat Fela Kuti Kalakuta Republic Horns',
      'Samba Rio Batucada Favela Carnival Gold', 'Bossa Nova Ipanema Beach Nylon String', 'Flamenco Paco de Lucia Andalusian Fire', 'Celtic Folk Fiddle Emerald Turf Fire',
      'Bluegrass Banjo Appalachian Mountain Fog', 'Outlaw Country Willie Nelson Trigger Spruce', 'Industrial Nine Inch Nails Downward Spiral Rust', 'EBM Front 242 Body Pop Strobe',
      'Trance Gate Armin Van Buuren Euphoric Azure', 'Progressive House Deadmau5 Cube 5000 LED', 'Dubstep Skrillex Scary Monsters Growl', 'Future Bass Flume Granular Synth Peach',
      'Hardstyle Q-Dance Defqon.1 Laser Orange', 'IDM Aphex Twin Selected Ambient Works Tan', 'Glitch Autechre Confield Algorithmic Fracture', 'Chiptune Game Boy LSDJ 8-Bit Square Wave',
      'Modular Eurorack Patch Cable Spaghetti Neon', 'Moog Minimoog Model D Walnut & Brass', 'Prophet-5 Sequential Circuits Analog Brass', 'Yamaha CS-80 Vangelis Blade Runner Brass',
      'Roland Jupiter-8 Arpeggio Sunset Orange', 'Roland TR-808 Cowbell Cymbal Gold', 'Roland TR-909 Ride Cymbal House Snare', 'Fairlight CMI Series II Green CRT Sample',
      'Synclavier Digital Music Synthesis Silver', 'Neve 8078 Mixing Console British Warmth', 'SSL 4000 G-Series Bus Compressor Punch', 'Abbey Road TG12345 Beatles Console Gray',
      'Teletronix LA-2A Optical Tube Glow Orange', 'Universal Audio 1176LN Peak Limiter Meter', 'Pultec EQP-1A Tube Program Equalizer Teal', 'Sennheiser MD 421 Dynamic Tom Basket',
      'Shure SM57 Snare Resonant Steel Grille', 'Neumann U 87 Ai Studio Large Diaphragm Nickel', 'AKG C414 Multi-Pattern Brass Capsule', 'Coles 4038 Ribbon Figure-8 Waffle',
      'Electro-Voice RE20 Variable-D Broadcast Beige', 'Strandberg Ergonomic headless Cyan Burst', 'Fender Stratocaster 1954 2-Tone Sunburst', 'Gibson Les Paul Standard Goldtop 1957',
      'Rickenbacker 4001 Fireglo Bass Ric-O-Sound', 'PRS Custom 24 Ten Top Flame Maple Blue', 'Fender Rhodes Mark I Suitcase Tine Bell', 'Wurlitzer 200A Electric Piano Red Tolex',
      'Hammond B3 Organ Leslie Rotating Horn Walnut', 'Mellotron M400 Flute Tape Loop White'
    ],
  },

  // 25. Botanical Flora & Secret Gardens (70 themes)
  {
    category: 'Botanical Flora & Secret Gardens',
    count: 70,
    prefix: 'flora',
    paletteHues: [140, 320, 275, 45, 200, 15, 95, 345, 170, 60],
    saturation: 76,
    lightness: 52,
    mode: 'dark',
    names: [
      'Midnight Dahlia Black Velvet Petals', 'Blue Himalayan Poppy Meconopsis Cyan', 'Japanese Wisteria Ashikaga Violet Cloud', 'Black Baccara Hybrid Tea Rose Noir',
      'Bird of Paradise Strelitzia Exotic Orange', 'Venus Flytrap Dionaea Carnivorous Lime', 'Golden Barrel Cactus Echinocactus Spines', 'English Lavender Cotswold Purple Field',
      'Giant Redwood Sequoia Sempervirens Bark', 'Blue Jacaranda Pretoria Spring Canopy', 'Monstera Deliciosa Variegata Albo Leaf', 'Dragon Blood Tree Socotra Crimson Resin',
      'Sacred Lotus Nelumbo Nucifera Basin White', 'Orchid Ghost Dendrophylax Leafless White', 'Corpse Flower Titan Arum Burgundy Spathe', 'Pitcher Plant Nepenthes Rajah Bornean Carnivore',
      'Water Lily Victoria Amazonica Giant Pad', 'Cherry Blossom Somei Yoshino Pale Sakura', 'Plum Blossom Ume Winter Frost Scarlet', 'Ginkgo Biloba Autumn Maidenhair Gold',
      'Japanese Maple Momiji Scarlet Lace Leaf', 'Bonsai Pine Pinus Parviflora Weathered Needles', 'Moss Garden Saiho-ji Kyoto Emerald Velvet', 'Fern Tree Cyathea Cloud Forest Frond',
      'Air Plant Tillandsia Xerographica Silver', 'Staghorn Fern Platycerium Antler Shield', 'Calathea Orbiculata Silver Striped Leaves', 'Fiddle Leaf Fig Ficus Lyrata Emerald',
      'Rubber Tree Ficus Elastica Burgundy Sheen', 'Pothos Golden Epipremnum Aureum Marbled', 'Snake Plant Sansevieria Trifasciata Variegated', 'ZZ Plant Zamioculcas Raven Black Leaf',
      'String of Pearls Senecio Rowleyanus Beads', 'Hoya Kerrii Sweetheart Sweet Heart Green', 'Peperomia Watermelon Argyreia Striped', 'Begonia Maculata Polka Dot Silver Wing',
      'African Violet Saintpaulia Royal Purple', 'Anthurium Clarinerivium Dark Velvet Leaf', 'Philodendron Pink Princess Variegated Blush', 'Philodendron Gloriosum Velvet White Vein',
      'Alocasia Polly Amazonica Dragon Mask', 'Alocasia Frydek Green Velvet Arrow Leaf', 'Ctenanthe Burle-Marxii Fishbone Calathea', 'Aglaonema Chinese Evergreen Red Siam',
      'Dieffenbachia Dumb Cane Camille Cream Center', 'Bromeliad Aechmea Fasciata Pink Urn', 'Jasmine Night Blooming Cestrum Nocturnum', 'Gardenia Jasminoides Creamy Garden Bloom',
      'Camellia Japonica Scarlet Emperor Petal', 'Magnolia Grandiflora Southern Cream Magnolia', 'Hydrangea Macrophylla Acidic Blue Mophead', 'Peony Sarah Bernhardt Ruffled Pink',
      'Tulip Queen of Night Black Satin Cup', 'Iris Germanica Bearded Velvet Indigo', 'Daffodil King Alfred Golden Trumpet', 'Hyacinth Orientalis Fragrant Spring Blue',
      'Foxglove Digitalis Purpurea Speckled Bell', 'Poppy Papaver Rhoeas Flanders Crimson', 'Sunflower Helianthus Annuus Tuscan Giant Gold', 'Cosmos Atrosanguineus Chocolate Petals',
      'Marigold Tagetes Erecta Day of the Dead Orange', 'Zinnia Elegans Queen Lime Red Bi-Color', 'Morning Glory Heavenly Blue Climbing Vine', 'Bleeding Heart Lamprocapnos Spectabilis Pink',
      'Lily of the Valley Convallaria White Bell', 'Snowdrop Galanthus Nivalis Winter Piercer', 'Edelweiss Leontopodium Alpine Woolly Star', 'Heather Calluna Vulgaris Scottish Moorland',
      'Eucalyptus Silver Dollar Blue Gum Leaves', 'Olive Branch Olea Europaea Tuscan Sage'
    ],
  },

  // 26. Dual-Tone Harmonic Chromatics (70 themes)
  {
    category: 'Harmonic Chromatic Scale 360° II',
    count: 70,
    prefix: 'harm2',
    paletteHues: Array.from({ length: 70 }, (_, i) => Math.round((i * 360) / 70)),
    saturation: 90,
    lightness: 52,
    mode: 'dark',
    names: Array.from({ length: 70 }, (_, i) => {
      const deg = Math.round((i * 360) / 70);
      return `Bichromatic Vector ${deg}° Spectral`;
    }),
  },
];

export const extendedThemes: ThemePreset[] = [];

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
  extendedThemes.push({
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

// Generate all extended collections
extendedCollections.forEach((col) => {
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
