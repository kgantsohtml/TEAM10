import { UploadForm } from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <main className="page">
      <h1 className="page-title">UPLOAD</h1>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: "12px",
          color: "var(--muted)",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          maxWidth: "42ch",
        }}
      >
        MIXES, ORIGINALS, EDITS, UNRELEASED ONLY. NO BIG-NAME LEAKS.
      </p>
      <UploadForm />
    </main>
  );
}
