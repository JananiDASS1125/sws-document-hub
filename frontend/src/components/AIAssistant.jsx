import React from 'react';

const SUGGESTED_QUESTIONS = [
  'What is the annual leave policy?',
  'How many sick leave days do I get?',
  'What is the notice period for resignation?',
  'What are the WFH guidelines?',
  'What health insurance benefits do we have?',
  'How does the performance review work?',
  'What tools does SWS AI use for communication?',
  'What is the IT password policy?'
];

function AIAssistant() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
      {/* Banner */}
      <div style={{
        background: '#f5f3ff',
        border: '1px solid #e9d5ff',
        borderRadius: '10px',
        padding: '10px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🤖</span>
        <span style={{ fontSize: '13px', color: '#7c3aed', fontWeight: '500' }}>
          Powered by Claude AI + 10 SWS AI company documents. Ask anything about company policies.
        </span>
      </div>

      {/* Bot Message */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'var(--blue-primary)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0, fontSize: '14px'
        }}>🤖</div>
        <div style={{
          background: 'white',
          border: '1px solid var(--gray-200)',
          borderRadius: '12px 12px 12px 0',
          padding: '12px 16px',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#1a1a2e',
          maxWidth: '70%'
        }}>
          Hi! I'm the SWS AI company assistant. Ask me anything about our HR policies, leave, benefits, resignation process, WFH guidelines, or any other company policy.
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Suggested Questions */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '8px' }}>Try asking:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              style={{
                background: 'white',
                border: '1px solid var(--gray-200)',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'Livvic',
                color: 'var(--gray-600)'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: '10px',
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: '12px',
        padding: '8px 8px 8px 16px',
        alignItems: 'center'
      }}>
        <input
          placeholder="Ask about policies, leave, benefits..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            fontFamily: 'Livvic',
            color: '#1a1a2e'
          }}
        />
        <button style={{
          background: 'var(--blue-primary)',
          border: 'none',
          borderRadius: '8px',
          width: '36px',
          height: '36px',
          cursor: 'pointer',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          ➤
        </button>
      </div>
      <p style={{ fontSize: '11px', color: 'var(--gray-400)', textAlign: 'center', marginTop: '8px' }}>
        Answers sourced from SWS AI company documents only · Press Enter to send
      </p>
    </div>
  );
}

export default AIAssistant;