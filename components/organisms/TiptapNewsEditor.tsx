'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Highlighter,
  Palette,
  AlertCircle,
  Info,
  Lightbulb,
  FileText,
  Link2,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Minus,
  Eye,
  Edit3,
} from 'lucide-react';

interface TiptapNewsEditorProps {
  content: string;
  onChange: (htmlContent: string) => void;
}

export default function TiptapNewsEditor({ content, onChange }: TiptapNewsEditorProps) {
  const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: content || '<p>यहाँ समाचारको विस्तृत विवरण लेख्नुहोस्...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Tiptap रिच न्युज सम्पादक लोड हुँदैछ...
      </div>
    );
  }

  // 1-Click Callout Alert Box Templates (pure box designs without forced title headers)
  const insertInfoBox = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="news-callout news-callout-info" style="padding:16px; margin:16px 0; background-color:#F0F9FF; border-left:4px solid #0284C7; border-radius:6px; color:#0369A1;">
          यहाँ महत्त्वपूर्ण सूचना वा थप विवरण लेख्नुहोस्...
        </div><p></p>`
      )
      .run();
  };

  const insertWarningAlertBox = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="news-callout news-callout-warning" style="padding:16px; margin:16px 0; background-color:#FFF1F2; border-left:4px solid #E11D48; border-radius:6px; color:#9F1239;">
          यहाँ आपत्कालीन वा मुख्य समाचार अलर्ट लेख्नुहोस्...
        </div><p></p>`
      )
      .run();
  };

  const insertHighlightKeyPointsBox = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="news-callout news-callout-highlight" style="padding:16px; margin:16px 0; background-color:#FEF3C7; border-left:4px solid #D97706; border-radius:6px; color:#92400E;">
          <ul>
            <li>पहिलो मुख्य बिन्दु...</li>
            <li>दोस्रो मुख्य बिन्दु...</li>
          </ul>
        </div><p></p>`
      )
      .run();
  };

  const insertEditorialNoteBox = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="news-callout news-callout-editorial" style="padding:16px; margin:16px 0; background-color:#F8FAFC; border-left:4px solid #475569; border-radius:6px; color:#334155; font-style:italic;">
          "सनस्टार न्युज सम्पादकीय टोलीको तर्फबाट विशेष विश्लेषण..."
        </div><p></p>`
      )
      .run();
  };

  // Add Link
  const addLink = () => {
    const url = window.prompt('वेबसाइट लिङ्क URL प्रविष्ट गर्नुहोस्:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // Add Image
  const addImage = () => {
    const url = window.prompt('तस्बिर फोटो लिंक URL (Image URL) हाल्नुहोस्:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

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
      {/* Editor Main Header Bar with Write / Preview Tabs */}
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
          <Edit3 size={16} /> Tiptap न्युज WYSIWYG सम्पादक
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`shadcn-btn ${activeTab === 'write' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Edit3 size={14} /> लेख्नुहोस् (Write)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`shadcn-btn ${activeTab === 'preview' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Eye size={14} /> पूर्वावलोकन (Preview)
          </button>
        </div>
      </div>

      {activeTab === 'write' && (
        <>
          {/* TOOLBAR GROUP 1: Ready 1-Click Alert & Highlight Box Buttons */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(225, 29, 72, 0.04)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              ⚡ 1-Click तयार अलर्ट बाकस (Alert Boxes):
            </span>

            <button
              type="button"
              onClick={insertInfoBox}
              className="shadcn-btn shadcn-btn-outline"
              style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: '#F0F9FF', color: '#0369A1', borderColor: '#BAE6FD' }}
            >
              <Info size={14} /> ℹ️ जानकारी (Info)
            </button>

            <button
              type="button"
              onClick={insertWarningAlertBox}
              className="shadcn-btn shadcn-btn-outline"
              style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: '#FFF1F2', color: '#9F1239', borderColor: '#FECDD3' }}
            >
              <AlertCircle size={14} /> ⚠️ मुख्य अलर्ट (Warning)
            </button>

            <button
              type="button"
              onClick={insertHighlightKeyPointsBox}
              className="shadcn-btn shadcn-btn-outline"
              style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}
            >
              <Lightbulb size={14} /> 💡 मुख्य बिन्दु (Highlights)
            </button>

            <button
              type="button"
              onClick={insertEditorialNoteBox}
              className="shadcn-btn shadcn-btn-outline"
              style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: '#F8FAFC', color: '#334155', borderColor: '#E2E8F0' }}
            >
              <FileText size={14} /> 📝 सम्पादकीय (Editorial)
            </button>
          </div>

          {/* TOOLBAR GROUP 2: Header Styles, Color Accents & Background Highlighting */}
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
            {/* Header Styles */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`shadcn-btn ${editor.isActive('heading', { level: 1 }) ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Heading 1"
            >
              <Heading1 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`shadcn-btn ${editor.isActive('heading', { level: 2 }) ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Heading 2"
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`shadcn-btn ${editor.isActive('heading', { level: 3 }) ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Heading 3"
            >
              <Heading3 size={16} />
            </button>

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Basic Text Styles */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`shadcn-btn ${editor.isActive('bold') ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Bold"
            >
              <Bold size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`shadcn-btn ${editor.isActive('italic') ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Italic"
            >
              <Italic size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`shadcn-btn ${editor.isActive('underline') ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Underline"
            >
              <UnderlineIcon size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`shadcn-btn ${editor.isActive('strike') ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </button>

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Header / Text Color Palette */}
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Palette size={14} /> रंग (Color):
            </span>
            <button
              type="button"
              onClick={() => editor.chain().focus().setColor('#E11D48').run()}
              style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E11D48', border: 'none', cursor: 'pointer' }}
              title="Red Accent"
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().setColor('#0284C7').run()}
              style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#0284C7', border: 'none', cursor: 'pointer' }}
              title="Blue Accent"
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().setColor('#059669').run()}
              style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#059669', border: 'none', cursor: 'pointer' }}
              title="Green Accent"
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().setColor('#D97706').run()}
              style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#D97706', border: 'none', cursor: 'pointer' }}
              title="Gold Accent"
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '2px 6px', fontSize: '0.7rem' }}
            >
              Reset
            </button>

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Background Highlight Colors */}
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Highlighter size={14} /> हाईलाइट:
            </span>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#FEF08A' }).run()}
              style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#FEF08A', border: '1px solid #FDE047', cursor: 'pointer' }}
              title="Yellow Highlight"
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#A7F3D0' }).run()}
              style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#A7F3D0', border: '1px solid #6EE7B7', cursor: 'pointer' }}
              title="Green Highlight"
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#BAE6FD' }).run()}
              style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: '#BAE6FD', border: '1px solid #7DD3FC', cursor: 'pointer' }}
              title="Blue Highlight"
            />

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Lists & Quotes */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`shadcn-btn ${editor.isActive('bulletList') ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Bullet List"
            >
              <List size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`shadcn-btn ${editor.isActive('orderedList') ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Ordered List"
            >
              <ListOrdered size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`shadcn-btn ${editor.isActive('blockquote') ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Quote"
            >
              <Quote size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="Divider"
            >
              <Minus size={16} />
            </button>

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Links & Images */}
            <button
              type="button"
              onClick={addLink}
              className={`shadcn-btn ${editor.isActive('link') ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
              style={{ padding: '4px 8px' }}
              title="Insert Link"
            >
              <Link2 size={16} />
            </button>

            <button
              type="button"
              onClick={addImage}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="Insert Image URL"
            >
              <ImageIcon size={16} />
            </button>

            <span style={{ borderRight: '1px solid var(--border-color)', height: '20px', margin: '0 4px' }} />

            {/* Undo / Redo */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="Undo"
            >
              <RotateCcw size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '4px 8px' }}
              title="Redo"
            >
              <RotateCw size={16} />
            </button>
          </div>

          {/* Tiptap WYSIWYG Editable Content Area */}
          <div style={{ padding: '16px', minHeight: '260px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
            <EditorContent editor={editor} className="tiptap-editor-content" />
          </div>
        </>
      )}

      {/* Live Reader Preview Tab */}
      {activeTab === 'preview' && (
        <div style={{ padding: '24px', minHeight: '300px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-orange)', marginBottom: '16px' }}>
            👁️ पाठक वाचन दृष्टिकोण पूर्वावलोकन (Live Story View Preview):
          </div>
          <div
            className="single-article-content"
            style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        </div>
      )}
    </div>
  );
}
