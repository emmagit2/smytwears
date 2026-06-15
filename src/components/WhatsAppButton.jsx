import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const WHATSAPP_NUMBER = '2347054527285';

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = () => {
const text = message.trim() || `Hello! I found you on your website and I'd like to know more.`;    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setOpen(false);
    setMessage('');
  };

  return (
    <>
      {/* Chat bubble popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#075e54' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm">S</div>
              <div>
                <p className="text-white font-semibold text-sm">SMYT Support</p>
                <p className="text-white/70 text-[11px]">Typically replies instantly</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat area */}
          <div className="px-4 py-4" style={{ backgroundColor: '#e5ddd5' }}>
            {/* Received message bubble */}
            <div className="flex mb-3">
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 max-w-[85%] shadow-sm">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Hey! 👋 Welcome to SMYT. How can we help you today? Ask us anything about our collections, orders, or sizing.
                </p>
                <p className="text-[10px] text-gray-400 text-right mt-1">SMYT · now</p>
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="flex items-center gap-2 px-3 py-3 bg-white border-t border-gray-100">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 text-sm px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400 bg-gray-50"
              autoFocus
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* WhatsApp branding */}
          <div className="px-4 py-2 bg-white text-center border-t border-gray-50">
            <p className="text-[10px] text-gray-400">Powered by <span className="font-semibold text-gray-500">WhatsApp</span></p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 rounded-full"
        style={{ backgroundColor: '#25D366' }}
        aria-label="Chat on WhatsApp"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>
    </>
  );
}