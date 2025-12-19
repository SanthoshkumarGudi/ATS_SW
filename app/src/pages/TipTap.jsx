// frontend/src/components/TipTap.jsx   (or wherever you saved it)

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Box } from "@mui/material";
import { useEffect } from "react";

const Tiptap = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write job description here...",
      }),
    ],
    content: value, // initial content
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  // THIS IS THE KEY FIX: Sync external value changes into the editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
        minHeight: 250,
        "& .ProseMirror": {
          minHeight: 200,
          padding: 2,
        },
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

export default Tiptap;
