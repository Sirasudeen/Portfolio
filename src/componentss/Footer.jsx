import { ArrowUp } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer section-frame">
      <a className="wordmark wordmark--light" href="#hero" aria-label="siras.cloud, home">siras<span>.cloud</span></a>
      <p>Designed and built with intention · © {new Date().getFullYear()}</p>
      <a
        href="#hero"
        className="back-to-top"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </a>
    </footer>
  );
};
