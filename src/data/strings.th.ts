/**
 * All Thai UI copy that is not site content. Site content lives in public/data/study.json.
 * No other .ts file may contain Thai text (tests/no-hardcoded-thai.test.ts enforces this).
 */

/** ทิศ — the eight directions, with the angle used by the compass drawings (0° = north, clockwise). */
export const DIR = {
  north: 'อุดร', ne: 'อีสาน', east: 'บูรพา', se: 'อาคเนย์',
  south: 'ทักษิณ', sw: 'หรดี', west: 'ประจิม', nw: 'พายัพ',
} as const
export type DirName = (typeof DIR)[keyof typeof DIR]
export const DIRS: readonly (readonly [DirName, number])[] = [
  [DIR.north, 0], [DIR.ne, 45], [DIR.east, 90], [DIR.se, 135],
  [DIR.south, 180], [DIR.sw, 225], [DIR.west, 270], [DIR.nw, 315],
]
export const DIR_NAMES = Object.values(DIR) as [DirName, ...DirName[]]
/** Directions the lore calls auspicious for the patient bed head / forbidden. */
export const DIR_GOOD: readonly DirName[] = [DIR.east, DIR.south]
export const DIR_BAD: DirName = DIR.west

export const DIGITS = '๐๑๒๓๔๕๖๗๘๙'
/** Thai number words, used by thaiWord() in format.ts. */
export const NUM = {
  digits: ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'],
  ten: 'สิบ', twenty: 'ยี่สิบ', hundred: 'ร้อย', one: 'เอ็ด',
}

export const UNIT = {
  wa: 'วา', waAndHalf: 'วาครึ่ง', halfWa: 'ครึ่งวา', rai: 'ไร่', ngan: 'งาน', sqWa: 'ตารางวา',
  baht: 'บาท', sen: 'เส้น', minute: 'นาที', cubit: 'ศอก', about: 'ราว', zero: '๐', dash: '—',
}

export const S = {
  hero: {
    aria: 'ภาพจิตรกรรมพระนครศรีอยุธยาริมน้ำ',
    eyebrow: 'สมุดข่อยกรมช่างหลวง · ว่าด้วยการหาทำเลโรงหมอ',
    lead: (count: string) => `ขุนช่างกับหมอหลวงปรึกษากันสร้างโรงหมอใหม่ ออกสำรวจ${count}ทำเล ดูหุ่นจำลอง ข้อห้ามที่ดิน ทิศมงคล แลทางสัญจรทั้งบกทั้งน้ำ`,
    scroll: 'ฉบับนำร่องแห่ง เทสต์ฟิต แดชบอร์ด · เลื่อนลงอ่าน',
  },
  chapter: (n: number) => `ตอนที่ ${n}`,
  ch1: { title: 'ปรารภสร้างโรงหมอ', sub: 'ณ ศาลาโรงหมอเก่าข้างวัด คนเจ็บนอนล้นถึงชายคา', aria: 'ภาพจิตรกรรม ขุนช่างกับหมอหลวงปรึกษาสร้างโรงหมอ' },
  ch2: { title: 'ออกสำรวจทำเลทั่วพระนคร', sub: 'กดธงชาดเลือกทำเล แลสลับดูข้อห้ามกับทางสัญจร' },
  ch3: { title: 'บทสรุปแห่งการสำรวจ', sub: 'ขุนช่างกับหมอหลวงจดความลงใบลานไว้เป็นหลักฐาน' },
  tabs: {
    site: { name: 'ทำเลที่ตั้ง', sub: 'ดูหุ่นจำลองโรงหมอผุดขึ้น' },
    reg: { name: 'ข้อห้ามแลทิศ', sub: 'ระยะร่น เพดานสูง ทิศมงคล' },
    tr: { name: 'ทางสัญจร', sub: 'เดินเท้า ม้าเร็ว ช้าง เรือ' },
  },
  map: {
    aria: (count: string) => `แผนที่มุมสูงเกาะเมืองอยุธยา พร้อมทำเล${count}แห่ง`,
    loading: 'ช่างกำลังลงสีแผนที่…',
    zoomOut: 'ถอยดูทั้งพระนคร',
    title: 'แผนที่พระนครศรีอยุธยา',
    hint: {
      siteNone: 'กดธงชาดเพื่อให้หุ่นจำลองผุดขึ้น',
      siteOn: 'กดธงทำเลอื่นเพื่อย้ายไปดู',
      reg: 'กดตราประทับ สูง · น้ำ · ร่น · ทาง · ทิศ',
      tr: 'ดูพาหนะเดินทางจากทำเลที่เลือก',
    },
    places: {
      palace: 'พระราชวังหลวง', wat: 'วัดพระศรีสรรเพชญ์', phuKhao: 'วัดภูเขาทอง',
      market: 'ตลาดป่าตะกั่ว', gate: 'ประตูไชย', wharf: 'ท่าสำเภา',
    },
    waters: {
      chaoPhraya: 'แม่น้ำเจ้าพระยา', pasak: 'แม่น้ำป่าสัก', river: 'แม่น้ำ',
      khaoPluek: 'คลองประตูข้าวเปลือก', naiKai: 'คลองในไก่', tho: 'คลองท่อ',
    },
    siteAria: (name: string) => `ทำเล ${name}`,
    hideModel: 'ซ่อนหุ่น',
    front: (dir: string) => `หน้าโรง: ${dir}`,
    capLine: (height: string) => `เพดาน ${height}`,
  },
  narrator: {
    intro: (count: string) => `ข้าปักธงชาดไว้${count}ทำเล ท่านจงกดธง หุ่นโรงหมอจักผุดขึ้น ณ ที่นั้น`,
    siteNone: 'ท่านจงกดธงชาดทำเลใดก็ได้ หุ่นโรงหมอจักผุดขึ้น',
    zone: (title: string) => `ตรา${title} ข้าคลี่ใบลานให้อ่านข้างล่างแล้ว`,
    reg: (name: string, good: boolean) => `ทำเล${name} ${good ? 'หันหน้าต้องตำรา' : 'หันหน้าผิดตำรา'} ข้าจดข้อห้ามไว้ข้างล่าง`,
    courier: (time: string) => `ม้าเร็วจากทำเลนี้ถึงประตูวังราว ${time} ขอรับ`,
  },
  cap: {
    title: (no: string, name: string) => `ทำเล${no} · ${name}`,
    facts: (area: string, height: string, gfa: string, beds: string) =>
      `เนื้อที่ ${area} · สูงได้ ${height} · พื้นอาคาร${gfa} · ราว ${beds} เตียง`,
  },
  site: {
    pickTitle: 'เลือกทำเลที่จะพินิจ',
    pickHint: 'กดธงชาดบนแผนที่ หรือเลือกจากบัญชีนี้',
    land: 'เนื้อที่ดิน', gfa: 'พื้นอาคารได้จริง', beds: 'เตียงคนไข้', bedsAbout: 'ราว',
    prosCons: 'ส่วนดี ส่วนเสีย',
    verdictTitle: 'คำวินิจฉัยของขุนวิเศษ',
    scoreTitle: (total: string, max: string) => `คะแนนทำเล ${total} ใน ${max}`,
    siteTitle: (no: string, name: string) => `ทำเล${no} · ${name}`,
  },
  reg: {
    title: (no: string) => `ข้อห้ามแห่งทำเล${no}`,
    hint: 'กดตราประทับ สูง · น้ำ · ร่น · ทาง · ทิศ บนแผนที่เพื่ออ่านทีละข้อ',
    close: 'ปิด', closeGlyph: '×',
    rows: {
      land: 'เนื้อที่ดิน', road: 'ทางหน้าแปลงกว้าง', roadSet: 'ร่นจากเขตทาง', waterSet: 'ร่นจากน้ำ',
      maxHeight: 'สูงได้มากที่สุด', cap: 'เพดานเขตพระราชฐาน', capNone: 'ไม่ติด',
      far: 'พื้นอาคารตามเกณฑ์', farUnit: 'เท่าของที่ดิน', gfa: 'พื้นอาคารได้จริง', flood: 'ยกพื้นหนีน้ำ',
    },
    parcelTitle: 'ผังแปลงแลระยะร่น',
    parcelAria: 'ผังแปลงที่ดินแลระยะร่น',
    parcelNote: 'ลายทแยงคือแนวร่นที่สร้างมิได้ เส้นประแดงคือแนวตั้งตัวโรง',
    roadLabel: (w: string) => `ทางกว้าง ${w}`,
    buildable: 'แนวสร้างได้',
    dimsLabel: (w: string, d: string) => `กว้าง ${w} ลึก ${d}`,
    astroTitle: 'ทักษาทิศตามตำราปลูกเรือน',
    astroAria: 'ทักษาทิศ',
    front: 'หน้าโรง',
    good: 'ต้องตามตำรา', bad: 'ผิดตำรา ต้องแก้',
    advise: 'ข้าแนะว่า',
    lore: [
      ['หัวเตียงคนไข้', 'บูรพา หรือ ทักษิณ ห้ามประจิม'],
      ['หอพระ ศาลพระภูมิ', 'อีสาน'],
      ['โรงครัว เตาต้มยา', 'อาคเนย์'],
      ['เรือนเก็บศพ', 'ประจิม'],
      ['หอตำราหมอ', 'อุดร'],
    ] as [string, string][],
    loreClimate: 'ตำรานี้ตรงกับแดดลมด้วย ทิศประจิมรับแดดบ่ายร้อนจัด ควรเป็นเรือนบริการ มิใช่เรือนคนไข้',
  },
  tr: {
    title: (no: string) => `ทางสัญจรจากทำเล${no}`,
    hint: 'กดเปิดปิดพาหนะ บนแผนที่จะเห็นคน ม้า ช้าง เรือ เดินทางจริง',
    courierTitle: 'ข้อสังเกตของพลขับ',
    timeTitle: 'เพลาเดินทาง',
    head: { mode: 'พาหนะ', dest: 'ปลายทาง', dist: 'ระยะ', time: 'เพลา' },
    speeds: (list: string) => `ความเร็วสมมุติ ${list} เส้นต่อบาท`,
  },
  cmp: {
    title: (count: string) => `บัญชีเทียบ${count}ทำเล`,
    hint: 'กดแถวเพื่อกลับไปดูทำเลนั้นบนแผนที่',
    head: {
      site: 'ทำเล', land: 'เนื้อที่', gfa: 'พื้นอาคารได้จริง', beds: 'เตียง', height: 'สูงได้',
      horse: 'ม้าเร็วถึงวัง', boat: 'เรือถึงท่าสำเภา', front: 'หน้าโรง', issue: 'ข้อติดสำคัญ', score: 'คะแนน',
    },
  },
  end: {
    resolution: 'มติที่ประชุม',
    full: 'ฉบับเต็มแห่ง เทสต์ฟิต แดชบอร์ด จักมีดังนี้',
    seal: 'จบ',
    colophon: (era: string) =>
      `สมุดใบลานผูกนี้ จารเสร็จ ณ วันพฤหัสบดี ${era} ปีมะเมีย อัฐศก โดยกรมช่างหลวง ขอให้ผู้อ่านเจริญด้วยอายุ วรรณะ สุขะ พละ เทอญ`,
    note: 'หมายเหตุ (ภาษาปัจจุบัน): แผนที่ ตัวเลข และข้อกำหนดทั้งหมดเป็นข้อมูลสาธิต ระยะร่นและข้อจำกัดอิงหลักการกฎหมายควบคุมอาคารแบบย่อ ทิศมงคลอิงตำราปลูกเรือนโบราณ ไม่ใช่ค่าตรวจสอบจริงของโครงการใด · ๑ วา = ๒ เมตร · ๑ ศอก ≈ ครึ่งเมตร · ๑ เส้น = ๒๐ วา · ๑ ไร่ = ๔๐๐ ตารางวา · ๑ บาท (เพลา) = ๖ นาที',
  },
  error: {
    title: 'ใบลานชำรุด อ่านข้อมูลมิได้',
    lead: 'ไฟล์ข้อมูล study.json ผิดแบบ กรุณาแก้ตามรายการนี้แล้วเปิดใหม่',
    duplicate: 'ซ้ำกัน',
    unknownToken: (path: string) => `ไม่พบตัวแปร {${path}} ในข้อมูล`,
    badFormat: (body: string) => `รูปแบบตัวแปร {${body}} ใช้มิได้`,
    fetchFail: 'เปิดไฟล์ข้อมูลมิได้',
    notJson: 'ไฟล์ข้อมูลมิใช่ JSON ที่ถูกต้อง',
  },
}
