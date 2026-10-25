export type ClickActionType =
  | 'power_up_aura'
  | 'shadow_rise'
  | 'chainsaw_rev'
  | 'lightning_burst'
  | 'water_spin'
  | 'blood_demon_art'
  | 'infinity_bubble'
  | 'titan_shake'
  | 'odm_swing'
  | 'rasengan_charge'
  | 'sharingan_flash'
  | 'alchemy_clap'
  | 'death_note_write'
  | 'saiyan_transform'
  | 'rubber_stretch'
  | 'sword_slash'
  | 'gun_draw'
  | 'speed_blur'
  | 'rock_paper_scissors'
  | 'spy_disguise'
  | 'forger_kick'
  | 'telepathy_face'
  | 'berserker_roar'
  | 'samurai_draw'
  | 'electric_violin'
  | 'giant_fist'
  | 'sun_breathing'
  | 'ice_age'

export interface ClickAction {
  type: ClickActionType
  duration: number
  particleColor: string
  soundCue: string
  description: string
}

export interface GameActions {
  idle: string
  thinking: string
  correct: string
  incorrect: string
  victory: string
}

export interface Character {
  id: string
  name: string
  anime: string
  rank: number
  color: string
  accentColor: string
  eyeColor: string
  description: string
  clickAction: ClickAction
  gameActions: GameActions
}

export const CHARACTERS: Character[] = [
  {
    id: 'eren', name: 'Eren Yeager', anime: 'Attack on Titan', rank: 1,
    color: '#3D6B4F', accentColor: '#8B4513', eyeColor: '#39FF14',
    description: 'The rumbling begins.',
    clickAction: { type: 'titan_shake', duration: 800, particleColor: '#8B4513', soundCue: 'titan_transform', description: 'Screen shakes, steam jets burst, green eye glow, scales up 1.4×' },
    gameActions: { idle: 'Arms crossed, slow head turn', thinking: 'Hand to chin, leans forward', correct: 'Fist pump forward, green eye glow', incorrect: 'Head down, fists clench', victory: 'Spreads arms wide, titan steam bursts' },
  },
  {
    id: 'mikasa', name: 'Mikasa Ackerman', anime: 'Attack on Titan', rank: 1,
    color: '#C0C0C0', accentColor: '#DC143C', eyeColor: '#708090',
    description: 'Protect what matters most.',
    clickAction: { type: 'odm_swing', duration: 600, particleColor: '#DC143C', soundCue: 'odm_gear', description: 'Dashes horizontally with motion blur, red scarf streams behind' },
    gameActions: { idle: 'Red scarf sways, subtle sway', thinking: 'Eyes closed, scarf flows upward', correct: 'Quick precise strike, scarf flares', incorrect: 'Slight backward step', victory: 'ODM gear swing circles the podium' },
  },
  {
    id: 'armin', name: 'Armin Arlert', anime: 'Attack on Titan', rank: 1,
    color: '#F4C430', accentColor: '#4169E1', eyeColor: '#4169E1',
    description: 'Strategy wins every war.',
    clickAction: { type: 'power_up_aura', duration: 700, particleColor: '#F4C430', soundCue: 'strategy_plan', description: 'Blue tactical map lines flash, golden colossal titan outline glows' },
    gameActions: { idle: 'Finger to temple, thoughtful pose', thinking: 'Nods slowly, tactical light appears', correct: 'Pumps fist, shouts silently', incorrect: 'Holds head in hands', victory: 'Map lines resolve into winning ✓' },
  },
  {
    id: 'edward', name: 'Edward Elric', anime: 'Fullmetal Alchemist: Brotherhood', rank: 2,
    color: '#FFD700', accentColor: '#C0392B', eyeColor: '#FFD700',
    description: 'Equivalent exchange.',
    clickAction: { type: 'alchemy_clap', duration: 600, particleColor: '#FFD700', soundCue: 'alchemy_clap', description: 'Hands clap, white spark, blue transmutation circle draws and dissolves' },
    gameActions: { idle: 'Automail arm glints, crosses arms', thinking: 'Crouches, hands flat, circle glows', correct: 'Jumps, punches air, golden flash', incorrect: 'Slumps, automail arm drops', victory: 'Full alchemy circle surrounds podium' },
  },
  {
    id: 'alphonse', name: 'Alphonse Elric', anime: 'Fullmetal Alchemist: Brotherhood', rank: 2,
    color: '#A0A0A0', accentColor: '#FFD700', eyeColor: '#FF4500',
    description: 'The soul inside the armor.',
    clickAction: { type: 'alchemy_clap', duration: 700, particleColor: '#A0A0A0', soundCue: 'armor_clank', description: 'Massive armor claps, shockwave ring expands, blood seal glows red' },
    gameActions: { idle: 'Gentle sway, head tilted kindly', thinking: 'Sits cross-legged, circle glows on chest', correct: 'Giant thumbs-up, happy bounce', incorrect: 'Head droops, armor clanks', victory: 'Full body glow, soul light pours from collar' },
  },
  {
    id: 'tanjiro', name: 'Tanjiro Kamado', anime: 'Demon Slayer', rank: 3,
    color: '#2E4A7A', accentColor: '#00CED1', eyeColor: '#DC143C',
    description: 'Total concentration, constant.',
    clickAction: { type: 'water_spin', duration: 900, particleColor: '#00CED1', soundCue: 'water_breathing', description: 'Spins elegantly, water trails form flowing arcs — Breath of Water Form 1' },
    gameActions: { idle: 'Hanafuda earrings sway, slow breathing', thinking: 'Closes eyes, water droplets form', correct: 'Water arc slash, scar glows red', incorrect: 'Grits teeth, clenches sword handle', victory: 'Full Hinokami Kagura pose, flame + water spiral' },
  },
  {
    id: 'nezuko', name: 'Nezuko Kamado', anime: 'Demon Slayer', rank: 3,
    color: '#FF69B4', accentColor: '#FF1493', eyeColor: '#FF69B4',
    description: 'Exploding Blood: Rampage!',
    clickAction: { type: 'blood_demon_art', duration: 800, particleColor: '#FF1493', soundCue: 'blood_demon_art', description: 'Pink flame petals explode outward, grows 1.3×, shrinks back with cute pose' },
    gameActions: { idle: 'Bamboo muzzle bobs, kimono sways', thinking: 'Head tilted, eyes glow pink', correct: 'Powerful flying kick, pink flames trail', incorrect: 'Shakes head, muzzle droops', victory: 'Full large mode, blood art petals rain' },
  },
  {
    id: 'zenitsu', name: 'Zenitsu Agatsuma', anime: 'Demon Slayer', rank: 3,
    color: '#FFD700', accentColor: '#FFA500', eyeColor: '#FFD700',
    description: 'Thunderclap and Flash.',
    clickAction: { type: 'lightning_burst', duration: 500, particleColor: '#FFD700', soundCue: 'thunder_breath', description: 'Yellow lightning bolt strikes, character becomes blur, reappears with sparks' },
    gameActions: { idle: 'Crying pose with tears, then deadpan focus', thinking: 'Panicking, hair standing on end', correct: 'Asleep-fighting pose, lightning crackles', incorrect: 'Full dramatic collapse, wailing', victory: 'Six-fold lightning explosion, golden radiance' },
  },
  {
    id: 'inosuke', name: 'Inosuke Hashibira', anime: 'Demon Slayer', rank: 3,
    color: '#4169E1', accentColor: '#00BFFF', eyeColor: '#00FF7F',
    description: 'Beast Breathing: total madness.',
    clickAction: { type: 'berserker_roar', duration: 700, particleColor: '#4169E1', soundCue: 'beast_roar', description: 'Boar mask tilts back in roar, dual blades raise, blue energy ripples' },
    gameActions: { idle: 'Flexes repeatedly, boar head jerks around', thinking: 'Dual swords crossed, intense stare', correct: 'Wild dual slash, howls triumphantly', incorrect: 'Slams dual blades into ground', victory: 'Goes feral, spins swords, fireworks explode' },
  },
  {
    id: 'muzan', name: 'Muzan Kibutsuji', anime: 'Demon Slayer', rank: 3,
    color: '#1C1C1C', accentColor: '#8B0000', eyeColor: '#DC143C',
    description: 'I am a being that is close to perfection.',
    clickAction: { type: 'blood_demon_art', duration: 1000, particleColor: '#8B0000', soundCue: 'muzan_aura', description: 'Black-red aura radiates, blood tendrils from fingertips, eyes slit red, card darkens' },
    gameActions: { idle: 'Perfectly still in white suit, unsettling', thinking: 'Single raised eyebrow, red eyes slit', correct: 'Derisive smirk, blood tendrils retract', incorrect: 'Eyes widen in fury, screen flashes red', victory: 'Final form — bioflesh whips, progenitor aura' },
  },
  {
    id: 'naruto', name: 'Naruto Uzumaki', anime: 'Naruto: Shippuden', rank: 4,
    color: '#FF8C00', accentColor: '#FFD700', eyeColor: '#FF4500',
    description: 'Believe it! Dattebayo!',
    clickAction: { type: 'rasengan_charge', duration: 800, particleColor: '#4169E1', soundCue: 'rasengan', description: 'Clone hand appears, blue spiral Rasengan forms and pulses, thrust forward' },
    gameActions: { idle: 'Crosses arms behind head, whisker marks visible', thinking: 'Shadow Clone Hand Sign pose', correct: 'Double thumbs up, foxy grin', incorrect: 'Scratches back of head, awkward laugh', victory: 'Kurama chakra mode, golden-orange aura erupts' },
  },
  {
    id: 'sasuke', name: 'Sasuke Uchiha', anime: 'Naruto: Shippuden', rank: 4,
    color: '#191970', accentColor: '#DC143C', eyeColor: '#DC143C',
    description: 'The Sharingan never blinks.',
    clickAction: { type: 'sharingan_flash', duration: 700, particleColor: '#DC143C', soundCue: 'chidori', description: 'Eyes flash, Sharingan tomoe spin, Chidori crackles in right hand' },
    gameActions: { idle: 'Arms crossed, brooding stare, Sharingan glow', thinking: 'Eyes narrow, Sharingan spins slowly', correct: 'Rinnegan flash, cool nod', incorrect: 'Looks away dismissively', victory: 'Susanoo outline erupts blue, sword raises' },
  },
  {
    id: 'itachi', name: 'Itachi Uchiha', anime: 'Naruto: Shippuden', rank: 4,
    color: '#2C1654', accentColor: '#DC143C', eyeColor: '#DC143C',
    description: 'Tsukuyomi.',
    clickAction: { type: 'sharingan_flash', duration: 900, particleColor: '#8B008B', soundCue: 'genjutsu', description: 'Mangekyou pattern expands to fill card, Amaterasu black flames, crows scatter' },
    gameActions: { idle: 'One-finger poke gesture, crows orbit', thinking: 'Hand seal, Mangekyou glows', correct: 'Subtle nod, crows scatter outward', incorrect: 'Coughs slightly, arm covers mouth', victory: 'Susanoo giant form emerges in background' },
  },
  {
    id: 'gaara', name: 'Gaara', anime: 'Naruto: Shippuden', rank: 4,
    color: '#8B4513', accentColor: '#DEB887', eyeColor: '#228B22',
    description: 'Sand Burial.',
    clickAction: { type: 'shadow_rise', duration: 950, particleColor: '#DEB887', soundCue: 'sand_surge', description: 'Sand particles rush upward in vortex, Third Eye opens, sand sphere forms' },
    gameActions: { idle: 'Sand hovers in orbit, gourd on back', thinking: 'Sand forms defensive wall', correct: 'Sand Tsunami sweeps the stage', incorrect: 'Sand shield takes hit — impenetrable', victory: 'Shukaku partial transformation, sand tidal wave' },
  },
  {
    id: 'thorfinn', name: 'Thorfinn', anime: 'Vinland Saga', rank: 5,
    color: '#8B4513', accentColor: '#C0C0C0', eyeColor: '#00CED1',
    description: 'True warrior has no enemies.',
    clickAction: { type: 'samurai_draw', duration: 600, particleColor: '#C0C0C0', soundCue: 'knife_draw', description: 'Both short knives draw in X slash, afterimage remains, calm readiness pose' },
    gameActions: { idle: 'Cleaning knife, cool composure', thinking: 'Eyes distant, gripping knife handle', correct: 'Clean swift double strike motion', incorrect: 'Exhales slowly, stares at ground', victory: 'Northern lights shimmer behind, at peace' },
  },
  {
    id: 'spike', name: 'Spike Spiegel', anime: 'Cowboy Bebop', rank: 6,
    color: '#4169E1', accentColor: '#FFA500', eyeColor: '#8B0000',
    description: 'Whatever happens, happens.',
    clickAction: { type: 'gun_draw', duration: 600, particleColor: '#FFA500', soundCue: 'bebop_gun', description: 'Slow-mo gun draw with cigarette, muzzle flash, blows imaginary smoke' },
    gameActions: { idle: 'Leans against invisible wall, extremely chill', thinking: 'Drags cigarette, squints', correct: 'Finger gun, wink', incorrect: 'Shrugs with one shoulder, still cool', victory: 'Jeet Kune Do pose, jazz star burst' },
  },
  {
    id: 'faye', name: 'Faye Valentine', anime: 'Cowboy Bebop', rank: 6,
    color: '#FFD700', accentColor: '#DC143C', eyeColor: '#228B22',
    description: "I'm not a lady. I'm a bounty hunter.",
    clickAction: { type: 'gun_draw', duration: 700, particleColor: '#DC143C', soundCue: 'bebop_gun_faye', description: 'Dual pistols drawn with flirtatious spin, coin tossed upward, character winks' },
    gameActions: { idle: 'Inspects nails, flips hair, utterly bored', thinking: 'Dual guns raised dramatically', correct: 'Blows on gun barrels, smirks', incorrect: 'Groans, slaps forehead', victory: 'Money rains down, laughs victoriously' },
  },
  {
    id: 'yuji', name: 'Yuji Itadori', anime: 'Jujutsu Kaisen', rank: 7,
    color: '#FF4500', accentColor: '#FF69B4', eyeColor: '#FF4500',
    description: 'Black Flash!',
    clickAction: { type: 'lightning_burst', duration: 600, particleColor: '#000080', soundCue: 'black_flash', description: 'Fist reels back, black distortion warps space, punch hits with dark blue cursed energy' },
    gameActions: { idle: 'Shadowboxing slowly, relaxed athlete', thinking: 'Crouches in fighting stance', correct: 'Black Flash explosion punch', incorrect: 'Takes a hit, stumbles — grins anyway', victory: 'Sukuna tattoos briefly appear, massive cursed energy' },
  },
  {
    id: 'gojo', name: 'Satoru Gojo', anime: 'Jujutsu Kaisen', rank: 7,
    color: '#4169E1', accentColor: '#00FFFF', eyeColor: '#4169E1',
    description: 'Throughout Heaven and Earth, I alone am the honored one.',
    clickAction: { type: 'infinity_bubble', duration: 1000, particleColor: '#00FFFF', soundCue: 'infinity', description: 'Blindfold slides, Limitless sphere expands, card shatters and reforms' },
    gameActions: { idle: 'Blindfold on, arms behind head, carefree', thinking: 'Blindfold off, six eyes glow blue', correct: 'Hollow Purple forms between palms', incorrect: 'Yawns dismissively', victory: 'Domain Expansion: Infinite Void — stars swirl' },
  },
  {
    id: 'megumi', name: 'Megumi Fushiguro', anime: 'Jujutsu Kaisen', rank: 7,
    color: '#1C1C2E', accentColor: '#0000FF', eyeColor: '#191970',
    description: 'Ten Shadows Technique.',
    clickAction: { type: 'shadow_rise', duration: 800, particleColor: '#1C1C2E', soundCue: 'shadow_dog', description: 'Shadow spreads, Divine Dog Totality partially emerges snarling, Megumi does hand signs' },
    gameActions: { idle: 'Brooding, shadows pool at feet', thinking: 'Hand signs slowly form', correct: 'Mahoraga summon flash, then quick dismiss', incorrect: 'Shadows ripple in frustration', victory: 'Chimera Shadow Garden — shadow tsunami' },
  },
  {
    id: 'nobara', name: 'Nobara Kugisaki', anime: 'Jujutsu Kaisen', rank: 7,
    color: '#FF8C00', accentColor: '#FFD700', eyeColor: '#FF8C00',
    description: "I'm beautiful, strong, and honest.",
    clickAction: { type: 'electric_violin', duration: 700, particleColor: '#FF8C00', soundCue: 'straw_doll', description: 'Hammer swings, nails fire out, Straw Doll Technique activates, cursed energy pulses' },
    gameActions: { idle: 'Hammer resting on shoulder, utterly confident', thinking: 'Nails arranged in grid, strategic', correct: 'Hairpin Technique: nails detonate', incorrect: "Scoffs, calls the question stupid", victory: 'Resonance: all nails glow, stage shatters' },
  },
  {
    id: 'sukuna', name: 'Ryomen Sukuna', anime: 'Jujutsu Kaisen', rank: 7,
    color: '#8B0000', accentColor: '#FFD700', eyeColor: '#DC143C',
    description: 'Know your place, fool.',
    clickAction: { type: 'sword_slash', duration: 800, particleColor: '#8B0000', soundCue: 'malevolent_shrine', description: 'Four arms manifest, Dismantle and Cleave carve lines across card, Sukuna grins' },
    gameActions: { idle: 'Four arms crossed, all four eyes half-closed', thinking: 'One finger raised, amused', correct: "Malevolent Shrine — domain expands", incorrect: "Laughs. Doesn't care", victory: 'True form manifest, fire arrow + Dismantle rain' },
  },
  {
    id: 'deku', name: 'Izuku Midoriya', anime: 'My Hero Academia', rank: 8,
    color: '#2ECC71', accentColor: '#00CED1', eyeColor: '#2ECC71',
    description: 'Plus Ultra!',
    clickAction: { type: 'power_up_aura', duration: 800, particleColor: '#2ECC71', soundCue: 'one_for_all', description: 'Red lightning shifts to vivid green OFA aura, launches upward, Detroit Smash windup' },
    gameActions: { idle: 'Mumbles rapidly, takes notes', thinking: 'OFA flickers, analyzing', correct: 'Full Cowl 100%, Smash punch', incorrect: 'Notebook drops, looks devastated', victory: 'Blackwhip + OFA full release, symbol of peace pose' },
  },
  {
    id: 'bakugo', name: 'Katsuki Bakugo', anime: 'My Hero Academia', rank: 8,
    color: '#FF4500', accentColor: '#FFD700', eyeColor: '#DC143C',
    description: "I'm gonna win. That's what heroes do.",
    clickAction: { type: 'lightning_burst', duration: 600, particleColor: '#FFD700', soundCue: 'explosion', description: 'Both palms open, nitroglycerin explosions blast outward, AP Shot afterburn' },
    gameActions: { idle: 'Hands in pockets, permanent scowl', thinking: 'Explosions spark in palms', correct: 'AP Shot: Auto-Cannon, explosive victory screech', incorrect: 'SEETHING rage explosion, blames the question', victory: 'Howitzer Impact, stands on explosion cloud' },
  },
  {
    id: 'allmight', name: 'All Might', anime: 'My Hero Academia', rank: 8,
    color: '#FFD700', accentColor: '#4169E1', eyeColor: '#4169E1',
    description: 'I AM HERE!',
    clickAction: { type: 'giant_fist', duration: 900, particleColor: '#FFD700', soundCue: 'united_states_smash', description: 'Muscle hero form, dramatic aura explosion, United States of SMASH fist descends' },
    gameActions: { idle: 'Muscle form thumbs-up, triumphant poster pose', thinking: 'Withered form briefly — then powers back up', correct: 'DETROIT SMASH, sunbeam burst', incorrect: "Switches to withered form, coughs — 'I'm fine'", victory: 'Symbol of Peace final form, entire stage glows gold' },
  },
  {
    id: 'mugen', name: 'Mugen', anime: 'Samurai Champloo', rank: 9,
    color: '#DC143C', accentColor: '#FF4500', eyeColor: '#8B0000',
    description: 'Breakdance swordsmanship.',
    clickAction: { type: 'samurai_draw', duration: 700, particleColor: '#DC143C', soundCue: 'breakbeat_slash', description: 'Breakdance windmill move, sword swings in chaotic arcs, hip-hop style' },
    gameActions: { idle: 'Bouncing to inaudible beat, sword across shoulders', thinking: 'Hip-hop spin, sizing up', correct: 'Wild multi-slash, grins', incorrect: 'Shrugs, flips sword lazily', victory: 'Full Champloo style dance on podium' },
  },
  {
    id: 'jin_champloo', name: 'Jin', anime: 'Samurai Champloo', rank: 9,
    color: '#708090', accentColor: '#C0C0C0', eyeColor: '#4682B4',
    description: 'Precision over chaos.',
    clickAction: { type: 'samurai_draw', duration: 500, particleColor: '#C0C0C0', soundCue: 'iaijutsu', description: 'Perfect iaijutsu — blade barely seen, only afterimage — brief freeze, re-sheath' },
    gameActions: { idle: 'Perfectly still, glasses glint', thinking: 'Eyes closed, hand on hilt', correct: 'Single precise cut, sheath sound', incorrect: 'Glasses adjust, unfazed', victory: 'Two-sword stance, cherry blossom petals fall' },
  },
  {
    id: 'naofumi', name: 'Naofumi Iwatani', anime: 'The Rising of the Shield Hero', rank: 10,
    color: '#2F4F4F', accentColor: '#DC143C', eyeColor: '#DC143C',
    description: 'Shield Prison!',
    clickAction: { type: 'giant_fist', duration: 800, particleColor: '#DC143C', soundCue: 'shield_bash', description: 'Massive shield raises, Wrath Shield dark curse aura billows red-black, slams forward' },
    gameActions: { idle: 'Shield raised in permanent defensive stance', thinking: 'Checks skill list on shield', correct: 'Shield Counter bash + satisfied smirk', incorrect: 'Curses quietly, shield blocks face', victory: 'Shooting Star Shield radiates, Raphtalia + Filo appear' },
  },
  {
    id: 'yusuke', name: 'Yusuke Urameshi', anime: 'Yu Yu Hakusho', rank: 11,
    color: '#228B22', accentColor: '#FFD700', eyeColor: '#FFD700',
    description: 'Spirit Gun!',
    clickAction: { type: 'rasengan_charge', duration: 700, particleColor: '#228B22', soundCue: 'spirit_gun', description: 'Finger points, green spirit energy concentrates, Spirit Gun blast fires' },
    gameActions: { idle: "Hands in pockets, delinquent lean", thinking: 'Spirit energy crackles around index finger', correct: 'Spirit Shotgun blast + grin', incorrect: 'Rolls his eyes, mutters', victory: 'Demon form flickers, then laughs triumphantly' },
  },
  {
    id: 'mizu', name: 'Mizu', anime: 'Blue Eye Samurai', rank: 12,
    color: '#2C3E50', accentColor: '#4169E1', eyeColor: '#4169E1',
    description: 'Half-breed. Unstoppable.',
    clickAction: { type: 'samurai_draw', duration: 800, particleColor: '#4169E1', soundCue: 'mizu_draw', description: 'Mask drops, blue eyes glow with cold fury, katana draw — only afterimage visible' },
    gameActions: { idle: 'Mask on, completely still — a statue with intent', thinking: 'One blue eye visible behind mask', correct: 'Four-handed style flash — impossible precision', incorrect: "Takes the cut — doesn't bleed", victory: 'Mask shatters, blue eyes blazing, four blades surround podium' },
  },
  {
    id: 'vash', name: 'Vash the Stampede', anime: 'Trigun', rank: 13,
    color: '#DC143C', accentColor: '#FFD700', eyeColor: '#4169E1',
    description: 'Love and Peace!',
    clickAction: { type: 'gun_draw', duration: 900, particleColor: '#FFD700', soundCue: 'angel_arm', description: 'Arm transforms into Angel Arm cannon, golden glow overwhelms card, then reverts' },
    gameActions: { idle: 'Donut in hand, acting cartoonishly carefree', thinking: 'One eye sharpens — the real Vash surfaces', correct: 'Peace sign double guns, giant grin', incorrect: 'Dramatic crying pose, tears arc comically', victory: "Coat fans out, scars visible — 'Love and Peace!'" },
  },
  {
    id: 'luffy', name: 'Monkey D. Luffy', anime: 'One Piece', rank: 14,
    color: '#DC143C', accentColor: '#FFD700', eyeColor: '#1C1C2E',
    description: "I'm gonna be King of the Pirates!",
    clickAction: { type: 'rubber_stretch', duration: 900, particleColor: '#DC143C', soundCue: 'gear_shift', description: 'Arm stretches across entire card (Gum-Gum Pistol), haki darkens fist, snaps back' },
    gameActions: { idle: 'Taps straw hat brim, laughs at nothing', thinking: 'Arm stretched behind head like slingshot', correct: 'Gear 5 Nika laugh, rubbery bounce', incorrect: 'Deflates dramatically', victory: 'Gear 5 full form, clouds appear, giant laugh' },
  },
  {
    id: 'zoro', name: 'Roronoa Zoro', anime: 'One Piece', rank: 14,
    color: '#228B22', accentColor: '#C0C0C0', eyeColor: '#1C1C2E',
    description: 'Nothing happened.',
    clickAction: { type: 'sword_slash', duration: 700, particleColor: '#228B22', soundCue: 'three_sword_style', description: 'Third sword in mouth, Santoryu: Oni Giri triple slash, three cross-cuts arc outward' },
    gameActions: { idle: 'Eyes closed, arms crossed, napping', thinking: 'Three swords drawn, three-way focus', correct: 'Asura nine-sword form flash', incorrect: 'Takes a hit, scars glow, still standing', victory: 'King of Hell stance, nine swords aura' },
  },
  {
    id: 'mikey', name: 'Manjiro Sano (Mikey)', anime: 'Tokyo Revengers', rank: 15,
    color: '#1C1C2E', accentColor: '#FFD700', eyeColor: '#8B0000',
    description: 'Invincible Mikey.',
    clickAction: { type: 'speed_blur', duration: 700, particleColor: '#FFD700', soundCue: 'mikey_kick', description: 'Motorcycle blurs past, legendary spinning back kick launches, lands arms behind head' },
    gameActions: { idle: 'Arms behind head, swaying — childlike but terrifying', thinking: 'Dark Impulse flickers at edges', correct: 'Full straight-leg kick, blond hair flies', incorrect: 'Dark Impulse flares briefly — snaps out', victory: 'Tokyo Manji Gang on motorbikes materialise' },
  },
  {
    id: 'gon', name: 'Gon Freecss', anime: 'Hunter × Hunter', rank: 16,
    color: '#32CD32', accentColor: '#FFD700', eyeColor: '#32CD32',
    description: 'Rock, Paper, Scissors!',
    clickAction: { type: 'rock_paper_scissors', duration: 900, particleColor: '#32CD32', soundCue: 'jajanken', description: 'Three Jajanken icons appear, one glows gold, Gon charges Nen and launches it' },
    gameActions: { idle: 'Extremely excited, bouncing, fishing rod spins', thinking: 'Charging Nen, aura visible', correct: 'Charged Rock breaks everything', incorrect: 'Confused head scratch', victory: 'Adult Gon form flashes — returns to kid Gon laughing' },
  },
  {
    id: 'killua', name: 'Killua Zoldyck', anime: 'Hunter × Hunter', rank: 16,
    color: '#4169E1', accentColor: '#FFFFFF', eyeColor: '#191970',
    description: 'Godspeed.',
    clickAction: { type: 'speed_blur', duration: 500, particleColor: '#4169E1', soundCue: 'godspeed', description: 'Blurs at impossible speed three times across card, Godspeed mode, lightning covers body' },
    gameActions: { idle: "Hands in pockets, skateboard appears/disappears", thinking: 'Lightning courses through fingers', correct: 'Lightning strike speed dash', incorrect: "Annoyed eye-roll, yo-yo spins", victory: 'Thunderbolt Godspeed, stands at podium effortlessly' },
  },
  {
    id: 'kurapika', name: 'Kurapika', anime: 'Hunter × Hunter', rank: 16,
    color: '#8B0000', accentColor: '#FFD700', eyeColor: '#DC143C',
    description: 'Scarlet chains bind only you.',
    clickAction: { type: 'electric_violin', duration: 900, particleColor: '#DC143C', soundCue: 'scarlet_chain', description: 'Eyes shift to blazing Scarlet, five chains emerge, Emperor Time activates with golden crown' },
    gameActions: { idle: 'Eyes grey, chains coil quietly, composed', thinking: 'Eyes turn scarlet, chains tighten', correct: 'Chain binds the problem — Scarlet eyes', incorrect: 'Chain recoils, eyes stay scarlet', victory: 'Emperor Time — all five chains, Kurta eyes blazing' },
  },
  {
    id: 'goku', name: 'Goku', anime: 'Dragon Ball Z', rank: 18,
    color: '#FF8C00', accentColor: '#FFD700', eyeColor: '#32CD32',
    description: 'Kamehameha!',
    clickAction: { type: 'saiyan_transform', duration: 1000, particleColor: '#FFD700', soundCue: 'ssj_transform', description: 'Aura explodes, hair golden — SSJ — then SSB blue aura — Kamehameha wave fires horizontally' },
    gameActions: { idle: 'Powering up slightly, aura flickers', thinking: 'Senses ki, eyes close', correct: 'Ultra Instinct silver flash, dodge + strike', incorrect: 'Takes hit, skids back, smiles', victory: 'All forms flash: SSJ → SSJ3 → SSB → UI' },
  },
  {
    id: 'vegeta', name: 'Vegeta', anime: 'Dragon Ball Z', rank: 18,
    color: '#191970', accentColor: '#FFD700', eyeColor: '#32CD32',
    description: 'I am the Prince of all Saiyans!',
    clickAction: { type: 'power_up_aura', duration: 1100, particleColor: '#FFD700', soundCue: 'final_flash', description: 'Arms spread wide, blue SSB aura surges, palms charge Final Flash — massive beam fires' },
    gameActions: { idle: 'Arms crossed, supremely arrogant, cape flows', thinking: 'Ki flares briefly, calculation', correct: 'Curt nod, SSJ aura flashes', incorrect: 'Seething scowl, pride injured', victory: 'Super Saiyan Blue Evolution, Galick Gun fires skyward' },
  },
  {
    id: 'kenshin', name: 'Kenshin Himura', anime: 'Rurouni Kenshin', rank: 19,
    color: '#DC143C', accentColor: '#FFB6C1', eyeColor: '#8B0000',
    description: 'This one vows never to kill again.',
    clickAction: { type: 'samurai_draw', duration: 750, particleColor: '#FFB6C1', soundCue: 'hiten_draw', description: 'Cross scar glows, reverse-blade draw, sakura petals scatter, then "oro?" expression' },
    gameActions: { idle: 'Sweeping with broom, humming — completely peaceful', thinking: 'Amakakeru stance readies', correct: 'Hiten Mitsurugi flash, then gentle smile', incorrect: "Sighs softly, 'Oro…'", victory: 'Battōsai eyes briefly — back to gentle smile, sakura falls' },
  },
  {
    id: 'light', name: 'Light Yagami', anime: 'Death Note', rank: 20,
    color: '#8B0000', accentColor: '#FFD700', eyeColor: '#DC143C',
    description: 'I am justice.',
    clickAction: { type: 'death_note_write', duration: 1000, particleColor: '#DC143C', soundCue: 'death_note_page', description: 'Death Note opens with dark red glow, pen moves, Shinigami Eyes activate — book snaps shut' },
    gameActions: { idle: 'Leaning back, twirling pen, insufferably confident', thinking: 'Death Note in hand, dramatic pen cap bite', correct: "Laughs maniacally, 'I win'", incorrect: 'Composure held — visibly rattled underneath', victory: "Kira pose: arms spread, red rose petals, Ryuk hovers" },
  },
  {
    id: 'denji', name: 'Denji', anime: 'Chainsaw Man', rank: 21,
    color: '#DC143C', accentColor: '#FF8C00', eyeColor: '#DC143C',
    description: 'Vroom vroom.',
    clickAction: { type: 'chainsaw_rev', duration: 700, particleColor: '#DC143C', soundCue: 'chainsaw_rev', description: 'Ripcord pull, chainsaws erupt from head and arms, upper body spins, red particle spray' },
    gameActions: { idle: 'Thinking about food, dopey smile', thinking: 'Scratches head, chainsaws barely contained', correct: 'Full Chainsaw Man rev + slash', incorrect: 'Sad face, thinks about bread', victory: 'Pochita appears, they celebrate with tail wag' },
  },
  {
    id: 'power', name: 'Power', anime: 'Chainsaw Man', rank: 21,
    color: '#DC143C', accentColor: '#FF69B4', eyeColor: '#FFD700',
    description: 'I am the Blood Devil!',
    clickAction: { type: 'blood_demon_art', duration: 800, particleColor: '#DC143C', soundCue: 'blood_spear', description: 'Yellow slit eyes flash, blood spear crystallises and launches, Power laughs maniacally' },
    gameActions: { idle: 'Meowy tucked under one arm, smug expression', thinking: 'Blood pools form at feet, plotting chaos', correct: 'Massive blood hammer slams down, howls', incorrect: 'Blames Denji loudly — points dramatically', victory: 'Blood Fiend full form, fountain of blood, Meowy cheers' },
  },
  {
    id: 'david', name: 'David Martinez', anime: 'Cyberpunk: Edgerunners', rank: 22,
    color: '#FF4500', accentColor: '#00FFFF', eyeColor: '#00FFFF',
    description: 'Sandevistan. Time slows.',
    clickAction: { type: 'speed_blur', duration: 600, particleColor: '#00FFFF', soundCue: 'sandevistan', description: 'Everything desaturates, David moves at impossible speed, cyan time-slow overlay' },
    gameActions: { idle: 'Adjusting cyberware, Night City jacket', thinking: 'Sandevistan spins up, time warps', correct: 'Sandevistan blitz, combat pose', incorrect: 'Cyberpsychosis meter flickers', victory: 'Full Arasaka tower reimagined — David grins' },
  },
  {
    id: 'guts', name: 'Guts', anime: 'Berserk', rank: 25,
    color: '#1C1C1C', accentColor: '#DC143C', eyeColor: '#DC143C',
    description: 'I swing, therefore I am.',
    clickAction: { type: 'berserker_roar', duration: 1000, particleColor: '#DC143C', soundCue: 'dragonslayer_swing', description: 'Screen darkens, Brand of Sacrifice glows red, Berserker Armor surges, Dragonslayer swings' },
    gameActions: { idle: 'Dragonslayer on shoulder, perpetual defiance', thinking: 'One eye closes, prosthetic cannon arm aims', correct: 'Full Berserker mode slash, red eye glows', incorrect: "Takes hit, doesn't flinch, brand glows", victory: 'Hundreds of swords in background, Guts stands alone at peak' },
  },
  {
    id: 'anya', name: 'Anya Forger', anime: 'Spy × Family', rank: 26,
    color: '#FFB6C1', accentColor: '#FF69B4', eyeColor: '#32CD32',
    description: 'Heh. I read your mind.',
    clickAction: { type: 'telepathy_face', duration: 800, particleColor: '#FF69B4', soundCue: 'anya_telepathy', description: 'Star pupils appear, sparkles burst from head, tiny reaction faces float up' },
    gameActions: { idle: 'Heh face on repeat, tiny fists clenched', thinking: 'Reads question telepathically — eyes glow', correct: 'Heh face maximum, star eyes, fist pump', incorrect: "Panic face — 'anya did not know this'", victory: 'Waku waku maximum, peanuts everywhere' },
  },
  {
    id: 'loid', name: 'Loid Forger', anime: 'Spy × Family', rank: 26,
    color: '#2F4F4F', accentColor: '#FFD700', eyeColor: '#4169E1',
    description: 'For the sake of the mission.',
    clickAction: { type: 'spy_disguise', duration: 900, particleColor: '#FFD700', soundCue: 'spy_theme', description: 'Silhouette morphs through 3 disguises rapidly, resolves to Loid adjusting glasses' },
    gameActions: { idle: 'Perfectly composed, analyzing everything silently', thinking: 'Mission-critical calculation expression', correct: 'Subtle victorious smile + glasses adjustment', incorrect: 'Poker face — internally panicking', victory: 'Spy gadgets deploy + Anya runs in from behind' },
  },
  {
    id: 'yor', name: 'Yor Forger', anime: 'Spy × Family', rank: 26,
    color: '#8B0000', accentColor: '#FF69B4', eyeColor: '#DC143C',
    description: 'Thorn Princess.',
    clickAction: { type: 'forger_kick', duration: 750, particleColor: '#DC143C', soundCue: 'thorn_kick', description: 'Spinning aerial kick, rose thorns as motion trails, bone-cracking impact shockwave' },
    gameActions: { idle: 'Holds tray of food nervously — clumsy wife mode', thinking: 'Thorn Princess mode, fighting stance', correct: 'Assassination spinning kick + roses', incorrect: 'Drops tray — overcooks dinner in panic', victory: 'Full assassination mode — rose garden, crown of thorns glows' },
  },
  {
    id: 'shinra', name: 'Shinra Kusakabe', anime: 'Fire Force', rank: 27,
    color: '#FF4500', accentColor: '#00BFFF', eyeColor: '#DC143C',
    description: "Devil's Footprints. Speed of light.",
    clickAction: { type: 'power_up_aura', duration: 750, particleColor: '#00BFFF', soundCue: 'adolla_burst', description: 'Adolla Burst ignites at both feet, nervous smile locks in, blinks across card at mach speed' },
    gameActions: { idle: 'Nervous smile always, kicks feet, small flames flicker', thinking: 'Adolla Link activates, eyes glow red', correct: 'Rapid-fire devil kicks, blue fire everywhere', incorrect: 'Grins more nervously — not ideal', victory: 'Adolla Grace: divine flame surrounds entire stage' },
  },
  {
    id: 'mash', name: 'Mash Burnedead', anime: 'Mashle: Magic and Muscles', rank: 28,
    color: '#F5F5F5', accentColor: '#FF69B4', eyeColor: '#1C1C1C',
    description: 'Muscles over magic. Always.',
    clickAction: { type: 'giant_fist', duration: 850, particleColor: '#F5F5F5', soundCue: 'muscle_smash', description: 'Eats cream puff first, then colossal fist winds up slow-mo, punch shockwave, blank stare' },
    gameActions: { idle: 'Eating cream puffs continuously, blank expression', thinking: "Squints at problem, flexes without realising", correct: 'Divine Visionary punch through concept of magic', incorrect: 'Confused. Eats another cream puff', victory: 'Muscle Magic: every cell at peak — cream puffs rain' },
  },
  {
    id: 'jinwoo', name: 'Sung Jin-Woo', anime: 'Solo Leveling', rank: 30,
    color: '#191970', accentColor: '#8A2BE2', eyeColor: '#8A2BE2',
    description: 'Arise.',
    clickAction: { type: 'shadow_rise', duration: 1000, particleColor: '#8A2BE2', soundCue: 'arise', description: 'Dark shadow pool spreads, shadow soldiers rise with glowing purple eyes, Beru and Igris bow' },
    gameActions: { idle: 'Casual hunter gear, shadows drift at feet', thinking: 'Shadow army assembles behind him', correct: 'Shadow monarch power surge, purple aura', incorrect: 'Eyes close, comes back stronger', victory: "Full Shadow Monarch form, thousands of shadows, 'I alone level up'" },
  },
]
