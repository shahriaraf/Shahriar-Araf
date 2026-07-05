"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { FaFacebookF, FaLinkedinIn, FaGithub, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import emailjs from "@emailjs/browser";

// ─── Premium Typography Stack ─────────────────────────────────────────────────
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// ─── Warm Monochrome Palette (Dark Luxury) ────────────────────────────────────
const C = {
  bg:            "#101010",
  surface:       "#1c1b19",
  surfaceHover:  "#252320",
  inputBg:       "#111110",
  border:        "#2a2723",
  borderStrong:  "#3d3833",
  muted:         "#8a8578",
  text:          "#e5e0d4",
  emphasis:      "#f4f0e8",
  success:       "#a8c090",
  error:         "#c99080",
};

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");
    if (formRef.current) {
      emailjs
        .sendForm("service_a609f54", "template_nbhb31q", formRef.current, "DXMrIyiC32rc37Gkd")
        .then(() => {
          setStatus("Sent");
          if (formRef.current) formRef.current.reset();
          setTimeout(() => setStatus(""), 3000);
        })
        .catch((error) => {
          console.error(error);
          setStatus("Failed to send. Please try again.");
        });
    }
  };

  return (
    <section
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} h-screen w-full flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden`}
      style={{
        backgroundColor: C.bg,
        fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
      }}
    >
      <style>{`
        .input-field {
          width: 100%;
          background: ${C.inputBg};
          border: 1px solid ${C.border};
          color: ${C.text};
          padding: 10px 12px;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          border-radius: 2px;
          transition: all 0.3s ease;
          letter-spacing: -0.005em;
        }
        .input-field:focus {
          outline: none;
          border-color: ${C.emphasis};
          background: ${C.surface};
        }
        .input-field::placeholder {
          color: ${C.muted};
        }
        .input-label {
          font-family: var(--font-jetbrains-mono), monospace;
          font-size: 10px;
          color: ${C.muted};
          text-transform: uppercase;
          letter-spacing: 0.16em;
          display: block;
          margin-bottom: 6px;
          transition: color 0.3s ease;
        }
        .field-group:focus-within .input-label {
          color: ${C.emphasis};
        }

        /* Submit button */
        .submit-btn {
          position: relative;
          width: 100%;
          padding: 14px 24px;
          background: ${C.emphasis};
          color: ${C.bg};
          font-family: var(--font-inter), sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border: 1px solid ${C.emphasis};
          border-radius: 2px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${C.bg};
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: 0;
        }
        .submit-btn:hover:not(:disabled) {
          color: ${C.emphasis};
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(244, 240, 232, 0.12);
        }
        .submit-btn:hover:not(:disabled)::before {
          transform: translateY(0);
        }
        .submit-btn > span {
          position: relative;
          z-index: 1;
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Social icons */
        .social-icon {
          color: ${C.muted};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid ${C.border};
          background: ${C.surface};
        }
        .social-icon:hover {
          color: ${C.bg};
          background: ${C.emphasis};
          border-color: ${C.emphasis};
          transform: translateY(-2px);
        }

        /* Sidebar borders — responsive */
        .icon-sidebar {
          border-top: 1px solid ${C.border};
        }
        @media (min-width: 1024px) {
          .icon-sidebar {
            border-top: none;
            border-left: 1px solid ${C.border};
          }
        }

        /* Hero image — BIGGER */
        .hero-image-wrapper {
          position: relative;
          flex: 1;
          width: 100%;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 0;
          animation: imageReveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
        }

        .hero-image-wrapper img {
          object-fit: contain;
          object-position: center;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .hero-image-wrapper:hover img {
          transform: scale(1.03);
        }

        @keyframes imageReveal {
          0% {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        /* Left column tagline (under image) */
        .image-tagline {
          animation: taglineReveal 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s both;
        }
        @keyframes taglineReveal {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative w-full max-w-7xl h-full max-h-[95vh] rounded-sm overflow-hidden flex flex-col">

        {/* === MAIN CONTENT AREA === */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* --- LEFT + CENTER --- */}
          <div className="flex-none lg:flex-1 flex flex-col md:flex-row min-h-0">

            {/* LEFT SIDE: HERO IMAGE + TAGLINE */}
            <div className="w-full md:w-1/2 px-3 py-3 sm:p-4 md:p-5 lg:p-6 flex flex-col relative overflow-hidden min-h-[300px] md:min-h-0">
              {/* Top: Small meta label */}
              <div className="flex items-center gap-3 relative z-10 shrink-0 mb-2">
                <span
                  className="h-px w-8"
                  style={{ backgroundColor: C.borderStrong }}
                />
                <span
                  className="text-[10px] uppercase"
                  style={{
                    color: C.muted,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    letterSpacing: ".18em",
                  }}
                >
                  Get in touch
                </span>
              </div>

              {/* Middle: HERO IMAGE — HUGE */}
              <div className="hero-image-wrapper">
                <Image
                  src="/contact image.png"
                  alt="Contact"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Bottom: Tagline — directly under the image */}
              <div className="image-tagline shrink-0 flex items-center justify-center pt-3 sm:pt-4">
                <p
                  className="text-sm sm:text-base text-center leading-relaxed"
                  style={{
                    color: C.muted,
                    fontFamily: "var(--font-inter), sans-serif",
                    letterSpacing: "-0.005em",
                    maxWidth: 380,
                  }}
                >
                  Let&apos;s make{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      fontFamily: "var(--font-instrument-serif), serif",
                      color: C.emphasis,
                      fontSize: "1.15em",
                    }}
                  >
                    something
                  </span>{" "}
                  together. Drop a <span
                    style={{
                      fontStyle: "italic",
                      fontFamily: "var(--font-instrument-serif), serif",
                      color: C.emphasis,
                      fontSize: "1.15em",
                    }}
                  >
                    massage
                  </span>{" "} and I&apos;ll get back to you shortly.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full md:w-1/2 px-5 py-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center min-h-0">
              <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-3">

                <div className="field-group">
                  <label className="input-label">Email</label>
                  <input type="email" name="user_email" required className="input-field" />
                </div>

                <div className="field-group">
                  <label className="input-label">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="input-field"
                    style={{ resize: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "Sending..."}
                  className="submit-btn"
                >
                  <span>{status === "Sending..." ? "Sending..." : "Send Message"}</span>
                </button>

                {status && status !== "Sending..." && (
                  <p
                    className="text-center text-xs"
                    style={{
                      color: status.includes("Sent") ? C.success : C.error,
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* --- SIDEBAR: ICONS --- */}
          <div className="icon-sidebar w-full lg:w-16 flex lg:flex-col justify-around lg:justify-between items-center py-3 lg:py-6 px-4 lg:px-0 shrink-0">
            <div className="flex lg:flex-col gap-3">
              <a
                href="https://wa.me/8801726649175"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="WhatsApp"
              >
                <FaWhatsapp size={15} />
              </a>
              <a
                href="mailto:shahriaraf01@gmail.com"
                className="social-icon"
                title="Email"
              >
                <FaEnvelope size={15} />
              </a>
            </div>
            <div className="flex lg:flex-col gap-3">
              <a
                href="https://www.facebook.com/shahriar.araf.3"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Facebook"
              >
                <FaFacebookF size={15} />
              </a>
              <a
                href="https://www.linkedin.com/in/shoumo-shahriar-araf"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="LinkedIn"
              >
                <FaLinkedinIn size={15} />
              </a>
              <a
                href="https://github.com/shahriaraf"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="GitHub"
              >
                <FaGithub size={15} />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}