"use client";

import { useRef, useState } from "react";

type ImageUploaderProps = {
  name: string;
  label: string;
  initialUrls?: string[];
  multiple?: boolean;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function cleanUrls(value: string): string[] {
  return value
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

export function ImageUploader({
  name,
  label,
  initialUrls = [],
  multiple = false,
}: ImageUploaderProps) {
  const [urls, setUrls] = useState(initialUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Le service de photos n’est pas encore configuré.");
      return;
    }

    const selected = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!selected.length) {
      setError("Choisis une image JPG, PNG, WEBP ou HEIC.");
      return;
    }

    setError("");
    setIsUploading(true);
    try {
      const uploads = await Promise.all(
        selected.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", UPLOAD_PRESET);
          const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: data,
          });
          const result = (await response.json()) as { secure_url?: string; error?: { message?: string } };
          if (!response.ok || !result.secure_url) {
            throw new Error(result.error?.message || "Impossible d’envoyer cette photo.");
          }
          return result.secure_url;
        })
      );
      setUrls((current) => (multiple ? [...current, ...uploads] : [uploads[uploads.length - 1]]));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Impossible d’envoyer les photos.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={urls.join("\n")} />
      <p className="field-label">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(event) => void uploadFiles(event.target.files)}
        className="sr-only"
        id={`${name}-upload`}
      />
      <label
        htmlFor={`${name}-upload`}
        className={`btn btn-ghost cursor-pointer ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {isUploading ? "Envoi des photos…" : multiple ? "Ajouter des photos" : "Choisir une photo"}
      </label>
      <p className="mt-2 text-xs text-ink-faint">
        {multiple ? "Tu peux sélectionner plusieurs photos. La première est la photo principale." : "Choisis un portrait ou une photo professionnelle."}
      </p>
      {error && <p className="mt-2 text-sm text-terracotta">{error}</p>}

      {urls.length > 0 && (
        <div className={`mt-4 grid gap-3 ${multiple ? "grid-cols-2 sm:grid-cols-3" : "max-w-xs"}`}>
          {urls.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative aspect-[4/3] overflow-hidden bg-bg-alt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Aperçu" className="img-cover" />
              <button
                type="button"
                onClick={() => setUrls((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                className="absolute right-2 top-2 bg-forest-deep px-2 py-1 text-xs text-paper opacity-95"
                aria-label="Supprimer cette photo"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}

      <details className="mt-4 text-sm text-ink-soft">
        <summary className="cursor-pointer underline">Ou coller un lien de photo existant</summary>
        <textarea
          value={urls.join("\n")}
          onChange={(event) => {
            const nextUrls = cleanUrls(event.target.value);
            setUrls(multiple ? nextUrls : nextUrls.slice(-1));
          }}
          rows={multiple ? 4 : 2}
          className="field-input mt-3"
          placeholder="https://res.cloudinary.com/..."
        />
      </details>
    </div>
  );
}
