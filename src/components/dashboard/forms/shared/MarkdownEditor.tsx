"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import CodeMirror, {
  EditorView,
  type ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { Columns2, Eye, ImagePlus, Pencil, Upload } from "lucide-react";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";

import { MarkdownContent } from "@/components/app";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useTheme } from "@/context";
import { cn } from "@/lib/utils";

import { MediaPickerDialog } from "../../media/MediaPickerDialog";

export type MarkdownEditorMode = "write" | "preview" | "split";

interface MarkdownEditorProps
  extends Pick<
    React.HTMLAttributes<HTMLDivElement>,
    "id" | "aria-describedby" | "aria-invalid"
  > {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  height?: string;
  // Set when the parent can widen itself for side-by-side mode (e.g. a
  // dialog). Without it, side-by-side opens in a modal if there's no room.
  onModeChange?: (mode: MarkdownEditorMode) => void;
}

type UploadedImage = { name: string; url: string };

type UploadResponse =
  | { data: UploadedImage; error: null }
  | { data: null; error: string };

// Narrowest editor that still fits side-by-side panes.
const SPLIT_MIN_WIDTH = 840;
// Viewport width a parent needs to widen the editor to SPLIT_MIN_WIDTH.
const EXPANDED_MIN_VIEWPORT = 1200;

const toMarkdownImage = ({ name, url }: UploadedImage) =>
  `![${name.replace(/\.[^.]+$/, "")}](${url})`;

const getImageFiles = (data: { files: FileList | null } | null) =>
  Array.from(data?.files ?? []).filter((file) =>
    file.type.startsWith("image/"),
  );

async function uploadImage(file: File) {
  const toastId = toast.loading(`Uploading ${file.name}...`);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const message = (await response.json()) as UploadResponse;

    if (message.data) {
      toast.dismiss(toastId);
      return message.data;
    }

    toast.error(message.error, { id: toastId });
  } catch {
    toast.error(`Couldn't upload ${file.name}`, { id: toastId });
  }

  return null;
}

// Inserts at `from`, or replaces the current selection, and puts the
// cursor after the image so further images land in order.
function insertImage(view: EditorView, image: UploadedImage, from?: number) {
  const range = view.state.selection.main;
  const insert = toMarkdownImage(image);
  const start = from ?? range.from;

  view.dispatch({
    changes: { from: start, to: from ?? range.to, insert },
    selection: { anchor: start + insert.length },
  });
  view.focus();
}

async function uploadIntoView(view: EditorView, files: File[], from?: number) {
  let position = from;

  for (const file of files) {
    const image = await uploadImage(file);
    if (!image) continue;

    insertImage(view, image, position);
    position = undefined;
  }
}

// Pasted or dropped images are uploaded and inserted as markdown. Handled
// here rather than via React so CodeMirror doesn't also insert the files.
const imageHandlers = EditorView.domEventHandlers({
  paste(evt, view) {
    const files = getImageFiles(evt.clipboardData);
    if (!files.length) return false;

    evt.preventDefault();
    void uploadIntoView(view, files);
    return true;
  },
  drop(evt, view) {
    const files = getImageFiles(evt.dataTransfer);
    if (!files.length) return false;

    evt.preventDefault();
    const position =
      view.posAtCoords({ x: evt.clientX, y: evt.clientY }) ?? undefined;
    void uploadIntoView(view, files, position);
    return true;
  },
});

const extensions = [
  markdown({ base: markdownLanguage }),
  EditorView.lineWrapping,
  imageHandlers,
];

const proseClassName =
  "prose prose-headings:font-display prose-a:text-primary prose-headings:tracking-tight prose-li:marker:text-primary max-w-none [&>div>:first-child]:mt-0";

// CodeMirror markdown editor with rendered preview and side-by-side modes.
// Images can be pasted, dropped, uploaded or picked from the media library.
export const MarkdownEditor = ({
  value,
  onChange,
  onBlur,
  height = "480px",
  onModeChange,
  ...props
}: MarkdownEditorProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const modalEditorRef = useRef<ReactCodeMirrorRef>(null);
  const [mode, setMode] = useState<MarkdownEditorMode>("write");
  const [modalOpen, setModalOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const uploadInputId = useId();

  const handleModeChange = (next: MarkdownEditorMode) => {
    if (next === "split") {
      const width = rootRef.current?.offsetWidth ?? 0;
      const canExpand =
        !!onModeChange && window.innerWidth >= EXPANDED_MIN_VIEWPORT;

      if (width < SPLIT_MIN_WIDTH && !canExpand) {
        setModalOpen(true);
        return;
      }
    }

    setMode(next);
    onModeChange?.(next);
  };

  // Falls back to appending when the editor isn't mounted (preview tab).
  const insertImages = async (images: (UploadedImage | null)[]) => {
    const uploaded = images.filter((image) => image !== null);
    const view = (modalOpen ? modalEditorRef : editorRef).current?.view;

    if (view) {
      for (const image of uploaded) insertImage(view, image);
      return;
    }

    if (!uploaded.length) return;

    const separator = value && !value.endsWith("\n") ? "\n\n" : "";
    onChange(`${value}${separator}${uploaded.map(toMarkdownImage).join("\n")}`);
  };

  const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const files = getImageFiles(evt.target);
    evt.target.value = "";

    const images: (UploadedImage | null)[] = [];
    for (const file of files) images.push(await uploadImage(file));

    await insertImages(images);
  };

  const imageActions = (
    <div className="flex flex-wrap gap-2">
      <input
        id={uploadInputId}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
      <Button type="button" variant="outline" size="sm" asChild>
        <label htmlFor={uploadInputId} className="cursor-pointer">
          <Upload />
          Upload image
        </label>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setLibraryOpen(true)}
      >
        <ImagePlus />
        Media library
      </Button>
    </div>
  );

  const renderEditor = (
    editorHeight: string,
    ref: React.RefObject<ReactCodeMirrorRef | null> = editorRef,
  ) => (
    <CodeMirror
      {...props}
      ref={ref}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="ring-offset-background focus-visible:ring-ring [&>div]:bg-input! min-h-0 min-w-0 overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&_.cm-content]:p-3! [&_.cm-line]:px-0! [&>div]:outline-0!"
      height={editorHeight}
      extensions={extensions}
      theme={resolvedTheme}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
      }}
    />
  );

  const renderPreview = (previewHeight: string) => (
    <div
      className="bg-input min-h-0 min-w-0 overflow-auto rounded-lg border p-3"
      style={{ height: previewHeight }}
    >
      {value.trim() ? (
        <article
          className={cn(
            proseClassName,
            resolvedTheme === "dark" && "prose-invert",
          )}
        >
          <MarkdownContent>{value}</MarkdownContent>
        </article>
      ) : (
        <p className="text-muted-foreground text-sm">Nothing to preview.</p>
      )}
    </div>
  );

  return (
    <div ref={rootRef} className="min-w-0">
      <Tabs
        value={mode}
        onValueChange={(next) => handleModeChange(next as MarkdownEditorMode)}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="write" className="px-3">
              <Pencil />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="px-3">
              <Eye />
              Preview
            </TabsTrigger>
            <TabsTrigger value="split" className="px-3">
              <Columns2 />
              Side by side
            </TabsTrigger>
          </TabsList>
          {!modalOpen && imageActions}
        </div>

        <TabsContent value="write" className="min-w-0">
          {renderEditor(height)}
        </TabsContent>
        <TabsContent value="preview" className="min-w-0">
          {renderPreview(height)}
        </TabsContent>
        <TabsContent value="split" className="grid min-w-0 grid-cols-2 gap-4">
          {renderEditor(height)}
          {renderPreview(height)}
        </TabsContent>
      </Tabs>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="flex h-[calc(100dvh-2rem)] flex-col sm:max-w-[calc(100%-2rem)]">
          <div className="flex flex-wrap items-center gap-4 pr-8">
            <DialogTitle>Side by side</DialogTitle>
            {imageActions}
          </div>
          <div className="grid min-h-0 flex-1 grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-1">
            {renderEditor("100%", modalEditorRef)}
            {renderPreview("100%")}
          </div>
        </DialogContent>
      </Dialog>

      <MediaPickerDialog
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={(url) => insertImages([{ name: "image", url }])}
      />
    </div>
  );
};
