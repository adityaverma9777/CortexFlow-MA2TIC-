"use client";

import Image from "next/image";
import { ExternalLink, Linkedin } from "lucide-react";

type AboutPanelProps = {
  isDark?: boolean;
};

type TeamMember = {
  name: string;
  university: string;
  about: string;
  linkedin: string;
  avatar: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Archana Thakur",
    university: "Eternal University",
    about: "Full Stack Developer | Scalable Web Applications | Algorithmic Problem Solver",
    linkedin: "https://www.linkedin.com/in/archana-thakur-9b66a4338/",
    avatar: "/images/Archana.jpeg",
  },
  {
    name: "Tanisha Bhardwaj",
    university: "Eternal University",
    about: "Full Stack Developer | UI-Driven Development | Passionate About Scalable Solutions",
    linkedin: "https://www.linkedin.com/in/tanisha-bhardwaj-69350635a/",
    avatar: "/images/Tanisha.jpeg",
  },
  {
    name: "Manika Kutiyal",
    university: "Eternal University",
    about: "Web Developer | BCA Student | Passionate About User-Friendly Designs",
    linkedin: "https://www.linkedin.com/in/manika-kutiyal/",
    avatar: "/images/Manna.png",
  },
  {
    name: "Aditya Verma",
    university: "Lovely Professional University",
    about: "ML Systems | Quantization & Inference | AI Deployment",
    linkedin: "https://www.linkedin.com/in/adityaverma9777/",
    avatar: "/images/Aditya.png",
  },
];

export function AboutPanel({ isDark = false }: AboutPanelProps) {
  const ma2ticLogo = isDark
    ? "/images/ma2tic logo dark mode .png"
    : "/images/ma2tic logo light mode .png";

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl pb-10">
        <section
          className="relative overflow-hidden rounded-[26px] p-[1px]"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(45,212,191,0.4), rgba(56,189,248,0.22), rgba(251,146,60,0.28))"
              : "linear-gradient(135deg, rgba(20,184,166,0.48), rgba(56,189,248,0.24), rgba(249,115,22,0.34))",
            boxShadow: isDark
              ? "0 14px 50px rgba(0,0,0,0.38)"
              : "0 16px 46px rgba(6,28,42,0.15)",
          }}
        >
          <div
            className="relative rounded-[25px] px-4 py-6 sm:px-6 sm:py-8 lg:px-9 lg:py-10"
            style={{
              background: isDark
                ? "linear-gradient(180deg, rgba(4,20,33,0.92), rgba(6,22,35,0.86))"
                : "linear-gradient(180deg, rgba(249,253,255,0.92), rgba(243,249,252,0.84))",
              border: "1px solid var(--nt-glass-border)",
            }}
          >
            <div
              className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full blur-3xl"
              style={{ background: "rgba(20,184,166,0.18)" }}
            />
            <div
              className="pointer-events-none absolute -right-8 -bottom-14 h-44 w-44 rounded-full blur-3xl"
              style={{ background: "rgba(249,115,22,0.16)" }}
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <span
                  className="text-[34px] font-light tracking-[0.14em] sm:text-[44px]"
                  style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    color: "var(--nt-text-hi)",
                    textShadow: isDark
                      ? "0 0 24px rgba(45,212,191,0.1), 0 2px 12px rgba(0,0,0,0.4)"
                      : "0 0 24px rgba(10,23,36,0.1), 0 2px 9px rgba(10,23,36,0.12)",
                  }}
                >
                  cortexflow
                </span>
                <span
                  className="text-[11px] uppercase tracking-[0.29em]"
                  style={{ color: "var(--nt-text-md)", fontFamily: "var(--font-dm-sans), sans-serif" }}
                >
                  cognitive signature analysis
                </span>
              </div>

              <div className="flex w-full max-w-[420px] flex-col items-start lg:items-end">
                <Image
                  src={ma2ticLogo}
                  alt="MA2TIC logo"
                  width={900}
                  height={340}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className="mt-4 rounded-3xl p-4 sm:p-6 lg:p-7"
          style={{
            background: "var(--nt-glass)",
            border: "1px solid var(--nt-glass-border)",
            boxShadow: "var(--nt-glass-shadow)",
          }}
        >
          <h1
            className="mb-3 text-[19px] font-semibold tracking-tight"
            style={{ color: "var(--nt-text-hi)", fontFamily: "var(--font-syne), sans-serif" }}
          >
            About MA2TIC
          </h1>

          <div
            className="space-y-4 text-[14px] leading-7 sm:text-[15px]"
            style={{ color: "var(--nt-text-lo)", fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            <p>
              <span style={{ color: "#1D9E75", fontWeight: 700 }}>MA2TIC</span> is an independent tech entity that
              specializes in scalable solutions development for digital products in education, healthcare, and advanced
              technology systems. The organization was founded by Archana Thakur, Tanisha Bhardwaj, Manika Kutiyal,
              and Aditya Verma and operates with a product-first philosophy. This strategy emphasizes structured
              engineering, innovation, and full-stack application development for impactful results.
            </p>

            <p>
              One of the leading platforms developed by <span style={{ color: "#F59E0B", fontWeight: 700 }}>MA2TIC</span>
              {" "}is <span style={{ color: "#F59E0B", fontWeight: 700 }}>CortexFlow</span>. It serves as a
              cognitive-signature analysis platform and includes voice and text input workflows combined with
              deterministic linguistic biomarker extraction and AI-supported interpretations. CortexFlow uses AI-backed
              transcription pipelines in tandem with a <span style={{ color: "#3B82F6", fontWeight: 700 }}>FastAPI backend</span>
              {" "}to produce clinician-friendly non-diagnostic reports in the form of structured documents. They are
              delivered via an interactive multi-panel interface, which supports analysis within particular domains and
              trends. CortexFlow is built using <span style={{ color: "#1D9E75", fontWeight: 700 }}>Next.js</span> as a
              frontend monorepo and deployed with the help of <span style={{ color: "#1D9E75", fontWeight: 700 }}>Vercel</span>
              {" "}and <span style={{ color: "#1D9E75", fontWeight: 700 }}>Hugging Face Spaces</span>.
            </p>

            <p>
              <span style={{ color: "#D85A30", fontWeight: 700 }}>CortexFlow is the proprietary intellectual property of MA2TIC.</span>
              {" "}It is licensed to use only according to MA2TIC Proprietary License v1.0. No rights are granted until
              official written authorization is provided. The work is copyrighted and officially registered with
              Copyrighted.com. Registration number is <a
                href="https://github.com/adityaverma9777/CortexFlow-MA2TIC-/blob/main/frontend/public/images/CortexFlow%20-%20Protected%20by%20Copyrighted.com_page-0001.jpg"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#D85A30", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 2 }}
              >
                JMfvoCJAaLxUcIDf
              </a>
              {" "}and date of registration is <span style={{ color: "#D85A30", fontWeight: 700 }}>April 8, 2026</span>.
            </p>
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2
              className="text-[17px] font-semibold"
              style={{ color: "var(--nt-text-hi)", fontFamily: "var(--font-syne), sans-serif" }}
            >
              Core Team
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {TEAM_MEMBERS.map((member, index) => (
              <a
                key={member.name}
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-2xl p-[1px]"
                style={{
                  background: isDark
                    ? "linear-gradient(130deg, rgba(45,212,191,0.36), rgba(59,130,246,0.2), rgba(249,115,22,0.32))"
                    : "linear-gradient(130deg, rgba(29,158,117,0.38), rgba(59,130,246,0.22), rgba(249,115,22,0.32))",
                }}
              >
                <article
                  className="h-full rounded-2xl p-4"
                  style={{
                    background: "var(--nt-glass-hi)",
                    border: "1px solid var(--nt-glass-border)",
                    boxShadow: "var(--nt-glass-shadow)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="relative h-16 w-16 overflow-hidden rounded-xl"
                      style={{ border: "1px solid var(--nt-divider)", background: "var(--nt-hover)" }}
                    >
                      <Image
                        src={member.avatar}
                        alt={`${member.name} profile image`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="truncate text-[14px] font-semibold"
                        style={{ color: "var(--nt-text-hi)", fontFamily: "var(--font-syne), sans-serif" }}
                      >
                        {member.name}
                      </h3>
                      <p
                        className="truncate text-[11px]"
                        style={{ color: "var(--nt-text-xs)", fontFamily: "var(--font-dm-sans), sans-serif" }}
                      >
                        {member.university}
                      </p>
                    </div>
                  </div>

                  <p
                    className="min-h-[56px] text-[12px] leading-5"
                    style={{ color: "var(--nt-text-lo)", fontFamily: "var(--font-dm-sans), sans-serif" }}
                  >
                    {member.about}
                  </p>

                  <div
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px]"
                    style={{
                      background: "var(--nt-hover)",
                      border: "1px solid var(--nt-divider)",
                      color: "var(--nt-text-md)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                    }}
                  >
                    <Linkedin size={12} />
                    LinkedIn
                    <ExternalLink size={11} className="opacity-70 transition-opacity group-hover:opacity-100" />
                  </div>
                </article>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
