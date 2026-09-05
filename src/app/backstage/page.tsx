"use client";

// Client component: form state and the login request.

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import s from "@/components/backstage/Backstage.module.css";

function LoginForm() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/backstage/dashboard";

  async function submit() {
    if (!pw) return;
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/backstage/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) {
        router.push(next);
        router.refresh();
      } else {
        setErr("That password isn't right.");
        setBusy(false);
      }
    } catch {
      setErr("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className={s.loginCard}>
      <Image
        src="/brand/mortgagepunk-logo@3x.png"
        alt="Mortgage Punk"
        width={1209}
        height={825}
        className={s.loginLogo}
        priority
      />
      <h1 className={s.loginTitle}>Backstage</h1>
      <p className={s.loginSub}>
        Where the site gets updated. If you landed here by accident, there is
        nothing for you.
      </p>

      {err && <div className={s.loginErr}>{err}</div>}

      <label className={s.field}>
        <span className={s.label}>Password</span>
        <input
          type="password"
          className={s.input}
          value={pw}
          autoFocus
          autoComplete="current-password"
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </label>

      <button
        type="button"
        className={`${s.btn} ${s.btnPrimary}`}
        onClick={submit}
        disabled={busy || !pw}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {busy ? "Checking..." : "Let me in"}
      </button>
    </div>
  );
}

export default function BackstageLogin() {
  return (
    <div className={s.login}>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
