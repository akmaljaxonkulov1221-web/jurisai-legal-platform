// Document Generation Utilities
// This file contains utility functions for document generation

export function getDocumentTitle(documentType: string, details: any): string {
  const titles: Record<string, string> = {
    'ariza': `${details.purpose || 'Ariza'}`,
    'shartnoma': `${details.type || 'Shartnoma'}`,
    'da-vo': 'Da\'vo arizasi',
    'voz': 'Voz arizasi',
    'ish-huquqi': `${details.type || 'Ish huquqi hujjati'}`
  };
  return titles[documentType] || 'Yuridik hujjat';
}

export function calculateConfidence(content: string): number {
  let confidence = 70;
  
  if (content.length > 500) confidence += 10;
  if (content.includes('Sana:') || content.includes('sana')) confidence += 5;
  if (content.includes('F.I.O.') || content.includes('f.i.o.')) confidence += 5;
  if (content.includes('modda') || content.includes('Modda')) confidence += 10;
  
  return Math.min(confidence, 95);
}

export function getMockDocument(documentType: string, details: any) {
  const templates: Record<string, string> = {
    'ariza': `________________
2024-yil __ ______
Toshkent shahri

${details.recipient || 'TASHKILOT NOMI'}
rahbariga

${details.applicant || '_________________'}
dan ariza

Hurmatli rahbar!

Men sizdan ${details.subject || 'ariza mazmuni'} bo'yicha yordam so'rayman.

Bu masala bo'yicha O'zbekiston Respublikasining qonun hujjatlariga asosan mening huquqlarim himoya qilinishi kerak.

Sizning ijobiy yordamingizdan umid qilaman.

Hurmat bilan,
${details.applicant || '_________________'}
_________________

`,
    'shartnoma': `________________
2024-yil __ ______
Toshkent shahri

SHARTNOMA

${details.parties || 'Tomonlar'} o'rtasida quyidagi shartnoma tuzildi:

1. SHARTNOMA TOMONLARI:
${details.parties || 'Tomonlar F.I.O.'}

2. SHARTNOMA PREDMETI:
${details.subject || 'Shartnoma mazmuni'}

3. SHARTNOMA MUDDATI:
${details.duration || 'Shartnoma muddati'}

4. TOMONLARNING HUQUQ VA MAJBURIYATLARI:
Tomonlar shartnoma shartlariga rioya qilishlari shart.

5. JAVOBGARLIK:
Shartnoma shartlarini buzgan tomon qonun hujjatlariga muvofiq javob beradi.

Tomonlar imzolari:
_________________      _________________

`,
    'da-vo': `________________
2024-yil __ ______
Toshkent shahri

${details.court || 'SUD NOMI'}

DA\'VO ARIZASI

Da\'vo beruvchi: ${details.plaintiff || '_________________'}
Javobgar: ${details.defendant || '_________________'}

Men ${details.defendant || 'javobgar'} dan quyidagi talablarni qo'yaman:
${details.claim || 'Da\'vo talabi'}

Da\'vo asoslari: ${details.basis || 'Da\'vo asoslari'}

Dalillar: _________________________

Talab:
Sizdan mening da\'vo arizamni qanoatlantirishni so'rayman.

Da\'vo beruvchi: _________________

`,
    'default': `________________
2024-yil __ ______
Toshkent shahri

YURIDIK HUJJAT

${details.type || 'Hujjat turi'}

${details.content || 'Hujjat mazmuni'}

Bu hujjat O'zbekiston Respublikasi qonun hujjatlariga muvofiq tuzildi.

_________________

`
  };

  return {
    type: documentType,
    title: getDocumentTitle(documentType, details),
    content: templates[documentType] || templates.default,
    metadata: {
      generatedAt: new Date().toISOString(),
      template: documentType,
      confidence: 75
    }
  };
}
