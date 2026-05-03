'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Search, FileText, Mic, Send, BookOpen, Scale, HelpCircle, Volume2, Clock, Star, Lightbulb, Copy, Edit3 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  category?: 'legal' | 'case' | 'document' | 'general';
  relatedLaws?: string[];
  suggestions?: string[];
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface LegalTerm {
  term: string;
  definition: string;
  article?: string;
}

export default function AIAssistant() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMode, setActiveMode] = useState<'chat' | 'case' | 'document'>('chat');
  const [showGlossary, setShowGlossary] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<LegalTerm | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const legalTerms: LegalTerm[] = [
    { term: 'Jinoyat tarkibi', definition: 'Jinoyatni tashkil etuvchi obyektiv va subyektiv belgilarning majmuasi', article: 'JK 3-modda' },
    { term: 'Majburiy qonun', definition: 'Davlat tomonidan qabul qilingan, barcha uchun majburiy bo\'lgan qoidalar to\'plami', article: '' },
    { term: 'Huquqiy subyekt', definition: 'Huquq va majburiyatlarga ega bo\'lishi mumkin bo\'lgan shaxs yoki tashkilot', article: 'FK 8-modda' },
    { term: 'Da\'vo muddati', definition: 'Sudga murojaat qilish uchun belgilangan vaqt', article: 'GPK 77-modda' },
    { term: 'Shartnoma', definition: 'Tomonlar o\'rtasidagi o\'zaro kelishuv asosida huquqiy munosabatlarni belgilovchi hujjat', article: 'FK 342-modda' }
  ];

  const quickActions = [
    { id: 'find-law', label: 'Qonunni top', icon: <BookOpen className="w-4 h-4" />, color: 'blue' },
    { id: 'case-analysis', label: 'Keys tahlili', icon: <Scale className="w-4 h-4" />, color: 'green' },
    { id: 'document', label: 'Hujjat yaratish', icon: <FileText className="w-4 h-4" />, color: 'purple' }
  ];

  const documentTemplates = [
    { id: 'contract', name: 'Shartnoma', description: 'Tijorat shartnomasi namunasi' },
    { id: 'complaint', name: 'Da\'vo arizasi', description: 'Sudga da\'vo arizasi' },
    { id: 'warning', name: 'Ogohlantirish xati', description: 'Qonun buzilishi to\'g\'risida ogohlantirish' },
    { id: 'power-of-attorney', name: 'Vakolatnoma', description: 'Vakolat berish hujjati' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      type: 'user',
      timestamp: new Date(),
      category: selectedCategory === 'all' ? undefined : selectedCategory as any
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate AI response
    setTimeout(() => {
      generateAIResponse(inputValue);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    let responseText = '';
    let category: 'legal' | 'case' | 'document' | 'general' = 'general';
    let relatedLaws: string[] = [];
    let suggestions: string[] = [];

    // Simple AI response logic
    if (userInput.toLowerCase().includes('modda') || userInput.toLowerCase().includes('qonun')) {
      category = 'legal';
      if (userInput.includes('161') && userInput.includes('mehnat')) {
        responseText = 'O\'zbekiston Respublikasi Mehnat kodeksining 161-moddasi "Ishdan bo\'shatishning asoslari" haqida. Ushbu modda ishchi va xodimlarni ishdan bo\'shatishning quyidagi asoslarini belgilaydi:\n\n1. Ishga qabul qilingan paytdan boshlab 3 oy ichida malakasi mos kelmagani uchun\n2. Ish haqi to\'lanmaganligi sababli\n3. Shartnomaning buzilishi sababli\n\nTo\'liq matn uchun Mehnat kodeksining rasmiy nusxasiga murojaat qiling.';
        relatedLaws = ['Mehnat kodeksi 161-modda', 'Mehnat kodeksi 242-modda', 'FK 93-modda'];
        suggestions = ['Ishdan bo\'shatish tartibi qanday?', 'Qaysi hollarda ish haqi to\'lanmaydi?', 'Malaka mos kelmasligi qanday aniqlanadi?'];
      } else {
        responseText = 'Siz so\'ragan qonun normasi haqida to\'liq ma\'lumot berish uchun, iltimos, qaysi kodeks va modda raqamini aniqroq ko\'rsating. Masalan: "Jinoyat kodeksining 169-moddasi"';
        suggestions = ['Jinoyat kodeksi', 'Fuqarolik kodeksi', 'Mehnat kodeksi'];
      }
    } else if (userInput.toLowerCase().includes('shartnoma') || userInput.toLowerCase().includes('kelishuv')) {
      category = 'document';
      responseText = 'Shartnoma tuzish uchun quyidagi elementlar zarur:\n\n1. Tomonlar (F.I.SH., manzil)\n2. Shartnoma predmeti\n3. Huquq va majburiyatlar\n4. To\'lov shartlari\n5. Mas\'uliyatning cheklanishi\n6. Shartnoma muddati\n7. Nizolarni hal qilish tartibi\n\nShartnoma namunasini yaratishni istaysizmi?';
      relatedLaws = ['FK 342-modda', 'FK 367-modda'];
      suggestions = ['Shartnoma namunasini yarat', 'Tijorat shartnomasi xususiyatlari', 'Shartnomani bekor qilish'];
    } else if (userInput.toLowerCase().includes('sud') || userInput.toLowerCase().includes('da\'vo')) {
      category = 'case';
      responseText = 'Sud jarayonini boshlash uchun quyidagi qadamlar kerak:\n\n1. Da\'vo arizasini tayyorlash\n2. Dalillarni yig\'ish (hujjatlar, guvohlar)\n3. Davlat bojini to\'lash\n4. Arizani sudga topshirish\n5. Sud majlisida ishtirok etish\n\nQaysi turdagi nizo bo\'yicha yordam kerak?';
      relatedLaws = ['GPK 77-modda', 'GPK 135-modda', 'JK 62-modda'];
      suggestions = ['Da\'vo arizasi namunasi', 'Dalillarni yig\'ish', 'Sud yig\'imlari'];
    } else {
      responseText = 'Sizning savolingizga to\'liq javob berish uchun, iltimos, savotingizni aniqroq bayon qiling. Men quyidagi yo\'nalishlarda yordam bera olaman:\n\n🔹 Qonun hujjatlarini tahlil qilish\n🔹 Huquqiy masalalarni tushuntirish\n🔹 Hujjatlar bilan ishlash\n🔹 Sud jarayonlari bo\'yicha maslahat\n\nQanday yordam kerak?';
      suggestions = ['Qonunni izlash', 'Hujjat yaratish', 'Sud jarayoni', 'Huquqiy maslahat'];
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      type: 'assistant',
      timestamp: new Date(),
      category,
      relatedLaws,
      suggestions
    };

    setMessages(prev => [...prev, aiMessage]);
    setShowSuggestions(true);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'find-law':
        setInputValue('O\'zbekiston Respublikasining qaysi qonunini izlayapsiz? Kodeks va modda raqamini ko\'rsating.');
        break;
      case 'case-analysis':
        setInputValue('Qanday huquqiy masala yoki keys bo\'yicha yordam kerak? Holatni qisqacha tasvirlab bering.');
        break;
      case 'document':
        setActiveMode('document');
        break;
    }
    inputRef.current?.focus();
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = documentTemplates.find(t => t.id === templateId);
    if (template) {
      setInputValue(`${template.name} yaratish uchun kerakli ma\'lumotlar: 1) Tomonlar ma\'lumotlari, 2) Asosiy shartlar, 3) Qo\'shimcha talablar`);
      setActiveMode('chat');
      inputRef.current?.focus();
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        setInputValue('Ovozli orqali kiritilgan savol: O\'zbekistonda ijara shartnomasi qanday tuziladi?');
      }, 3000);
    }
  };

  const handleTermClick = (term: string) => {
    const termData = legalTerms.find(t => t.term.toLowerCase() === term.toLowerCase());
    if (termData) {
      setSelectedTerm(termData);
      setShowGlossary(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessage = (text: string) => {
    // Highlight legal terms
    let formattedText = text;
    legalTerms.forEach(term => {
      const regex = new RegExp(`\\b${term.term}\\b`, 'gi');
      formattedText = formattedText.replace(regex, `<span class="text-blue-600 underline cursor-pointer" onclick="window.handleTermClick('${term.term}')">${term.term}</span>`);
    });
    return formattedText;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-100 min-h-screen">
          <div className="p-6">
            <a href="/" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer mb-6">
              <ArrowLeft className="w-5 h-5" />
              <span>Orqaga</span>
            </a>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Chat tarixi</h3>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg cursor-pointer">
                  <h4 className="font-medium text-blue-800 text-sm">Mehnat qonuni</h4>
                  <p className="text-xs text-blue-600">161-modda haqida so'rov</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <h4 className="font-medium text-gray-800 text-sm">Shartnoma yordami</h4>
                  <p className="text-xs text-gray-600">Ijara shartnomasi</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <h4 className="font-medium text-gray-800 text-sm">Sud jarayoni</h4>
                  <p className="text-xs text-gray-600">Da'vo arizasi</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Tezkor harakatlar</h3>
              <div className="space-y-2">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className={`w-full flex items-center gap-3 p-3 bg-${action.color}-50 text-${action.color}-700 rounded-lg hover:bg-${action.color}-100 transition-colors`}
                  >
                    {action.icon}
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Templates */}
            {activeMode === 'document' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Hujjat namunalari</h3>
                <div className="space-y-2">
                  {documentTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h4 className="font-medium text-gray-800 text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-600">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white px-8 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">AI Huquqiy Yordamchi</h1>
                  <p className="text-sm text-gray-600">24/7 aqlli huquqiy maslahatchi</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700">Online</span>
                </div>
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Qanday yordam bera olaman?</h2>
                  <p className="text-gray-600 mb-6">Huquqiy savollaringizga javob berish, hujjatlar yaratish, keys tahlili qilish</p>
                  
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
                      <h3 className="font-semibold text-gray-800 mb-1">Qonun tahlili</h3>
                      <p className="text-sm text-gray-600">Murakkab qonunlarni tushuntirish</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <Scale className="w-6 h-6 text-green-600 mb-2" />
                      <h3 className="font-semibold text-gray-800 mb-1">Keys yechimi</h3>
                      <p className="text-sm text-gray-600">Huquqiy masalalarni yechish</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <FileText className="w-6 h-6 text-purple-600 mb-2" />
                      <h3 className="font-semibold text-gray-800 mb-1">Hujjatlar</h3>
                      <p className="text-sm text-gray-600">Shartnomalar va arizalar</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-6 py-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <div
                          className="whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                        />
                        
                        {/* Related Laws */}
                        {message.relatedLaws && message.relatedLaws.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium mb-2">O\'xshash qonunlar:</p>
                            <div className="space-y-1">
                              {message.relatedLaws.map((law, index) => (
                                <div key={index} className="text-xs bg-gray-50 px-2 py-1 rounded">
                                  {law}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        {message.type === 'assistant' && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => copyToClipboard(message.text)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Nusxa olish"
                            >
                              <Copy className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Tahrirlash"
                            >
                              <Edit3 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 px-2">
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        {message.category && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            message.category === 'legal' ? 'bg-blue-100 text-blue-700' :
                            message.category === 'case' ? 'bg-green-100 text-green-700' :
                            message.category === 'document' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {message.category === 'legal' ? 'Huquqiy' :
                             message.category === 'case' ? 'Keys' :
                             message.category === 'document' ? 'Hujjat' : 'Umumiy'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Smart Suggestions */}
                {showSuggestions && messages.length > 0 && messages[messages.length - 1].suggestions && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Keyingi savollar:</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputValue(suggestion)}
                          className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm hover:bg-yellow-300 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 bg-white px-8 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Huquqiy savolingizni yozing..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <button
                  onClick={handleVoiceToggle}
                  className={`p-3 rounded-xl transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Ovozli kiritish"
                >
                  {isRecording ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-gray-600">Kategoriya:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Barchasi
                </button>
                <button
                  onClick={() => setSelectedCategory('legal')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === 'legal' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Huquqiy
                </button>
                <button
                  onClick={() => setSelectedCategory('case')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === 'case' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Keys
                </button>
                <button
                  onClick={() => setSelectedCategory('document')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === 'document' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Hujjat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glossary Tooltip Modal */}
      {showGlossary && selectedTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{selectedTerm.term}</h3>
              <button
                onClick={() => setShowGlossary(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-3">{selectedTerm.definition}</p>
            {selectedTerm.article && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Manba:</strong> {selectedTerm.article}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global handler for term clicks */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.handleTermClick = function(term) {
            // This would be handled by React state in a real implementation
            console.log('Term clicked:', term);
          }
        `
      }} />
    </div>
  );
}
