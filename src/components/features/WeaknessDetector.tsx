'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/services/auth';
import { api } from '@/services/api';

interface WeaknessPoint {
  id: string;
  weakness_type: string;
  description: string;
  severity: string;
  location: string;
  suggestion: string;
  legal_references: string[];
}

interface WeaknessDetection {
  id: string;
  argument_text: string;
  argument_type: string;
  overall_score: number;
  weakness_points: WeaknessPoint[];
  strengths: string[];
  improvement_suggestions: string[];
  legal_compliance_score: number;
  logical_coherence_score: number;
  factual_accuracy_score: number;
  persuasive_power_score: number;
  processing_time: number;
  created_at: string;
}

interface WeaknessDetectionRequest {
  argument_text: string;
  argument_type: string;
  context?: string;
  target_audience?: string;
  analysis_depth: string;
}

export default function WeaknessDetector() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('detect');
  const [argumentText, setArgumentText] = useState('');
  const [argumentType, setArgumentType] = useState('legal');
  const [context, setContext] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [analysisDepth, setAnalysisDepth] = useState('standard');
  const [currentDetection, setCurrentDetection] = useState<WeaknessDetection | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState<WeaknessDetection[]>([]);
  const [weaknessTypes, setWeaknessTypes] = useState<any[]>([]);
  const [improvementStyle, setImprovementStyle] = useState('formal');
  const [improvedArgument, setImprovedArgument] = useState('');
  
  // Mock API hooks instead of real API calls
  const detectWeaknesses = useApi<WeaknessDetection>(async (request: WeaknessDetectionRequest) => {
    console.log('Detecting weaknesses...', request);
    // Mock weakness detection
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockWeaknessPoints: WeaknessPoint[] = [
      {
        id: 'weak_1',
        weakness_type: 'logical_fallacy',
        description: 'Argumentda mantiqiy xatolik bor - etarli dalillar keltirilmagan',
        severity: 'high',
        location: '2-3 paragraf',
        suggestion: 'Qo\'shimcha dalillar va guvohliklar keltiring',
        legal_references: ['FK 167-modda', 'GPK 162-modda']
      },
      {
        id: 'weak_2',
        weakness_type: 'legal_inaccuracy',
        description: 'Qonun havolasi noto\'g\'ri berilgan',
        severity: 'medium',
        location: '1-paragraf',
        suggestion: 'To\'g\'ri modda va maqolaga havola qiling',
        legal_references: ['FK 342-modda']
      },
      {
        id: 'weak_3',
        weakness_type: 'emotional_appeal',
        description: 'Argumentda ko\'p hissiy murojaatlar bor',
        severity: 'low',
        location: '4-paragraf',
        suggestion: 'Rasmiy va obyektiv uslubda yozing',
        legal_references: []
      }
    ];
    
    return {
      id: 'weak_' + Date.now(),
      argument_text: request.argument_text,
      argument_type: request.argument_type,
      overall_score: 72,
      weakness_points: mockWeaknessPoints,
      strengths: [
        'Yaxshi tuzilma',
        'Aniq muammoni ko\'rsatish',
        'Qonun bilimini namoyon qilish'
      ],
      improvement_suggestions: [
        'Dalillarni kuchaytiring',
        'Qonun havolalarini tekshiring',
        'Rasmiy uslubda yozing'
      ],
      legal_compliance_score: 68,
      logical_coherence_score: 75,
      factual_accuracy_score: 80,
      persuasive_power_score: 70,
      processing_time: 2.8,
      created_at: new Date().toISOString()
    };
  });
  
  const improveArgument = useApi<any>(async (request: any) => {
    console.log('Improving argument...', request);
    // Mock argument improvement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      improved_argument: `Tuzatilgan argument: ${request.original_argument.substring(0, 100)}... [Tuzatilgan va kuchaytirilgan matn]`,
      improvements_made: ['Mantiq tuzatildi', 'Dalillar qo\'shildi', 'Rasmiy uslub'],
      new_score: 85
    };
  });
  
  const getDetections = useApi<{ analyses: WeaknessDetection[]; total: number }>(async () => {
    console.log('Loading weakness detections...');
    // Mock detections data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      analyses: [
        {
          id: 'weak_1',
          argument_text: 'Shartnoma buzilishi to\'g\'risidagi dastlabki argument',
          argument_type: 'legal',
          overall_score: 68,
          weakness_points: [
            {
              id: 'weak_1_1',
              weakness_type: 'insufficient_evidence',
              description: 'Dalillar yetarli emas',
              severity: 'high',
              location: '1-2 paragraf',
              suggestion: 'Qo\'shimcha hujjatlar keltiring',
              legal_references: ['GPK 167-modda']
            }
          ],
          strengths: ['Aniq muammo'],
          improvement_suggestions: ['Dalillarni kuchaytiring'],
          legal_compliance_score: 65,
          logical_coherence_score: 70,
          factual_accuracy_score: 75,
          persuasive_power_score: 62,
          processing_time: 2.1,
          created_at: '2024-01-15T10:30:00Z'
        }
      ],
      total: 1
    };
  });
  
  const getWeaknessTypes = useApi<{ weakness_types: any[] }>(async () => {
    console.log('Loading weakness types...');
    // Mock weakness types
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      weakness_types: [
        { id: '1', name: 'Mantiqiy xatolik', description: 'Argument mantiqiga oid xatolar' },
        { id: '2', name: 'Qonun xatosi', description: 'Qonun havolalaridagi xatolar' },
        { id: '3', name: 'Yetarli dalil', description: 'Dalillarning yetarli emasligi' },
        { id: '4', name: 'Tuzilma xatosi', description: 'Argument tuzilmasidagi muammolar' },
        { id: '5', name: 'Hissiy murojaat', description: 'O\'rniga bo\'lgan hissiy ifodalar' }
      ]
    };
  });

  useEffect(() => {
    if (user) {
      loadDetections();
      loadWeaknessTypes();
    }
  }, [user]);

  const loadDetections = async () => {
    try {
      const result = await getDetections.execute();
      if (result) {
        setDetections(result.analyses);
      }
    } catch (error) {
      console.error('Detections loading error:', error);
    }
  };

  const loadWeaknessTypes = async () => {
    try {
      const result = await getWeaknessTypes.execute();
      if (result) {
        setWeaknessTypes(result.weakness_types);
      }
    } catch (error) {
      console.error('Weakness types loading error:', error);
    }
  };

  const handleDetectWeaknesses = async () => {
    if (!argumentText.trim()) {
      alert('Iltimos, argument matnini kiriting');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const request: WeaknessDetectionRequest = {
        argument_text: argumentText,
        argument_type: argumentType,
        context: context || undefined,
        target_audience: targetAudience || undefined,
        analysis_depth: analysisDepth
      };

      const result = await detectWeaknesses.execute(request);
      if (result) {
        setCurrentDetection(result);
        setActiveTab('analysis');
        await loadDetections();
      }
    } catch (error) {
      console.error('Weakness detection error:', error);
      alert('Zaifliklarni aniqlash xatolik yuz berdi');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImproveArgument = async () => {
    if (!currentDetection) return;

    try {
      const weaknessPoints = currentDetection.weakness_points.map(wp => wp.weakness_type);
      
      const result = await improveArgument.execute({
        original_argument: currentDetection.argument_text,
        weakness_points: weaknessPoints,
        improvement_style: improvementStyle,
        target_length: null
      });

      if (result) {
        setImprovedArgument(result.improved_argument);
      }
    } catch (error) {
      console.error('Argument improvement error:', error);
      alert('Argument yaxshilash xatolik yuz berdi');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getArgumentTypeIcon = (type: string) => {
    switch (type) {
      case 'legal': return '⚖️';
      case 'factual': return '📊';
      case 'logical': return '🧠';
      case 'emotional': return '❤️';
      default: return '📝';
    }
  };

  const renderWeaknessPoint = (point: WeaknessPoint) => (
    <Card key={point.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-blue-900 text-lg">{point.description}</CardTitle>
          <Badge className={getSeverityColor(point.severity)}>
            {point.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-blue-700 mb-2">Joylashuv:</p>
            <p className="text-sm text-gray-600 italic">{point.location}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-blue-700 mb-2">Tavsiya:</p>
            <p className="text-sm text-gray-700">{point.suggestion}</p>
          </div>
          
          {point.legal_references && point.legal_references.length > 0 && (
            <div>
              <p className="text-sm font-medium text-blue-700 mb-2">Huquqiy havolalar:</p>
              <div className="space-y-1">
                {point.legal_references.map((ref: string, index: number) => (
                  <div key={index} className="text-sm text-blue-600">• {ref}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Weakness Detector</h1>
          <p className="text-blue-700">O'zbekiston qonunchiligiga moslashgan argumentlardagi zaifliklarni aniqlash</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm rounded-2xl p-1">
            <TabsTrigger value="detect" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Aniqlash
            </TabsTrigger>
            <TabsTrigger value="analysis" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Tahlil
            </TabsTrigger>
            <TabsTrigger value="improve" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Yaxshilash
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Tarix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detect" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Argument Tahlili</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Argument matni
                      </label>
                      <Textarea
                        placeholder="Argument matnini kiriting..."
                        value={argumentText}
                        onChange={(e) => setArgumentText(e.target.value)}
                        className="min-h-[200px] bg-white/50 rounded-xl border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Argument turi
                        </label>
                        <Select 
                          value={argumentType} 
                          onChange={(e) => setArgumentType(e.target.value)}
                          options={[
                            { value: "legal", label: "⚖️ Huquqiy" },
                            { value: "factual", label: "📊 Faktik" },
                            { value: "logical", label: "🧠 Mantiqiy" },
                            { value: "emotional", label: "❤️ His-tuyg'uli" }
                          ]}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Tahlil chuqurligi
                        </label>
                        <Select 
                          value={analysisDepth} 
                          onChange={(e) => setAnalysisDepth(e.target.value)}
                          options={[
                            { value: "basic", label: "Asosiy" },
                            { value: "standard", label: "Standart" },
                            { value: "comprehensive", label: "Chuqur" }
                          ]}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Kontekst (ixtiyoriy)
                      </label>
                      <Textarea
                        placeholder="Kontekst ma'lumotlari..."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="min-h-[80px] bg-white/50 rounded-xl border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Maqsad auditoriya (ixtiyoriy)
                      </label>
                      <input
                        type="text"
                        placeholder="Masalan: sud, advokat, mijoz"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full px-4 py-2 bg-white/50 rounded-xl border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <Button
                      onClick={handleDetectWeaknesses}
                      disabled={isAnalyzing || !argumentText.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold"
                    >
                      {isAnalyzing ? 'Tahlil qilinmoqda...' : 'Zaifliklarni Aniqlash'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Argument Turlari</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">⚖️ Huquqiy</h4>
                      <p className="text-sm text-blue-700">Qonun hujjatlariga asoslangan argumentlar</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-900 mb-2">📊 Faktik</h4>
                      <p className="text-sm text-green-700">Dalillar va faktlarga asoslangan argumentlar</p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h4 className="font-semibold text-purple-900 mb-2">🧠 Mantiqiy</h4>
                      <p className="text-sm text-purple-700">Mantiqiy izchillikka ega argumentlar</p>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-xl">
                      <h4 className="font-semibold text-red-900 mb-2">❤️ His-tuyg'uli</h4>
                      <p className="text-sm text-red-700">His-tuyg'uga asoslangan argumentlar</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            {currentDetection ? (
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-blue-900 text-2xl">Tahlil Natijalari</CardTitle>
                        <p className="text-gray-600 mt-2">
                          {getArgumentTypeIcon(currentDetection.argument_type)} {currentDetection.argument_type} argument
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(currentDetection.overall_score)}`}>
                          {(currentDetection.overall_score * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600">Umumiy ball</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardContent className="text-center p-6">
                      <div className={`text-2xl font-bold ${getScoreColor(currentDetection.legal_compliance_score)}`}>
                        {(currentDetection.legal_compliance_score * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Qonunchilik mosligi</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardContent className="text-center p-6">
                      <div className={`text-2xl font-bold ${getScoreColor(currentDetection.logical_coherence_score)}`}>
                        {(currentDetection.logical_coherence_score * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Mantiqiy izchillik</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardContent className="text-center p-6">
                      <div className={`text-2xl font-bold ${getScoreColor(currentDetection.factual_accuracy_score)}`}>
                        {(currentDetection.factual_accuracy_score * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Faktik aniqlik</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardContent className="text-center p-6">
                      <div className={`text-2xl font-bold ${getScoreColor(currentDetection.persuasive_power_score)}`}>
                        {(currentDetection.persuasive_power_score * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Tasir kuchi</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">
                      Zaifliklar ({currentDetection.weakness_points.length})
                    </h3>
                    <div className="space-y-4">
                      {currentDetection.weakness_points.map(renderWeaknessPoint)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Kuchli tomonlar</h3>
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                      <CardContent className="space-y-3 p-6">
                        {currentDetection.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-green-700">{strength}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Yaxshilash takliflari</h3>
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardContent className="space-y-3 p-6">
                      {currentDetection.improvement_suggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-800">{suggestion}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">Hali hech qanday tahlil o'tkazilmagan</p>
                  <Button 
                    onClick={() => setActiveTab('detect')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Birinchi Tahlilni Boshlash
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="improve" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-blue-900">Argument Yaxshilash</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Yaxshilash uslubi
                    </label>
                    <Select 
                      value={improvementStyle} 
                      onChange={(e) => setImprovementStyle(e.target.value)}
                      options={[
                        { value: "formal", label: "Rasmiy" },
                        { value: "conversational", label: "Suhbat uslubida" },
                        { value: "persuasive", label: "Tasirli" }
                      ]}
                    />
                  </div>
                  
                  <Button
                    onClick={handleImproveArgument}
                    disabled={!currentDetection}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold"
                  >
                    Argumentni Yaxshilash
                  </Button>
                </CardContent>
              </Card>

              {currentDetection && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Asl Argument</h3>
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                      <CardContent className="p-6">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {currentDetection.argument_text}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Yaxshilangan Argument</h3>
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                      <CardContent className="p-6">
                        {improvedArgument ? (
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {improvedArgument}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">
                            Yaxshilash tugmasini bosing
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {detections.map((detection) => (
                <Card 
                  key={detection.id} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                  onClick={() => {
                    setCurrentDetection(detection);
                    setActiveTab('analysis');
                  }}
                >
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle className="text-blue-900 text-lg">
                        {getArgumentTypeIcon(detection.argument_type)} {detection.argument_type}
                      </CardTitle>
                      <Badge className={getSeverityColor(detection.overall_score < 0.6 ? 'high' : detection.overall_score < 0.8 ? 'medium' : 'low')}>
                        {(detection.overall_score * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {detection.argument_text}
                      </p>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Zaifliklar:</span>
                        <span className="font-medium">{detection.weakness_points.length}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kuchli tomonlar:</span>
                        <span className="font-medium">{detection.strengths.length}</span>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          {new Date(detection.created_at).toLocaleDateString('uz-UZ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {detections.length === 0 && (
                <div className="col-span-full">
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-xl">
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500 mb-4">Hali hech qanday tahlillar mavjud emas</p>
                      <Button 
                        onClick={() => setActiveTab('detect')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Birinchi Tahlilni Boshlash
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
