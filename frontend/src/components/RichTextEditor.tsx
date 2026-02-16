import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { api } from '@/api';
import { marked } from 'marked';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  ImageIcon,
  Link as LinkIcon,
  Code,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    // content is set via useEffect to handle async parsing if needed or just simple prop sync
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-zinc dark:prose-invert max-w-none focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-4 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_img]:max-h-[300px] [&_img]:w-auto [&_img]:rounded-lg [&_img]:border [&_img]:shadow-sm',
      },
    },
  });

  // Hydrate content when it changes (external) or on mount
  useEffect(() => {
    if (editor && content) {
      // Check if current editor content is different to avoid cursor jumping / loop
      // But more importantly, if it's Markdown, we need to convert.
      // Simple heuristic: If it doesn't look like HTML (no tags), treat as markdown?
      // Or just ALWAYS parse with marked? marked handles HTML fine too (mostly).
      // Problem: marked wraps text in <p>, which Tiptap likes.
      // If content is already HTML from Tiptap, it's fine.
      // If content is Markdown from DB, marked converts to HTML.

      const currentHTML = editor.getHTML();
      if (content === currentHTML) return;

      // If the passed content is significantly different (e.g. loaded from DB)
      // We assume it might be markdown if it doesn't start with <
      // This is a rough check.
      const isHtml = content.trim().startsWith('<');
      const parsed = isHtml ? content : marked.parse(content);

      // Only set if different
      if (editor.getHTML() !== parsed) {
        editor.commands.setContent(parsed as string, { emitUpdate: false });
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await api.uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editable) {
    return <EditorContent editor={editor} />;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 border rounded-md p-1 bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(editor.isActive('bold') && 'bg-muted')}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(editor.isActive('italic') && 'bg-muted')}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(editor.isActive('heading', { level: 1 }) && 'bg-muted')}
          type="button"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(editor.isActive('heading', { level: 2 }) && 'bg-muted')}
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive('bulletList') && 'bg-muted')}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive('orderedList') && 'bg-muted')}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(editor.isActive('blockquote') && 'bg-muted')}
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(editor.isActive('code') && 'bg-muted')}
          type="button"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={cn(editor.isActive('link') && 'bg-muted')}
          type="button"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
        />
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
