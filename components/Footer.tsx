import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return <footer className="site-footer page-container" id="about"><div><a href="#" className="footer-brand">DamTap</a><p>Вкусная еда. Меньше отходов. Вместе.</p></div><p className="footer-note">Учебный проект · Астана<br />Демонстрационные предложения</p><a className="text-link" href="#how-it-works">О проекте <ArrowUpRight size={16} /></a></footer>;
}
