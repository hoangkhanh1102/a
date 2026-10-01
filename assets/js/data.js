/* ===========================================================
   Speaking can ban 1: Am cuoi
   Du lieu bai giang: am, tu vung, quy tac, minigame, doan van
   =========================================================== */

const SOUND_ORDER = ['t', 'd', 'k', 's', 'z'];

const SOUNDS = {
  t: {
    key: 't',
    ipa: '/t/',
    label: 'âm /t/',
    kind: 'Âm bật, vô thanh',
    color: '#e07a3f',
    how: 'Đầu lưỡi chạm vào lợi trên, chặn hơi lại rồi bật nhẹ ra. Dây thanh không rung.',
    feel: 'Đặt tay lên cổ họng: khi bật /t/ bạn không thấy rung.',
    mistake: 'Người Việt thường nuốt luôn /t/ cuối, "night" thành "nai". Chỉ cần chạm lưỡi là đủ, không cần bật mạnh.',
    spelling: ['-t', '-te', '-ed (sau âm vô thanh)'],
    words: [
      { w: 'late', vi: 'muộn' },
      { w: 'night', vi: 'đêm' },
      { w: 'start', vi: 'bắt đầu' },
      { w: 'want', vi: 'muốn' },
      { w: 'eat', vi: 'ăn' },
      { w: 'worked', vi: 'đã làm việc' }
    ]
  },
  d: {
    key: 'd',
    ipa: '/d/',
    label: 'âm /d/',
    kind: 'Âm bật, hữu thanh',
    color: '#8b5cf6',
    how: 'Vị trí lưỡi giống hệt /t/, nhưng dây thanh rung và hơi nhẹ hơn.',
    feel: 'Đặt tay lên cổ họng: khi phát /d/ bạn thấy rung rõ.',
    mistake: 'Đọc /d/ thành /t/ làm "bad" nghe thành "bat". Khác biệt nằm ở độ rung, không phải độ mạnh.',
    spelling: ['-d', '-de', '-ed (sau âm hữu thanh)'],
    words: [
      { w: 'red', vi: 'màu đỏ' },
      { w: 'need', vi: 'cần' },
      { w: 'word', vi: 'từ' },
      { w: 'road', vi: 'con đường' },
      { w: 'side', vi: 'phía, bên' },
      { w: 'played', vi: 'đã chơi' }
    ]
  },
  k: {
    key: 'k',
    ipa: '/k/',
    label: 'âm /k/',
    kind: 'Âm bật, vô thanh',
    color: '#0d9488',
    how: 'Phần sau của lưỡi nâng lên chạm ngạc mềm, chặn hơi rồi nhả ra.',
    feel: 'Giống âm "c" trong tiếng Việt nhưng có bật hơi ra ngoài.',
    mistake: 'Nuốt /k/ cuối làm "work" thành "wơ", người nghe mất luôn danh từ.',
    spelling: ['-k', '-ck', '-ke', '-c'],
    words: [
      { w: 'book', vi: 'quyển sách' },
      { w: 'work', vi: 'làm việc' },
      { w: 'make', vi: 'làm, tạo ra' },
      { w: 'think', vi: 'nghĩ' },
      { w: 'black', vi: 'màu đen' },
      { w: 'week', vi: 'tuần' }
    ]
  },
  s: {
    key: 's',
    ipa: '/s/',
    label: 'âm /s/',
    kind: 'Âm xát, vô thanh',
    color: '#2563eb',
    how: 'Lưỡi gần lợi trên, hơi đi qua khe hẹp tạo tiếng rít kéo dài. Không rung.',
    feel: 'Âm này kéo dài được: ssssss. Thử kéo 2 giây xem.',
    mistake: 'Bỏ /s/ cuối làm mất số nhiều và mất chia động từ ngôi thứ ba.',
    spelling: ['-s (sau âm vô thanh)', '-ce', '-ss', '-x (/ks/)'],
    words: [
      { w: 'books', vi: 'những quyển sách' },
      { w: 'nice', vi: 'tốt, dễ chịu' },
      { w: 'class', vi: 'lớp học' },
      { w: 'works', vi: '(anh ấy) làm việc' },
      { w: 'price', vi: 'giá cả' },
      { w: 'students', vi: 'các sinh viên' }
    ]
  },
  z: {
    key: 'z',
    ipa: '/z/',
    label: 'âm /z/',
    kind: 'Âm xát, hữu thanh',
    color: '#db2777',
    how: 'Miệng giống /s/, nhưng dây thanh rung, nghe như tiếng ong bay.',
    feel: 'Kéo dài zzzzz và sờ cổ họng: rung liên tục.',
    mistake: 'Đọc mọi chữ "s" cuối thành /s/. Thực tế phần lớn danh từ số nhiều kết thúc bằng /z/.',
    spelling: ['-s (sau âm hữu thanh)', '-es', '-z', '-se'],
    words: [
      { w: 'jobs', vi: 'những công việc' },
      { w: 'friends', vi: 'những người bạn' },
      { w: 'please', vi: 'làm ơn' },
      { w: 'days', vi: 'những ngày' },
      { w: 'is', vi: 'thì, là' },
      { w: 'because', vi: 'bởi vì' }
    ]
  }
};

/* Kho tu cho minigame nghe va chon am cuoi */
const GAME_WORDS = [
  { w: 'light', s: 't' }, { w: 'boat', s: 't' }, { w: 'short', s: 't' },
  { w: 'asked', s: 't' }, { w: 'helped', s: 't' }, { w: 'right', s: 't' },
  { w: 'food', s: 'd' }, { w: 'head', s: 'd' }, { w: 'mind', s: 'd' },
  { w: 'hard', s: 'd' }, { w: 'learned', s: 'd' }, { w: 'wide', s: 'd' },
  { w: 'like', s: 'k' }, { w: 'walk', s: 'k' }, { w: 'take', s: 'k' },
  { w: 'back', s: 'k' }, { w: 'music', s: 'k' }, { w: 'check', s: 'k' },
  { w: 'hats', s: 's' }, { w: 'ice', s: 's' }, { w: 'bus', s: 's' },
  { w: 'stops', s: 's' }, { w: 'face', s: 's' }, { w: 'mistakes', s: 's' },
  { w: 'eyes', s: 'z' }, { w: 'cars', s: 'z' }, { w: 'plays', s: 'z' },
  { w: 'his', s: 'z' }, { w: 'rooms', s: 'z' }, { w: 'cities', s: 'z' }
];

/* Cap tu chi khac nhau o am cuoi */
const MINIMAL_PAIRS = [
  { a: 'bat', b: 'bad', sa: 't', sb: 'd', via: 'con dơi', vib: 'tệ, xấu' },
  { a: 'hat', b: 'had', sa: 't', sb: 'd', via: 'cái mũ', vib: 'đã có' },
  { a: 'white', b: 'wide', sa: 't', sb: 'd', via: 'màu trắng', vib: 'rộng' },
  { a: 'seat', b: 'seed', sa: 't', sb: 'd', via: 'chỗ ngồi', vib: 'hạt giống' },
  { a: 'cart', b: 'card', sa: 't', sb: 'd', via: 'xe đẩy', vib: 'tấm thẻ' },
  { a: 'price', b: 'prize', sa: 's', sb: 'z', via: 'giá cả', vib: 'giải thưởng' },
  { a: 'ice', b: 'eyes', sa: 's', sb: 'z', via: 'đá lạnh', vib: 'đôi mắt' },
  { a: 'place', b: 'plays', sa: 's', sb: 'z', via: 'nơi chốn', vib: '(anh ấy) chơi' },
  { a: 'bus', b: 'buzz', sa: 's', sb: 'z', via: 'xe buýt', vib: 'tiếng vo ve' },
  { a: 'light', b: 'like', sa: 't', sb: 'k', via: 'ánh sáng', vib: 'thích' },
  { a: 'what', b: 'walk', sa: 't', sb: 'k', via: 'cái gì', vib: 'đi bộ' },
  { a: 'bed', b: 'beds', sa: 'd', sb: 'z', via: 'cái giường', vib: 'những cái giường' }
];

/* Quy tac duoi -s va duoi -ed */
const RULES = {
  s: {
    title: 'Đuôi -s đọc là /s/ hay /z/?',
    lead: 'Bạn không cần học thuộc. Chỉ cần nghe âm đứng ngay trước đuôi -s là vô thanh hay hữu thanh.',
    rows: [
      { out: '/s/', when: 'Sau âm vô thanh: /p/ /t/ /k/ /f/ /θ/', ex: ['stops', 'hats', 'books', 'laughs'], color: '#2563eb' },
      { out: '/z/', when: 'Sau nguyên âm và âm hữu thanh: /b/ /d/ /g/ /v/ /m/ /n/ /l/ /r/', ex: ['jobs', 'friends', 'cars', 'days'], color: '#db2777' },
      { out: '/ɪz/', when: 'Sau âm rít: /s/ /z/ /ʃ/ /tʃ/ /dʒ/', ex: ['buses', 'watches', 'pages'], color: '#64748b' }
    ],
    note: 'Mẹo kiểm tra: đặt tay lên cổ họng khi đọc âm trước đuôi -s. Có rung thì chọn /z/, không rung thì chọn /s/.'
  },
  ed: {
    title: 'Đuôi -ed đọc là /t/ hay /d/?',
    lead: 'Cùng một chữ "ed" nhưng ba cách đọc. Nguyên tắc vẫn chỉ là vô thanh hay hữu thanh.',
    rows: [
      { out: '/t/', when: 'Sau âm vô thanh: /p/ /k/ /f/ /s/ /ʃ/ /tʃ/', ex: ['worked', 'asked', 'helped', 'watched'], color: '#e07a3f' },
      { out: '/d/', when: 'Sau nguyên âm và âm hữu thanh', ex: ['played', 'learned', 'moved', 'called'], color: '#8b5cf6' },
      { out: '/ɪd/', when: 'Chỉ khi từ gốc kết thúc bằng /t/ hoặc /d/', ex: ['wanted', 'needed', 'started'], color: '#64748b' }
    ],
    note: '"Asked" viết là -ed nhưng đọc /t/. Đây là lý do nhiều học viên đọc sai từ này trong phòng thi.'
  }
};

/* Doan van luyen doc.
   Moi tu: [chu, so ky tu cuoi duoc to mau, am cuoi] */
const PASSAGE = [
  [
    ['Last', 1, 't'], ['week', 1, 'k'], ['I', 0, null], ['started', 1, 'd'],
    ['a', 0, null], ['new', 0, null], ['job', 0, null], ['at', 1, 't'],
    ['a', 0, null], ['small', 0, null], ['bookshop.', 0, null]
  ],
  [
    ['It’s', 1, 's'], ['hard', 1, 'd'], ['work,', 1, 'k'], ['but', 1, 't'],
    ['I', 0, null], ['like', 2, 'k'], ['it', 1, 't'], ['a', 0, null], ['lot.', 1, 't']
  ],
  [
    ['Every', 0, null], ['morning', 0, null], ['I', 0, null], ['check', 2, 'k'],
    ['the', 0, null], ['shelves,', 1, 'z'], ['make', 2, 'k'], ['a', 0, null],
    ['list', 1, 't'], ['of', 0, null], ['the', 0, null], ['books', 1, 's'],
    ['we', 0, null], ['need,', 1, 'd'], ['and', 1, 'd'], ['help', 0, null],
    ['the', 0, null], ['students', 1, 's'], ['find', 1, 'd'], ['what', 1, 't'],
    ['they', 0, null], ['want.', 1, 't']
  ],
  [
    ['My', 0, null], ['friends', 1, 'z'], ['asked', 1, 't'], ['me', 0, null],
    ['if', 0, null], ['I', 0, null], ['felt', 1, 't'], ['tired.', 1, 'd']
  ],
  [
    ['I', 0, null], ['said', 1, 'd'], ['yes,', 1, 's'], ['but', 1, 't'],
    ['the', 0, null], ['place', 2, 's'], ['feels', 1, 'z'], ['right.', 1, 't']
  ]
];

const PASSAGE_VI = 'Tuần trước tôi bắt đầu công việc mới ở một tiệm sách nhỏ. Việc khá nặng, nhưng tôi thích lắm. Mỗi sáng tôi kiểm tra kệ sách, lập danh sách những cuốn cần nhập, và giúp sinh viên tìm thứ họ cần. Bạn bè hỏi tôi có mệt không. Tôi nói có, nhưng chỗ này hợp với tôi.';
