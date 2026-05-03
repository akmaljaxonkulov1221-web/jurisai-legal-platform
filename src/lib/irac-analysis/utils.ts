// IRAC Analysis Utilities
// This file contains utility functions for IRAC analysis

export function extractSection(text: string, section: string): string {
  const regex = new RegExp(`\\*\\*${section}\\*\\*:[\\s\\S]*?(?=\\*\\*|$)`, 'i');
  const match = text.match(regex);
  if (match) {
    return match[0].replace(/\*\*.*?\*\*:/, '').trim();
  }
  return '';
}

export function extractSources(text: string): Array<{
  title: string;
  article: string;
  url: string;
}> {
  const sources: Array<{
    title: string;
    article: string;
    url: string;
  }> = [];
  
  // Common Uzbek legal documents
  const legalDocs = [
    {
      title: "O'zbekiston Respublikasi Fuqarolik kodeksi",
      article: "350-modda. Shartnomaning bajarilishi",
      url: "https://lex.uz/acts/-/text/1492387"
    },
    {
      title: "O'zbekiston Respublikasi Mehnat kodeksi",
      article: "237-modda. Ish haqini to'lash muddatining buzilishi",
      url: "https://lex.uz/acts/-/text/1493359"
    },
    {
      title: "O'zbekiston Respublikasi Oilaviy kodeksi",
      article: "55-modda. Ajralish to'g'risida da'vo qo'yish",
      url: "https://lex.uz/acts/-/text/1492386"
    }
  ];

  // Extract mentions of legal documents from text
  legalDocs.forEach(doc => {
    if (text.toLowerCase().includes(doc.title.toLowerCase().split(' ')[0])) {
      sources.push(doc);
    }
  });

  return sources;
}

export function calculateConfidence(caseText: string, response: string): number {
  // Simple confidence calculation based on response quality
  let confidence = 75; // Base confidence

  // Increase confidence if response has all IRAC sections
  const hasIssue = response.toLowerCase().includes('issue');
  const hasRule = response.toLowerCase().includes('rule');
  const hasApplication = response.toLowerCase().includes('application');
  const hasConclusion = response.toLowerCase().includes('conclusion');

  if (hasIssue && hasRule && hasApplication && hasConclusion) {
    confidence += 15;
  }

  // Increase confidence if legal articles are mentioned
  if (/\d+-modda/i.test(response)) {
    confidence += 10;
  }

  return Math.min(confidence, 95);
}

export function getMockAnalysis(caseText: string) {
  // Fallback mock analysis
  return {
    issue: "Berilgan holatda fuqaroning mulkiy huquqlari buzilganligi masalasi ko'rib chiqilmoqda. Asosiy masala - shartnoma shartlarining to'g'ri bajarilmasligi va undan kelib chiqqan zararning qoplash masalasi.",
    rule: "O'zbekiston Respublikasi Fuqarolik kodeksining 350-moddasiga ko'ra, shartnoma tomonlari o'z majburiyatlarini qonun hujjatlarida belgilangan tartibda bajarishlari shart. 367-moddasiga ko'ra, majburiyatni noto'g'ri bajargan tomon ikkinchi tomonga yetkazilgan zararni qoplashi lozim.",
    application: "Berilgan holatda, sotuvchi tomonidan tovar sifatiga ko'ra talab qilinayotgan xususiyatlar bo'lmaganligi, shu sababli xaridor tomonidan shartnoma bekor qilinishi va to'langan pulning qaytarilishi talabi qonuniy asoslangan. Sotuvchining xatosi tovarning sifatiga oid ma'lumotni to'liq bermaganligida ifodalanadi.",
    conclusion: "Xulosa qilib aytganda, xaridorning da'vosi asosli hisoblanadi. Sotuvchi to'langan pulni qaytarishi va, agar bo'lsa, qo'shimcha zararni qoplashi kerak. Shartnoma bekor qilinishi O'zbekiston Respublikasi Fuqarolik kodeksining 357-moddasiga muvofiq amalga oshirilishi mumkin.",
    sources: [
      {
        title: "O'zbekiston Respublikasi Fuqarolik kodeksi",
        article: "350-modda. Shartnomaning bajarilishi",
        url: "https://lex.uz/acts/-/text/1492387"
      },
      {
        title: "O'zbekiston Respublikasi Fuqarolik kodeksi",
        article: "367-modda. Majburiyatni noto'g'ri bajarish oqibatida yetkazilgan zararning qoplanishi",
        url: "https://lex.uz/acts/-/text/1492387"
      }
    ],
    confidence: 85
  };
}
