import React, { useState, useRef, useEffect } from 'react';

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

const COMPANY_CONTEXT = `
You are the SWS AI company assistant. Answer questions strictly based on these company policies:

1. LEAVE POLICY: Employees get 18 days annual leave, 10 days sick leave, 6 days casual leave per year.
2. RESIGNATION POLICY: Notice period is 30 days for junior staff, 60 days for senior staff.
3. WFH POLICY: Employees can work from home up to 2 days per week with manager approval.
4. BENEFITS: Health insurance covers employee and family. Includes dental and vision.
5. PERFORMANCE REVIEW: Conducted twice a year - April and October.
6. IT POLICY: Passwords must be 12+ characters, changed every 90 days. No personal devices on company network.
7. CODE OF CONDUCT: Professional behavior expected at all times. Zero tolerance for harassment.
8. ONBOARDING: New employees have 30 day onboarding period with buddy system.
9. COMMUNICATION TOOLS: SWS AI uses Slack for internal communication, Zoom for meetings, Jira for project tracking.
10. COMPENSATION: Salary reviews annually. Performance bonus up to 20% of annual salary.

Only answer questions related to these company policies. If asked anything outside this scope, politely redirect.
`;

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the SWS AI company assistant. Ask me anything about our HR policies, leave, benefits, resignation process, WFH guidelines, or any other company policy."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input;
    if (!userMessage.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: COMPANY_CONTEXT,
          messages: [
            ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      const reply = data.content[0].text;

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '10px',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: '32px', height: '32px',
                background: 'var(--blue-primary)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '14px'
              }}>🤖</div>
            )}
            <div style={{
              maxWidth: '70%',
              background: msg.role === 'user' ? 'var(--blue-primary)' : 'white',
              color: msg.role === 'user' ? 'white' : '#1a1a2e',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
              fontSize: '14px',
              lineHeight: '1.6',
              border: msg.role === 'assistant' ? '1px solid var(--gray-200)' : 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'var(--blue-primary)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px'
            }}>🤖</div>
            <div style={{
              background: 'white',
              border: '1px solid var(--gray-200)',
              borderRadius: '12px 12px 12px 0',
              padding: '12px 16px',
              fontSize: '14px',
              color: 'var(--gray-400)'
            }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '8px' }}>Try asking:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                style={{
                  background: 'white',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'Livvic',
                  color: 'var(--gray-600)',
                  transition: 'all 0.2s'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

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
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
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
        <button
          onClick={() => sendMessage()}
          disabled={isLoading}
          style={{
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
          }}
        >
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