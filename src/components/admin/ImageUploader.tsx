"use client";

import { useRef, useState } from "react";

type ImageUploaderProps = {
  name: string;
  label: string;
  initialUrls?: string[];
  multiple?: boolean;
  aspectRatio?: number;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function cleanUrls(value: string): string[] {
  return value
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

function optimiseCloudinaryUrl(url: string): string {
  return url.includes("res.cloudinary.com/") && url.includes("/upload/")
    ? url.replace("/upload/", "/upload/f_auto,q_auto/")
    : url;
}

export function ImageUploader({
  name,
  label,
  initialUrls = [],
  multiple = false,
  aspectRatio = 4 / 3,
}: ImageUploaderProps) {
  const [urls, setUrls] = useState(initialUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingIndex, setPendingIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
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
    setPendingFiles(multiple ? selected : [selected[0]]);
    setPendingIndex(0);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selected[0]));
    setZoom(1);
    setPositionX(50);
    setPositionY(50);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function cropAndUpload() {
    const file = pendingFiles[pendingIndex];
    if (!file) return;
    setIsUploading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Impossible de lire cette photo."));
        image.src = objectUrl;
      });
      const baseWidth = Math.min(image.naturalWidth, image.naturalHeight * aspectRatio);
      const baseHeight = baseWidth / aspectRatio;
      const cropWidth = baseWidth / zoom;
      const cropHeight = baseHeight / zoom;
      const sourceX = (image.naturalWidth - cropWidth) * (positionX / 100);
      const sourceY = (image.naturalHeight - cropHeight) * (positionY / 100);
      const outputWidth = aspectRatio >= 1 ? 1600 : 1200;
      const outputHeight = Math.round(outputWidth / aspectRatio);
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Le recadrage n’est pas disponible sur cet appareil.");
      context.drawImage(image, sourceX, sourceY, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);
      URL.revokeObjectURL(objectUrl);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Impossible de préparer cette photo.");
      const data = new FormData();
      data.append("file", new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }));
      data.append("upload_preset", UPLOAD_PRESET!);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const result = (await response.json()) as { secure_url?: string; error?: { message?: string } };
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Impossible d’envoyer cette photo.");
      const uploadedUrl = optimiseCloudinaryUrl(result.secure_url);
      setUrls((current) => (multiple ? [...current, uploadedUrl] : [uploadedUrl]));
      if (pendingIndex + 1 < pendingFiles.length) {
        setPendingIndex((current) => current + 1);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(pendingFiles[pendingIndex + 1]));
        setZoom(1);
        setPositionX(50);
        setPositionY(50);
      } else {
        setPendingFiles([]);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Impossible d’envoyer les photos.");
    } finally {
      setIsUploading(false);
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
        {multiple ? "Tu peux sélectionner plusieurs photos. Elles seront recadrées avant l’envoi ; la première est la photo principale." : "Choisis un portrait ou une photo professionnelle, puis ajuste le cadrage."}
      </p>
      {error && <p className="mt-2 text-sm text-terracotta">{error}</p>}

      {pendingFiles.length > 0 && (
        <div className="mt-5 border border-line bg-bg-alt p-4 sm:p-5">
          <p className="font-display text-lg text-forest-deep">Recadrer la photo {pendingIndex + 1}{pendingFiles.length > 1 ? ` sur ${pendingFiles.length}` : ""}</p>
          <div className="mt-4 overflow-hidden bg-forest-deep" style={{ aspectRatio }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Recadrage"
              className="h-full w-full object-cover"
              style={{ objectPosition: `${positionX}% ${positionY}%`, transform: `scale(${zoom})` }}
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="text-xs text-ink-soft">Zoom
              <input className="mt-1 w-full" type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
            </label>
            <label className="text-xs text-ink-soft">Gauche / droite
              <input className="mt-1 w-full" type="range" min="0" max="100" value={positionX} onChange={(event) => setPositionX(Number(event.target.value))} />
            </label>
            <label className="text-xs text-ink-soft">Haut / bas
              <input className="mt-1 w-full" type="range" min="0" max="100" value={positionY} onChange={(event) => setPositionY(Number(event.target.value))} />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => void cropAndUpload()} className="btn btn-primary" disabled={isUploading}>
              {isUploading ? "Envoi…" : "Valider ce cadrage"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(""); setPendingFiles([]); }} disabled={isUploading}>Annuler</button>
          </div>
        </div>
      )}

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
