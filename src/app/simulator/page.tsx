'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Clock, MessageCircle, User, Gavel, Search, Mic, Send, AlertTriangle, TrendingUp, Award, Target, Volume2 } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  mood: 'happy' | 'neutral' | 'angry' | 'suspicious';
  personality: string;
}

interface Message {
  id: string;
  character: string;
  text: string;
  timestamp: Date;
  type: 'ai' | 'user';
}

interface SimulationResult {
  legalAccuracy: number;
  ethics: number;
  confidence: number;
  totalScore: number;
  xpEarned: number;
  achievements: string[];
}

export default function Simulator() {
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [stressLevel, setStressLevel] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const simulations = [
    {
      id: 'court',
      title: 'Sud jarayoni',
      description: 'Sudya, advokat yoki prokuror rolini o\'ynang',
      icon: <Gavel className="w-6 h-6" />,
      color: 'blue',
      roles: [
        { id: 'judge', name: 'Sudya', description: 'Adolatli hukm chiqaring' },
        { id: 'lawyer', name: 'Advokat', description: 'Mijoz huquqlarini himob qiling' },
        { id: 'prosecutor', name: 'Prokuror', description: 'Davlat manfaatini himoya qiling' }
      ]
    },
    {
      id: 'negotiation',
      title: 'Mijoz bilan muzokara',
      description: 'AI mijoz bilan muzokara qiling',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'green',
      roles: [
        { id: 'consultant', name: 'Huquqshunos maslahatchi', description: 'Mijozga to\'g\'ri yo\'nalishni ko\'rsating' },
        { id: 'mediator', name: 'Mediator', description: 'Tomonlar o\'rtasida kelishuv o\'rnating' }
      ]
    },
    {
      id: 'investigation',
      title: 'Tergov jarayoni',
      description: 'Guvohlarni so\'roq qiling va dalillarni tahliling',
      icon: <Search className="w-6 h-6" />,
      color: 'purple',
      roles: [
        { id: 'detective', name: 'Detektiv', description: 'Jinoyatni oching' },
        { id: 'investigator', name: 'Tergovchi', description: 'Dalillarni to\'plang' }
      ]
    }
  ];

  const characters: { [key: string]: Character } = {
    court_judge: {
      id: 'court_judge',
      name: 'Aziz Karimov',
      role: 'Sudya',
      avatar: '👨‍⚖️',
      mood: 'neutral',
      personality: 'rasmiy, adolatli, talabchan'
    },
    court_prosecutor: {
      id: 'court_prosecutor',
      name: 'Dilora Nazarova',
      role: 'Prokuror',
      avatar: '👩‍💼',
      mood: 'neutral',
      personality: 'qat\'iy, dalil asosida, professionallik'
    },
    negotiation_client: {
      id: 'negotiation_client',
      name: 'Bahodir Toshmatov',
      role: 'Mijoz',
      avatar: '👨‍💼',
      mood: 'suspicious',
      personality: 'asabiy, shubhali, xavotirda'
    },
    investigation_witness: {
      id: 'investigation_witness',
      name: 'Gulnora Raximova',
      role: 'Guvoh',
      avatar: '👩',
      mood: 'suspicious',
      personality: 'qo\'rqqan, noaniq, ba\'zi sirli'
    }
  };

  useEffect(() => {
    if (isSimulating && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isSimulating) {
      endSimulation();
    }
  }, [isSimulating, timeLeft]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startSimulation = (simId: string, role: string) => {
    setSelectedSimulation(simId);
    setSelectedRole(role);
    setIsSimulating(true);
    setTimeLeft(30);
    setStressLevel(0);
    setMessages([]);
    
    // Set appropriate character based on simulation
    if (simId === 'court' && role === 'lawyer') {
      setCurrentCharacter(characters.court_prosecutor);
      addAIMessage('Sudya o\'rnidan: "Sessiyani boshlaymiz. Prokuror so\'zga chiqing."');
    } else if (simId === 'negotiation') {
      setCurrentCharacter(characters.negotiation_client);
      addAIMessage('Mijoz: "Men shartnomani buzdim, lekin bu mening aybim emas. Nima qilish kerak?"');
    } else if (simId === 'investigation') {
      setCurrentCharacter(characters.investigation_witness);
      addAIMessage('Guvoh: "Men... men hech narsa ko\'rmaganman..."');
    }
  };

  const addAIMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      character: currentCharacter?.name || 'AI',
      text,
      timestamp: new Date(),
      type: 'ai'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      character: 'Siz',
      text: userInput,
      timestamp: new Date(),
      type: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    // Process user input and generate AI response
    processUserInput(userInput);
    setUserInput('');
  };

  const processUserInput = (input: string) => {
    // Simple AI response logic
    let response = '';
    let moodChange: 'happy' | 'neutral' | 'angry' | 'suspicious' = 'neutral';

    if (selectedSimulation === 'negotiation') {
      if (input.toLowerCase().includes('tinch') || input.toLowerCase().includes('kafolat')) {
        response = 'Mijoz: "Yaxshi, men sizga ishonaman. Nima qilishni maslahat berasiz?"';
        moodChange = 'happy';
        setStressLevel(prev => Math.max(0, prev - 10));
      } else if (input.toLowerCase().includes('sud') || input.toLowerCase().includes('jazo')) {
        response = 'Mijoz: "Javobgarlikka tortilmasligim uchun nima qilish mumkin? Men qo\'rqyapman..."';
        moodChange = 'suspicious';
        setStressLevel(prev => Math.min(100, prev + 15));
      } else {
        response = 'Mijoz: "Buni tushunmayapman. Iltimos, oddiyroq tushuntiring."';
        moodChange = 'suspicious';
        setStressLevel(prev => Math.min(100, prev + 5));
      }
    } else if (selectedSimulation === 'court') {
      if (input.toLowerCase().includes('dalil') || input.toLowerCase().includes('modda')) {
        response = 'Sudya: "Dalillar qabul qilindi. Davom eting."';
        moodChange = 'neutral';
      } else {
        response = 'Sudya: "Sizning argumentingiz aniq emas. Qonun asosida gapiring."';
        moodChange = 'angry';
        setStressLevel(prev => Math.min(100, prev + 20));
      }
    } else if (selectedSimulation === 'investigation') {
      if (input.toLowerCase().includes('kafolat') || input.toLowerCase().includes('himoya')) {
        response = 'Guvoh: "Agar siz meni himoya qilsangiz... men barchasini aytaman."';
        moodChange = 'neutral';
      } else {
        response = 'Guvoh: "Men... men gapira olmayman..."';
        moodChange = 'suspicious';
        setStressLevel(prev => Math.min(100, prev + 10));
      }
    }

    // Update character mood
    if (currentCharacter) {
      setCurrentCharacter({ ...currentCharacter, mood: moodChange });
    }

    // Add AI response
    setTimeout(() => {
      addAIMessage(response);
    }, 1000);
  };

  const endSimulation = () => {
    setIsSimulating(false);
    
    // Calculate results
    const legalAccuracy = Math.max(0, 100 - stressLevel * 0.5);
    const ethics = Math.min(100, 70 + Math.random() * 30);
    const confidence = Math.min(100, 60 + Math.random() * 40);
    const totalScore = (legalAccuracy + ethics + confidence) / 3;
    const xpEarned = Math.floor(totalScore * 2);
    
    const achievements = [];
    if (legalAccuracy >= 80) achievements.push('Yuridik aniqlik');
    if (ethics >= 80) achievements.push('Yuqori etika');
    if (confidence >= 80) achievements.push('Ishonchli notiq');
    if (totalScore >= 85) achievements.push('Simulyator ustasi');
    
    setResults({
      legalAccuracy,
      ethics,
      confidence,
      totalScore,
      xpEarned,
      achievements
    });
    
    setShowResults(true);
  };

  const resetSimulation = () => {
    setSelectedSimulation(null);
    setSelectedRole(null);
    setIsSimulating(false);
    setTimeLeft(30);
    setStressLevel(0);
    setMessages([]);
    setCurrentCharacter(null);
    setShowResults(false);
    setResults(null);
  };

  const getStressColor = () => {
    if (stressLevel < 30) return 'bg-green-500';
    if (stressLevel < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'angry': return '😠';
      case 'suspicious': return '🤔';
      case 'scared': return '😨';
      default: return '😐';
    }
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-[#f8faff]">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-100 min-h-screen">
            <div className="p-6">
              <a href="/simulator" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer mb-4">
                <ArrowLeft className="w-5 h-5" />
                <span>Orqaga</span>
              </a>
              
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-2">Simulyatsiya yakunlandi!</h3>
                <p className="text-sm text-green-600">Siz {results.xpEarned} XP oldingiz</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 p-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Simulyatsiya Natijalari</h1>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{Math.round(results.legalAccuracy)}%</h3>
                  <p className="text-sm text-gray-600">Yuridik aniqlik</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{Math.round(results.ethics)}%</h3>
                  <p className="text-sm text-gray-600">Etika</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{Math.round(results.confidence)}%</h3>
                  <p className="text-sm text-gray-600">Ishonch darajasi</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Umumiy ball: {Math.round(results.totalScore)}/100</h3>
                <div className="bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${results.totalScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-yellow-800 mb-4">Yutuqlar 🏆</h3>
                <div className="flex flex-wrap gap-2">
                  {results.achievements.map((achievement, index) => (
                    <span key={index} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={resetSimulation}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Yangi simulyatsiya
                </button>
                <a
                  href="/"
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors text-center"
                >
                  Bosh sahifa
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSimulating && currentCharacter) {
    return (
      <div className="min-h-screen bg-[#f8faff]">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-100 min-h-screen">
            <div className="p-6">
              <a href="/simulator" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer mb-6">
                <ArrowLeft className="w-5 h-5" />
                <span>Chiqish</span>
              </a>
              
              {/* Character Card */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{currentCharacter.avatar}</div>
                  <h3 className="font-semibold text-gray-800">{currentCharacter.name}</h3>
                  <p className="text-sm text-gray-600">{currentCharacter.role}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">{getMoodEmoji(currentCharacter.mood || 'neutral')}</div>
                  <p className="text-xs text-gray-600">{currentCharacter.personality}</p>
                </div>
              </div>
              
              {/* Stress Meter */}
              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="font-semibold text-red-800 mb-2">Stress darajasi</h3>
                <div className="bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`${getStressColor()} h-3 rounded-full transition-all duration-300`} 
                    style={{ width: `${stressLevel}%` }}
                  ></div>
                </div>
                <p className="text-sm text-red-600">{stressLevel}%</p>
              </div>
            </div>
          </div>

          {/* Main Simulation Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white px-8 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Simulyatsiya jarayoni</h1>
                  <p className="text-sm text-gray-600">
                    {selectedSimulation === 'court' && 'Sud jarayoni'}
                    {selectedSimulation === 'negotiation' && 'Mijoz bilan muzokara'}
                    {selectedSimulation === 'investigation' && 'Tergov jarayoni'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-500" />
                    <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                      {timeLeft}s
                    </span>
                  </div>
                  <button
                    onClick={endSimulation}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Tugatish
                  </button>
                </div>
              </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 p-8">
              <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-3 rounded-xl ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">{message.character}</p>
                          <p>{message.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="border-t border-gray-100 p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Javobingizni kiriting..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            
            {/* Daily Goal Block */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-800">Kundalik maqsad</span>
                </div>
              </div>
              <div className="mb-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">2 ta simulyatsiya qolgan</p>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Play className="w-5 h-5" />
                <span className="font-medium">Simulyator</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white px-8 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Simulyator</h1>
                <p className="text-sm text-gray-600">Xavfsiz virtual poligon - yuridik mahoratni charxlash</p>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Simulyatsiya turini tanlang</h2>
              <div className="grid grid-cols-3 gap-6">
                {simulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedSimulation(sim.id)}
                  >
                    <div className={`w-12 h-12 bg-${sim.color}-100 rounded-lg flex items-center justify-center mb-4 text-${sim.color}-600`}>
                      {sim.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{sim.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{sim.description}</p>
                    
                    {selectedSimulation === sim.id && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Rolni tanlang:</h4>
                        {sim.roles.map((role) => (
                          <button
                            key={role.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              startSimulation(sim.id, role.id);
                            }}
                            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <h5 className="font-medium text-gray-800">{role.name}</h5>
                            <p className="text-xs text-gray-600">{role.description}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Simulyator xususiyatlari</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">AI Personajlar</h4>
                    <p className="text-sm text-gray-600">Realistik xarakterlar va hissiy reaktsiyalar</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Vaqt chegarasi</h4>
                    <p className="text-sm text-gray-600">Tezkor qaror qabul qilish mashqi</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Stress metr</h4>
                    <p className="text-sm text-gray-600">Hissiy intellektni rivojlantirish</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Taqdirlash</h4>
                    <p className="text-sm text-gray-600">XP ballari va maxsus yutuqlar</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
