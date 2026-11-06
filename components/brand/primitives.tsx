import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import Image from "next/image";

export function BrandLogo({ inverse = false, className = "" }: { inverse?: boolean; className?: string }) {
  return <Image unoptimized src={inverse ? "/brand/maychant-logo-on-dark.svg" : "/brand/maychant-logo.svg"} alt="Maychant" width={1677} height={312} className={`mc-logo ${className}`} />;
}

export function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ink" | "link";
  small?: boolean;
  arrow?: boolean;
};
export function Button({ variant = "primary", small, arrow, className = "", children, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`mc-button mc-button--${variant}${small ? " mc-button--small" : ""} ${className}`} {...props}>{children}{arrow ? <Arrow /> : null}</button>;
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; error?: string };
export function Field({ id, label, hint, error, className = "", ...props }: FieldProps) {
  const description = [hint ? `${id}-hint` : "", error ? `${id}-error` : "", props["aria-describedby"]].filter(Boolean).join(" ");
  return <div className="mc-label"><label htmlFor={id}>{label}</label><input {...props} id={id} className={`mc-input ${className}`} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={description || undefined} />{hint ? <span id={`${id}-hint`} className="mc-help">{hint}</span> : null}{error ? <span id={`${id}-error`} className="mc-help mc-help--error">{error}</span> : null}</div>;
}

export function Notice({ tone = "info", children }: { tone?: "success" | "error" | "info"; children: ReactNode }) {
  return <div className={`mc-notice mc-notice--${tone}`}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />{tone === "success" ? <path d="m7.5 12 3 3 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M12 7v6m0 3v.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}</svg><div>{children}</div></div>;
}
