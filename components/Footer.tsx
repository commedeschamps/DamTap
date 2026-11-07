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
      <nav className="footer-links" aria-label="Покупателям"><h2>Покупателям</h2><Link href="/offers">Смотреть предложения</Link><Link href="/#how-it-works">Как это работает</Link></nav>
      <nav className="footer-links" aria-label="О сервисе"><h2>О DamTap</h2><Link href="/#business">Для заведений</Link><Link href="/#how-it-works">Меньше пищевых отходов</Link></nav>
    </footer>
  );
}
