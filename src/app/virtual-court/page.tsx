'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Gavel, Scale, Users, Mic, Send, Clock, AlertTriangle, CheckCircle, FileText, MessageCircle, Play, Pause, Volume2 } from 'lucide-react';

interface CourtRole {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface CourtStage {
  id: string;
  title: string;
  description: string;
  duration: number;
}

interface CourtAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  shortcut: string;
}

interface CourtMessage {
  id: string;
  speaker: string;
  role: string;
  text: string;
  timestamp: Date;
  type: 'statement' | 'objection' | 'question' | 'answer' | 'ruling';
}

interface CourtScore {
  etiquette: number;
  argumentation: number;
  evidence: number;
  timing: number;
  total: number;
}

export default function VirtualCourt() {
  const [selectedRole, setSelectedRole] = useState<CourtRole | null>(null);
  const [currentStage, setCurrentStage] = useState<string>('preparation');
  const [isInSession, setIsInSession] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [messages, setMessages] = useState<CourtMessage[]>([]);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [score, setScore] = useState<CourtScore>({
    etiquette: 100,
    argumentation: 0,
    evidence: 0,
    timing: 100,
    total: 100
  });
  const [objectionRaised, setObjectionRaised] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roles: CourtRole[] = [
    {
      id: 'advokat',
      title: 'Advokat (Yoqlovchi)',
      description: 'Mijoz manfaatlarini himoya qiling, dalillarni keltiring, sudyani ishontiring',
      icon: <Scale className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: 'prokuror',
      title: 'Prokuror (Ayblovchi)',
      description: 'Davlat nomidan ayblovni qo\'llab-quvvatlang, guvohlarni so\'roq qiling',
      icon: <Gavel className="w-6 h-6" />,
      color: 'red'
    },
    {
      id: 'sudya',
      title: 'Sudya',
      description: 'Tomonlarning argumentlarini tinglang, qonun asosida adolatli hukm chiqaring',
      icon: <Users className="w-6 h-6" />,
      color: 'purple'
    }
  ];

  const stages: CourtStage[] = [
    { id: 'preparation', title: 'Tayyorgarlik', description: 'Ish materiallari bilan tanishish', duration: 60 },
    { id: 'trial', title: 'Sud tergovi', description: 'Bayonotlar va guvoh so\'roq', duration: 120 },
    { id: 'debate', title: 'Sud muzokaralari', description: 'Yakuniy nutqlar', duration: 90 },
    { id: 'verdict', title: 'Qaror chiqarish', description: 'Yakuniy hukm', duration: 30 }
  ];

  const actions: CourtAction[] = [
    { id: 'objection', title: 'E\'tiroz bildirish', description: 'Qonunga zid bayonotga e\'tiroz', icon: <AlertTriangle className="w-4 h-4" />, shortcut: 'Ctrl+O' },
    { id: 'evidence', title: 'Dalil taqdim etish', description: 'Yangi dalil keltirish', icon: <FileText className="w-4 h-4" />, shortcut: 'Ctrl+E' },
    { id: 'question', title: 'Savol berish', description: 'Guvohga yoki raqibga savol', icon: <MessageCircle className="w-4 h-4" />, shortcut: 'Ctrl+Q' },
    { id: 'statement', title: 'Bayonot', description: 'Asosiy nutq', icon: <Mic className="w-4 h-4" />, shortcut: 'Ctrl+S' }
  ];

  useEffect(() => {
    if (isInSession && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isInSession) {
      endSession();
    }
  }, [isInSession, timeLeft]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startSession = (role: CourtRole) => {
    setSelectedRole(role);
    setIsInSession(true);
    setTimeLeft(300);
    setCurrentStage('preparation');
    
    // Add initial message
    const initialMessage: CourtMessage = {
      id: Date.now().toString(),
      speaker: 'Sudya',
      role: 'sudya',
      text: 'Sessiyani ochishga ruxsat beriladi. Tomonlarni tanishtirishni so\'rayman.',
      timestamp: new Date(),
      type: 'ruling'
    };
    setMessages([initialMessage]);
  };

  const endSession = () => {
    setIsInSession(false);
    setShowVerdict(true);
    
    // Calculate final score
    const finalScore = {
      etiquette: score.etiquette,
      argumentation: Math.min(100, score.argumentation + Math.floor(Math.random() * 20)),
      evidence: Math.min(100, score.evidence + Math.floor(Math.random() * 15)),
      timing: timeLeft > 60 ? 100 : Math.floor((timeLeft / 300) * 100),
      total: 0
    };
    finalScore.total = Math.round((finalScore.etiquette + finalScore.argumentation + finalScore.evidence + finalScore.timing) / 4);
    setScore(finalScore);
  };

  const handleAction = (actionId: string) => {
    setCurrentAction(actionId);
    
    switch (actionId) {
      case 'objection':
        if (!objectionRaised) {
          setObjectionRaised(true);
          addMessage('E\'tiroz!', 'objection');
          setTimeout(() => {
            addMessage('E\'tiroz qabul qilindi. Dalil keltiring.', 'ruling', 'Sudya');
            setObjectionRaised(false);
          }, 2000);
        }
        break;
      case 'evidence':
        addMessage('Hujjatli dalil taqdim etaman: Shartnoma, 3-ilova, 15-bet.', 'statement');
        updateScore('evidence', 10);
        break;
      case 'question':
        addMessage('Guvohdan savol: Siz voqea joyida bo\'lganingizni tasdiqlaysizmi?', 'question');
        break;
      case 'statement':
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          addMessage('Muhtaram sudya, mening mijozim aybsiz, chunki...', 'statement');
          updateScore('argumentation', 15);
        }, 3000);
        break;
    }
  };

  const addMessage = (text: string, type: 'statement' | 'objection' | 'question' | 'answer' | 'ruling', speaker?: string) => {
    const message: CourtMessage = {
      id: Date.now().toString(),
      speaker: speaker || selectedRole?.title || 'Foydalanuvchi',
      role: selectedRole?.id || 'user',
      text,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, message]);
  };

  const updateScore = (category: keyof CourtScore, points: number) => {
    setScore(prev => ({
      ...prev,
      [category]: Math.min(100, prev[category] + points),
      total: Math.min(100, prev.total + Math.floor(points / 4))
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStageColor = (stageId: string) => {
    switch (stageId) {
      case 'preparation': return 'bg-blue-100 text-blue-700';
      case 'trial': return 'bg-yellow-100 text-yellow-700';
      case 'debate': return 'bg-orange-100 text-orange-700';
      case 'verdict': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (showVerdict && selectedRole) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-4 overflow-hidden">
          {/* Verdict Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <Gavel className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Sud Majlisi Yakunlandi</h1>
            <p className="text-blue-100">{selectedRole.title} sifatida ishtirokingiz uchun</p>
          </div>
          
          {/* Verdict Body */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Baholash Natijalari</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Sud etikasi</p>
                  <p className="text-2xl font-bold text-green-600">{score.etiquette}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Argumentatsiya</p>
                  <p className="text-2xl font-bold text-blue-600">{score.argumentation}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Dalillar</p>
                  <p className="text-2xl font-bold text-purple-600">{score.evidence}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Vaqt nazorati</p>
                  <p className="text-2xl font-bold text-orange-600">{score.timing}%</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <p className="text-lg text-gray-700 mb-2">Umumiy ball</p>
                <p className="text-4xl font-bold text-blue-600">{score.total}/100</p>
                <div className="mt-3 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${score.total}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {score.total >= 80 ? 'A\'lo! Siz yuqori darajadagi yurist sifatida ko\'rilasiz.' :
                   score.total >= 60 ? 'Yaxshi. Ba\'zi jihatlarni yaxshilashingiz mumkin.' :
                   'Qo\'shimcha mashq qiling. Potensialingiz yuqori.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Verdict Actions */}
          <div className="bg-gray-50 px-8 py-4 flex justify-between">
            <button
              onClick={() => setShowVerdict(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Orqaga
            </button>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Qayta boshlash
              </button>
              <a href="/" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Bosh sahifa
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isInSession && selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Court Room Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: 'url(/court-room.jpg)' }}></div>
        </div>
        
        <div className="relative z-10">
          {/* Court Header */}
          <header className="bg-black bg-opacity-50 px-8 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsInSession(false)}
                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold">Virtual Sud Majlisi</h1>
                  <p className="text-sm text-gray-300">{selectedRole.title}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span className={`font-bold ${timeLeft <= 60 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm ${getStageColor(currentStage)}`}>
                  {stages.find(s => s.id === currentStage)?.title}
                </div>
              </div>
            </div>
          </header>

          {/* Court Room */}
          <div className="flex h-screen">
            {/* Judge and Opponent Area */}
            <div className="w-1/3 p-6">
              <div className="bg-black bg-opacity-50 rounded-xl p-6 mb-4">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Sudya</h3>
                  <p className="text-sm text-gray-300">Protsessual rahbar</p>
                </div>
              </div>
              
              {selectedRole.id !== 'prokuror' && (
                <div className="bg-black bg-opacity-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Gavel className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold">Prokuror</h3>
                    <p className="text-sm text-gray-300">Ayblovchi</p>
                  </div>
                </div>
              )}
            </div>

            {/* Main Court Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages/Transcript */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-black bg-opacity-30 rounded-xl p-6 max-h-96">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.type === 'objection' ? 'bg-red-900 bg-opacity-50 border border-red-500' :
                          message.type === 'ruling' ? 'bg-purple-900 bg-opacity-50 border border-purple-500' :
                          'bg-gray-800 bg-opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{message.speaker}</span>
                          <span className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-white">{message.text}</p>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6">
                <div className="bg-black bg-opacity-50 rounded-xl p-4">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleAction(action.id)}
                        disabled={currentAction === action.id}
                        className={`p-4 rounded-lg transition-all ${
                          currentAction === action.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        } disabled:opacity-50`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {action.icon}
                          <span className="text-xs font-medium">{action.title}</span>
                          <span className="text-xs text-gray-400">{action.shortcut}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Voice Recording */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-4 rounded-full transition-all ${
                        isRecording 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {isRecording ? <Pause className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                    {isRecording && (
                      <span className="ml-4 text-red-400">Yozib olinmoqda...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Panel */}
            <div className="w-64 p-6">
              <div className="bg-black bg-opacity-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-4">Ballar</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Etika</span>
                      <span>{score.etiquette}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${score.etiquette}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Argumentatsiya</span>
                      <span>{score.argumentation}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${score.argumentation}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dalillar</span>
                      <span>{score.evidence}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${score.evidence}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Vaqt</span>
                      <span>{score.timing}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${score.timing}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Jami</span>
                    <span className="text-xl font-bold text-blue-400">{score.total}</span>
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
                  <Gavel className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-800">Virtual Sud</span>
                </div>
              </div>
              <div className="mb-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">1 ta majlis qolgan</p>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Gavel className="w-5 h-5" />
                <span className="font-medium">Virtual Sud</span>
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
                <h1 className="text-2xl font-bold text-gray-800">Virtual Sud</h1>
                <p className="text-sm text-gray-600">Realistik sud majlisi - protsessual qonunlarni "jang maydoni"</p>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-8">
            <div className="max-w-6xl mx-auto">
              {/* Role Selection */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Rolingizni tanlang</h2>
                <div className="grid grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-200"
                      onClick={() => startSession(role)}
                    >
                      <div className={`w-16 h-16 bg-${role.color}-100 rounded-full flex items-center justify-center mb-4 text-${role.color}-600`}>
                        {role.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{role.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4" />
                          <span>To\'liq protsessual huquqlar</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>5 daqiqa majlis</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>AI raqib</span>
                        </div>
                      </div>
                      
                      <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Majlisni boshlash
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Court Process Stages */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sud jarayoni bosqichlari</h2>
                <div className="grid grid-cols-4 gap-4">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                          {index + 1}
                        </div>
                        <h3 className="font-semibold text-gray-800">{stage.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{stage.duration} daqiqa</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Virtual Sud xususiyatlari</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">AI Raqib</h4>
                      <p className="text-sm text-gray-600">Realistik e\'tirozlar va qarshi argumentlar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Ovozli AI</h4>
                      <p className="text-sm text-gray-600">Nutq analizi va intonatsiya baholash</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Sud etikasi</h4>
                      <p className="text-sm text-gray-600">Murojaat odobi va protsessual qoidalar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Baholash tizimi</h4>
                      <p className="text-sm text-gray-600">Ko\'p parametrli ball berish</p>
                    </div>
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
