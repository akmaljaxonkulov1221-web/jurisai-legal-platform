import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { legalRAG } from '@/lib/rag/LegalRAG-real';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || question.trim().length < 10) {
      return NextResponse.json(
        { error: 'Savol kamida 10 ta belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      );
    }

    // Use RAG system to get answer with sources
    const ragResponse = await legalRAG.query(question);

    // Track usage (optional - for analytics)
    await trackUsage('legal_chat', question.length);

    return NextResponse.json({
      answer: ragResponse.answer,
      sources: ragResponse.sources,
      question,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Legal chat error:', error);
    return NextResponse.json(
      { error: 'Yuridik maslahat olishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

async function generateLegalResponse(question: string) {
  // Mock legal response based on question content
  const responses = [
    {
      answer: "Berilgan savol bo'yicha O'zbekiston Respublikasi Fuqarolik kodeksiga muvofiq, fuqaroning huquqlari himoya qilinadi. Agar sizning huquqlaringiz buzilgan bo'lsa, sudga murojaat qilishingiz mumkin. Sud da'vosi 3 oy ichida qo'yilishi kerak.",
      sources: [
        {
          title: "O'zbekiston Respublikasi Fuqarolik kodeksi",
          article: "7-modda. Fuqaroning huquq va majburiyatlari",
          url: "https://lex.uz/acts/-/text/1492387"
        },
        {
          title: "O'zbekiston Respublikasi Fuqarolik kodeksi",
          article: "180-modda. Da'vo muddati",
          url: "https://lex.uz/acts/-/text/1492387"
        }
      ]
    },
    {
      answer: "Ish haqi to'lanmagan taqdirda, Ish kodeksining 237-moddasiga ko'ra, ish beruvchi kechikma uchun qo'shimcha haq to'lashi shart. Kechikma har kuni uchun ish haqining 0.5% miqdorida hisoblanadi. Siz Mehnat inspektsiyasiga murojaat qilishingiz mumkin.",
      sources: [
        {
          title: "O'zbekiston Respublikasi Mehnat kodeksi",
          article: "237-modda. Ish haqini to'lash muddatining buzilishi",
          url: "https://lex.uz/acts/-/text/1493359"
        },
        {
          title: "O'zbekiston Respublikasi Mehnat kodeksi",
          article: "238-modda. Kechikma uchun to'lanadigan kompensatsiya",
          url: "https://lex.uz/acts/-/text/1493359"
        }
      ]
    },
    {
      answer: "Ko'chmas mulk shartnomasi davlat ro'yxatidan o'tkazilishi shart. Ro'yxatdan o'tkazilmagan shartnoma huquqiy kuchga ega emas. Shartnoma notarial tasdiqlash orqali yoki Adliya vazirligining onlayn tizimi orqali ro'yxatdan o'tkazilishi mumkin.",
      sources: [
        {
          title: "O'zbekiston Respublikasi Fuqarolik kodeksi",
          article: "130-modda. Mulkiy huquqlarning davlat ro'yxatidan o'tkazilishi",
          url: "https://lex.uz/acts/-/text/1492387"
        },
        {
          title: "O'zbekiston Respublikasi 'Ko'chmas mulkni davlat ro'yxatidan o'tkazish to'g'risida'gi Qonuni",
          article: "5-modda. Ro'yxatdan o'tkazish tartibi",
          url: "https://lex.uz/acts/-/text/3445297"
        }
      ]
    }
  ];

  // Select response based on question keywords
  let selectedResponse = responses[0];
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('ish haqi') || lowerQuestion.includes('maosh')) {
    selectedResponse = responses[1];
  } else if (lowerQuestion.includes('uy') || lowerQuestion.includes('ko\'chmas mulk') || lowerQuestion.includes('shartnoma')) {
    selectedResponse = responses[2];
  }

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  return selectedResponse;
}

async function trackUsage(feature: string, metadata?: any) {
  try {
    await supabase.from('usage_tracking').insert({
      id: crypto.randomUUID(),
      user_id: 'demo-user', // Replace with actual user ID
      feature,
      action: 'query',
      quantity: 1,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
  }
}
