import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer page-container" id="about">
      <div className="footer-intro">
        <Link href="/" className="footer-brand" aria-label="DamTap — на главную"><Logo /></Link>
        <p>Еда со скидкой. Больше вкуса, меньше отходов.</p>
        <small>© {new Date().getFullYear()} DamTap</small>
      </div>
      <nav className="footer-links" aria-label="Покупателям"><h2>Покупателям</h2><a href="#offers">Смотреть предложения</a><a href="#how-it-works">Как это работает</a></nav>
      <nav className="footer-links" aria-label="О сервисе"><h2>О DamTap</h2><a href="#business">Для заведений</a><a href="#how-it-works">Меньше пищевых отходов</a></nav>
    </footer>
  );
}
