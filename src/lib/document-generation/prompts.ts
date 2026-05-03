// Document Generation Prompts
// This file contains all prompt generation functions for different document types

export function generateArizaPrompt(details: any): string {
  return `
Siz O'zbekiston qonunchilik bo'yicha mutaxassis sifatida quyidagi ma'lumotlar asosida rasmiy ariza yaratishingiz kerak:

Ariza turi: ${details.purpose || 'Ariza'}
Ariza beruvchi: ${details.applicant || 'F.I.O'}
Qabul qiluvchi: ${details.recipient || 'Tashkilot nomi'}
Savol mazmuni: ${details.subject || 'Ariza mazmuni'}

Quyidagilarga rioya qiling:
1. O'zbekiston rasmiy hujjatlariga xos formatda yozing
2. Sana, joy, F.I.O. to'liq ko'rsatilsin
3. Murojaatning asosiy maqsadi aniq bayon qilinsin
4. Qonun asoslari ko'rsatilsin (agar kerak bo'lsa)
5. Rasmiy til, hurmatli murojaat
6. Imzo qo'yiladigan joy belgilansin

Hujjat quyidagi tuzilishda bo'lishi kerak:
- Yuqori o'ng burchakda: Sana, Joy
- Markazda: QABUL QILUVCHI NOMI
- Chap tomonda: ARIZA
- Asosiy matn: Murojaat mazmuni
- Pastki qism: Ariza beruvchi F.I.O., imzo joyi

O'zbek tilida, rasmiy uslubda yozing.
`;
}

export function generateShartnomaPrompt(details: any): string {
  return `
Siz O'zbekiston qonunchilik bo'yicha mutaxassis sifatida quyidagi ma'lumotlar asosida shartnoma yaratishingiz kerak:

Shartnoma turi: ${details.type || 'Shartnoma'}
Tomonlar: ${details.parties || 'Tomonlar F.I.O.'}
Shartnoma predmeti: ${details.subject || 'Shartnoma mazmuni'}
Muddat: ${details.duration || 'Shartnoma muddati'}
Summa: ${details.amount || 'Shartnoma summasi'}

Quyidagilarga rioya qiling:
1. O'zbekiston Fuqarolik kodeksiga muvofiq yozing
2. Shartnoma tomonlari to'liq ko'rsatilsin
3. Huquq va majburiyatlar aniq belgilansin
4. Shartnoma shartlari, muddatlari, javobgarlik
5. Nizolarni hal qilish tartibi
6. Rasmiy til, o'zbek tilida yozing
7. Imzo qo'yiladigan joylar belgilansin

Shartnoma tuzilishi:
- Yuqori o'ng burchakda: Sana, Joy
- Markazda: SHARTNOMA
- 1-bo'lim: Tomonlar
- 2-bo'lim: Shartnoma predmeti
- 3-bo'lim: Tomonlarning huquq va majburiyatlari
- 4-bo'lim: Shartnoma muddati
- 5-bo'lim: Javobgarlik
- 6-bo'lim: Nizolarni hal qilish
- Pastki qism: Tomonlar imzolari
`;
}

export function generateDavoprompt(details: any): string {
  return `
Siz O'zbekiston qonunchilik bo'yicha mutaxassis sifatida quyidagi ma'lumotlar asosida da\'vo arizasi yaratishingiz kerak:

Da\'vo beruvchi: ${details.plaintiff || 'Da\'vo beruvchi F.I.O.'}
Javobgar: ${details.defendant || 'Javobgar F.I.O.'}
Da\'vo talabi: ${details.claim || 'Da\'vo talabi'}
Asos: ${details.basis || 'Da\'vo asoslari'}

Quyidagilarga rioya qiling:
1. O'zbekiston Fuqarolik protsessual kodeksiga muvofiq yozing
2. Sud to'liq ko'rsatilsin
3. Da\'vo beruvchi va javobgar ma'lumotlari
4. Da\'vo talablari aniq bayon qilinsin
5. Dalillar va guvohlar ko'rsatilsin
6. Qonun asoslari belgilansin
7. Rasmiy til, o'zbek tilida yozing

Da\'vo arizasi tuzilishi:
- Yuqori o'ng burchakda: Sana
- Markazda: SUD NOMI
- DA\'VO ARIZASI
- Da\'vo beruvchi haqida ma'lumot
- Javobgar haqida ma'lumot
- Da\'vo talablari
- Da\'vo asoslari
- Dalillar
- Talab
- Imzo
`;
}

export function generateVozPrompt(details: any): string {
  return `
Siz O'zbekiston qonunchilik bo'yicha mutaxassis sifatida quyidagi ma'lumotlar asosida voz arizasi yaratishingiz kerak:

Voz beruvchi: ${details.plaintiff || 'Voz beruvchi F.I.O.'}
Javobgar: ${details.defendant || 'Javobgar F.I.O.'}
Voz sababi: ${details.reason || 'Voz sababi'}

Quyidagilarga rioya qiling:
1. O'zbekiston Fuqarolik protsessual kodeksiga muvofiq yozing
2. Sud to'liq ko'rsatilsin
3. Voz beruvchi va javobgar ma'lumotlari
4. Voz sabablari aniq bayon qilinsin
5. Qonun asoslari belgilansin
6. Rasmiy til, o'zbek tilida yozing

Voz arizasi tuzilishi:
- Yuqori o'ng burchakda: Sana
- Markazda: SUD NOMI
- VOZ ARIZASI
- Voz beruvchi haqida ma'lumot
- Javobgar haqida ma'lumot
- Voz sabablari
- Talab
- Imzo
`;
}

export function generateIshHuquqiPrompt(details: any): string {
  return `
Siz O'zbekiston qonunchilik bo'yicha mutaxassis sifatida quyidagi ma'lumotlar asosida ish huquqi bo'yicha hujjat yaratishingiz kerak:

Hujjat turi: ${details.type || 'Ish huquqi hujjati'}
Ish beruvchi: ${details.employer || 'Ish beruvchi'}
Xodim: ${details.employee || 'Xodim'}
Ish joyi: ${details.position || 'Lavozim'}
Maosh: ${details.salary || 'Ish haqi'}

Quyidagilarga rioya qiling:
1. O'zbekiston Mehnat kodeksiga muvofiq yozing
2. Tomonlar to'liq ko'rsatilsin
3. Ish shartlari aniq belgilansin
4. Huquq va majburiyatlar
5. Ish vaqti, dam olish
6. Ish haqi va bonuslar
7. Rasmiy til, o'zbek tilida yozing

Hujjat tuzilishi:
- Yuqori o'ng burchakda: Sana
- Markazda: HUJJAT NOMI
- Tomonlar
- Asosiy shartlar
- Huquq va majburiyatlar
- Qo'shimcha shartlar
- Imzolar
`;
}

export function generateGenericPrompt(details: any): string {
  return `
Siz O'zbekiston qonunchilik bo'yicha mutaxassis sifatida quyidagi ma'lumotlar asosida yuridik hujjat yaratishingiz kerak:

Hujjat turi: ${details.type || 'Yuridik hujjat'}
Mazmun: ${details.content || 'Hujjat mazmuni'}

Quyidagilarga rioya qiling:
1. O'zbekiston qonunlariga muvofiq yozing
2. Rasmiy formatda yozing
3. Aniq va tushunarli bo'lsin
4. Qonun asoslari ko'rsatilsin
5. O'zbek tilida yozing
`;
}
