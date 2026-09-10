'use client';

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlertCircle,
  Info,
  Lightbulb,
  FileText,
  Link2,
  Image as ImageIcon,
  Minus,
  Eye,
  Edit3,
  Highlighter,
  Palette,
} from 'lucide-react';

interface EasyMarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  name?: string;
  placeholder?: string;
}

export default function EasyMarkdownEditor({
  value,
  onChange,
  name = 'content',
  placeholder = 'यहाँ समाचारको विस्तृत विवरण लेख्नुहोस्...',
}: EasyMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Insert helper string into textarea at current cursor location
  function insertMarkup(prefix: string, suffix: string = '', defaultText: string = '') {
    const textarea = document.getElementById(`easy-md-editor-${name}`) as HTMLTextAreaElement;
    const currentVal = value || '';

    if (!textarea) {
      onChange(currentVal + prefix + defaultText + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = currentVal.substring(start, end) || defaultText;
    const replacement = prefix + selected + suffix;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 40);
  }

  // Convert Markdown & HTML Callouts to Live HTML Preview
  function renderMarkdownToHtml(md: string) {
    if (!md) return '<p class="text-muted">केही समाचार विवरण लेखिएको छैन...</p>';

    let html = md
      // Handle custom 1-click alert boxes first (pure box designs without forced title headers)
      .replace(
        /:::warning\n?([\s\S]*?)\n?:::/gi,
        '<div class="news-callout news-callout-warning">$1</div>'
      )
      .replace(
        /:::info\n?([\s\S]*?)\n?:::/gi,
        '<div class="news-callout news-callout-info">$1</div>'
      )
      .replace(
        /:::highlight\n?([\s\S]*?)\n?:::/gi,
        '<div class="news-callout news-callout-highlight">$1</div>'
      )
      .replace(
        /:::editorial\n?([\s\S]*?)\n?:::/gi,
        '<div class="news-callout news-callout-editorial">$1</div>'
      )
      // Custom colored headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Custom blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Formatting
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\~\~(.*?)\~\~/gim, '<del>$1</del>')
      // Images & Links
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" style="max-width:100%; border-radius:8px; margin:14px 0;" />')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--brand-orange); font-weight:700;">$1</a>')
      // Horizontal Rule
      .replace(/^---$/gim, '<hr style="border:none; border-top:1px solid var(--border-color); margin:20px 0;"/>')
      // Newlines to paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    return `<p>${html}</p>`;
  }

  return (
    <div
      style={{
        border: '1.5px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Editor Header Bar with Tab Switches */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-orange)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Edit3 size={16} /> सरल समाचार सम्पादक
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`shadcn-btn ${activeTab === 'write' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Edit3 size={14} /> लेख्नुहोस्
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`shadcn-btn ${activeTab === 'preview' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Eye size={14} /> पूर्वावलोकन
          </button>
        </div>
      </div>

      {activeTab === 'write' && (
        <>
          {/* TOOLBAR GROUP 1: 1-Click Alert Box Insert Buttons */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 85, 0, 0.05)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              ⚡ १-क्लिक तयार बाकसहरू:
            </span>

            <button
              type="button"
              onClick={() =>
                insertMarkup(
                  ':::warning\n',
                  '\n:::',
                  'यहाँ भासिएको सडक तथा मुख्य अलर्ट समाचार विवरण लेख्नुहोस्...'
                )
              }
              className="shadcn-btn shadcn-btn-outline"
              style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: '#FFF5EE', color: '#C2410C', borderColor: '#FFD7C2' }}
            >
              <AlertCircle size={14} /> ⚠️ मुख्य अलर्ट बाकस
            </button>

            <button
              type="button"
              onClick={() =>
                insertMarkup(
                  ':::info\n',
                  '\n:::',
                  'यहाँ महत्त्वपूर्ण सूचना वा थप पृष्ठभूमि विवरण लेख्नुहोस्...'
                )
              }
              className="shadcn-btn shadcn-btn-outline"
              style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: '#F0F9FF', color: '#0369A1', borderColor: '#BAE6FD' }}
            >
              <Info size={14} /> ℹ️ जानकारी बाकस
            </button>

            <button
              type="button"
              onClick={() =>
                insertMarkup(
                  ':::highlight\n',
                  '\n:::',
                  '१. पहिलो मुख्य बिन्दु\n२. दोस्रो मुख्य बिन्दु'
                )
              }
              className="shadcn-btn shadcn-btn-outline"
              style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}
            >
              <Lightbulb size={14} /> 💡 मुख्य बिन्दुहरू
            </button>

            <button
              type="button"
              onClick={() =>
                insertMarkup(
                  ':::editorial\n',
                  '\n:::',
                  '"सनस्टार न्युज सम्पादकीय टोलीको विशेष विश्लेषण..."'
                )
              }
              className="shadcn-btn shadcn-btn-outline"
              style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: '#F8FAFC', color: '#334155', borderColor: '#E2E8F0' }}
            >
              <FileText size={14} /> 📝 सम्पादकीय टिप्पणी
            </button>
          </div>

          {/* TOOLBAR GROUP 2: Formatting, Colors, Headers & Media */}
          <div
            style={{
              padding: '8px 14px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            {/* Headers */}
            <button
              type="button"
              onClick={() => insertMarkup('# ', '', 'मुख्य शीर्षक १')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="शीर्षक १"
            >
              <Heading1 size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('## ', '', 'उप-शीर्षक २')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="शीर्षक २"
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('### ', '', 'खण्ड शीर्षक ३')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="शीर्षक ३"
            >
              <Heading3 size={16} />
            </button>

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Bold, Italic, Underline */}
            <button
              type="button"
              onClick={() => insertMarkup('**', '**', 'गाढा पाठ')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="गाढा"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('*', '*', 'छड्के पाठ')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="छड्के"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('<u>', '</u>', 'अन्डरलाइन पाठ')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="अन्डरलाइन"
            >
              <UnderlineIcon size={16} />
            </button>

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Header / Text Colors */}
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Palette size={14} /> शीर्षक रंग:
            </span>
            <button
              type="button"
              onClick={() => insertMarkup('<span style="color:#E11D48; font-weight:800;">', '</span>', 'रातो रंगको पाठ')}
              style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E11D48', border: 'none', cursor: 'pointer' }}
              title="रातो पाठ"
            />
            <button
              type="button"
              onClick={() => insertMarkup('<span style="color:#0284C7; font-weight:800;">', '</span>', 'नीलो रंगको पाठ')}
              style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#0284C7', border: 'none', cursor: 'pointer' }}
              title="नीलो पाठ"
            />
            <button
              type="button"
              onClick={() => insertMarkup('<span style="color:#059669; font-weight:800;">', '</span>', 'हरियो रंगको पाठ')}
              style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#059669', border: 'none', cursor: 'pointer' }}
              title="हरियो पाठ"
            />
            <button
              type="button"
              onClick={() => insertMarkup('<span style="color:#D97706; font-weight:800;">', '</span>', 'सुनौलो रंगको पाठ')}
              style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#D97706', border: 'none', cursor: 'pointer' }}
              title="सुनौलो पाठ"
            />

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Background Highlight */}
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Highlighter size={14} /> हाइलाइट:
            </span>
            <button
              type="button"
              onClick={() => insertMarkup('<mark style="background-color:#FEF08A; padding:2px 6px; borderRadius:4px;">', '</mark>', 'पहेंलो हाइलाइट पाठ')}
              style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#FEF08A', border: '1px solid #FDE047', cursor: 'pointer' }}
              title="पहेंलो हाइलाइट"
            />

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Blockquote, Lists, Links */}
            <button
              type="button"
              onClick={() => insertMarkup('> "', '" — स्रोत', 'भनाइ / भनाई उद्धरण')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="उद्धरण"
            >
              <Quote size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('- ', '', 'सूची १')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="सूची"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('1. ', '', 'नम्बर सूची १')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="नम्बर सूची"
            >
              <ListOrdered size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('\n---\n')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="विभाजक रेखा"
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('[', '](https://example.com)', 'लिङ्क शीर्षक')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="लिङ्क राख्नुहोस्"
            >
              <Link2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertMarkup('![', '](https://images.unsplash.com/photo-...)', 'फोटो क्याप्सन')}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="तस्बिर राख्नुहोस्"
            >
              <ImageIcon size={16} />
            </button>
          </div>

          {/* Simple Clean Textarea */}
          <textarea
            id={`easy-md-editor-${name}`}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={12}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '1rem',
              lineHeight: 1.7,
              border: 'none',
              outline: 'none',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </>
      )}

      {/* Live Preview Mode */}
      {activeTab === 'preview' && (
        <div style={{ padding: '24px', minHeight: '300px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-orange)', marginBottom: '16px' }}>
            👁️ पाठक वाचन दृष्टिकोण प्रत्यक्ष पूर्वावलोकन:
          </div>
          <div
            className="single-article-content"
            style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(value) }}
          />
        </div>
      )}
    </div>
  );
}

