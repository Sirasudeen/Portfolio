import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const email = "Sirasudeenp@gmail.com";

export const ContactSection = () => {
  const [copyState, setCopyState] = useState("idle");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("idle"), 3500);
  };
  return (
    <section id="contact" className="contact section-pad">
      <div className="section-frame">
        <div className="section-kicker"><span>04</span><p>Good things start with a conversation</p><span className="kicker-aside">Your move ↙</span></div>
        <div className="contact-intro"><p>Have a curious problem,<br />a half-formed idea, or just a hello?</p><span className="contact-asterisk" aria-hidden="true">✳</span></div>
        <a className="contact-invitation" href={`mailto:${email}`}><h2>Let&apos;s <em>talk.</em></h2><span className="contact-invitation-arrow"><ArrowUpRight aria-hidden="true" /></span></a>
        <div className="contact-bottom">
          <div className="contact-address"><span className="small-label">Start here</span><div><a href={`mailto:${email}`}>{email}</a><button type="button" className="copy-email" onClick={copyEmail} aria-label="Copy email address">{copyState === "copied" ? <Check size={17} /> : <Copy size={17} />}</button></div><span className="copy-feedback" role="status">{copyState === "copied" ? "Copied. See you in the inbox." : copyState === "failed" ? "Could not copy. Select the email above instead." : "No forms. No friction. Just a conversation."}</span></div>
          <div className="contact-socials"><a href="https://github.com/Sirasudeen" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} aria-hidden="true" /></a><a href="https://www.linkedin.com/in/sirasudeen-p-4512b4221/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} aria-hidden="true" /></a></div>
        </div>
      </div>
    </section>
  );
};