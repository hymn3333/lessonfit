import React, { useState, useRef } from 'react';
import { FaPrint } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const FORM_WIDTH = 700;
const INPUT_STYLE = {
  width: '100%',
  padding: '6px',
  boxSizing: 'border-box',
};
const TITLE_STYLE = {
  fontSize: '17px',
  fontWeight: 'bold',
  marginBottom: '6px',
};

const TRAITS = [
  '기초 문해 능력이 부족함', '기초 연산 능력이 부족함', '글자 해독 능력이 낮음',
  '글쓰기 계획 수립이 어려움', '언어 이해 능력이 낮음', '언어 표현에 어려움 있음',
  '주의 집중에 어려움 있음', '산만한 행동이 자주 나타남', '반복적인 행동을 자주 보임',
  '공격적이거나 충동적인 반응이 있음', '학습 속도가 느린 편임', '집중 지속 시간이 짧음',
  '사회적 상호작용에 어려움 있음', '또래 관계 형성에 어려움 있음', '자기조절 능력이 부족함',
  '시각 단서 활용이 필요함', '구두 지시 따르기 어려움', '규칙과 절차를 따르기 어려움',
];

export default function App() {
  const [name, setName] = useState('');
  const [disability, setDisability] = useState('지적장애');
  const [traits, setTraits] = useState([]);
  const [behaviors, setBehaviors] = useState('');
  const [grade, setGrade] = useState('1학년');
  const [subjects, setSubjects] = useState([]);
  const [topic, setTopic] = useState('');
  const [model, setModel] = useState('직접 교수 모형');
  const [contrast, setContrast] = useState(false);

  const printRef = useRef();
  const handleDownload = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${name || '학생'}_수업지도안`,
    pageStyle: `@page { size: A4 portrait; margin: 24mm; } @media print { body { font-family: '함초롱바탕', serif; font-size: 11pt; line-height: 1.6; } }`,
  });

  const toggleTrait = t => {
    setTraits(prev => prev.includes(t) ? prev.filter(x => x !== t) : prev.length < 3 ? [...prev, t] : (alert('장애 특성은 최대 3개까지 선택할 수 있습니다.'), prev));
  };

  const toggleSubject = s => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: contrast ? '#000' : '#f8f9fa',
        color: contrast ? '#fff' : '#000'
      }}>
        <AdsColumn side="left" contrast={contrast} setContrast={setContrast} />
        <main style={{
          width: FORM_WIDTH,
          maxWidth: '100%',
          padding: 24,
          backgroundColor: contrast ? '#111' : '#fff',
          border: '1px solid #ddd',
          borderRadius: 8,
          boxShadow: '0 0 6px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold', marginBottom: 26 }}>📘 레핏 수업안</h1>

          <Section title="🧒 학생 이름" tooltip="학생 이름을 입력해 주세요">
            <input aria-label="학생 이름 입력" value={name} onChange={e => setName(e.target.value)} placeholder="이름 입력" style={INPUT_STYLE} />
          </Section>

          <Section title="🩺 장애유형" tooltip="장애유형을 선택해 주세요">
            <select aria-label="장애유형 선택" value={disability} onChange={e => setDisability(e.target.value)} style={INPUT_STYLE}>
              {['지적장애','자폐스펙트럼장애','정서장애','학습부진','발달지체'].map(t => <option key={t}>{t}</option>)}
            </select>
          </Section>

          <Section title="🛠️ 장애 특성" tooltip="지원이 필요한 특성을 선택해 주세요">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 14, rowGap: 6 }}>
              {TRAITS.map(tr => (
                <label key={tr} style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                  <input type="checkbox" aria-label={tr} checked={traits.includes(tr)} onChange={() => toggleTrait(tr)} /> {tr}
                </label>
              ))}
            </div>
          </Section>

          <Section title="🔍 이런 행동이 보여요 (예: 소리를 자주 지름)" tooltip="자유롭게 3가지 정도 적어주세요">
            <textarea aria-label="행동 메모 입력" value={behaviors} onChange={e => setBehaviors(e.target.value)} placeholder="예: 자리에 앉아 있지 않음, 소리를 지름, 컴퓨터에 과도한 집착" style={{ ...INPUT_STYLE, height: '60px' }} />
          </Section>

          <Section title="🏫 학년" tooltip="학년을 선택해 주세요">
            <select aria-label="학년 선택" value={grade} onChange={e => setGrade(e.target.value)} style={INPUT_STYLE}>
              {[1,2,3,4].map(g => <option key={g}>{g}학년</option>)}
            </select>
          </Section>

          <Section title="📚 교과" tooltip="교과를 선택해 주세요">
            {['국어','수학'].map(sbj => (
              <label key={sbj} style={{ display: 'block', fontSize: 14 }}>
                <input type="checkbox" aria-label={sbj} checked={subjects.includes(sbj)} onChange={() => toggleSubject(sbj)} /> {sbj}
              </label>
            ))}
          </Section>

          <Section title="📝 수업 주제" tooltip="예: 바른 자세로 글자 읽고 쓰기">
            <input aria-label="수업 주제 입력" value={topic} onChange={e => setTopic(e.target.value)} placeholder="예: 바른 자세로 글자 읽고 쓰기" style={INPUT_STYLE} />
          </Section>

          <Section title="🧠 수업모형" tooltip="수업모형을 선택해 주세요">
            <select aria-label="수업 모형 선택" value={model} onChange={e => setModel(e.target.value)} style={INPUT_STYLE}>
              {[ '직접 교수 모형','문제 해결 학습 모형','지식 탐구 학습 모형','창의성 계발 학습 모형','역할 수행 학습 모형','반응 중심 학습 모형' ].map(m => <option key={m}>{m}</option>)}
            </select>
          </Section>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button aria-label="출력 버튼" onClick={handleDownload} title="수업지도안이 출력됩니다" style={{ padding: '8px 26px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: 15, cursor: 'pointer' }}>
              <FaPrint style={{ marginRight: 6 }} /> 출력
            </button>
          </div>
        </main>
        <AdsColumn side="right" contrast={contrast} setContrast={setContrast} />
      </div>
    </div>
  );
}

function Section({ title, tooltip, children }) {
  return (
    <section style={{ marginBottom: 16 }}>
      <h2 style={TITLE_STYLE} title={tooltip}>{title}</h2>
      {children}
    </section>
  );
}

function AdsColumn({ side, contrast, setContrast }) {
  const isLeft = side === 'left';
  return (
    <div style={{ width: 150, marginTop: 70, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {isLeft && (
        <button onClick={() => setContrast(!contrast)} style={{ fontSize: 13 }}>
          🌓 고대비 {contrast ? '끄기' : '켜기'}
        </button>
      )}
      {!isLeft && (
        <button disabled style={{ fontSize: 13, opacity: 0.6 }}>
          🗣️ 음성안내 꺼짐
        </button>
      )}
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ backgroundColor: '#fffaf0', padding: 10, borderRadius: 6, height: 70, fontSize: 11, boxShadow: '0 0 4px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <strong style={{ fontSize: 13, color: '#c00' }}>📢 광고 {i}</strong>
          <p style={{ margin: 0 }}>슬라이드 배너 예정</p>
        </div>
      ))}
    </div>
  );
}
