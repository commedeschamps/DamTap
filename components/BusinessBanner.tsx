"use client";

import Image from "next/image";
import { ArrowRight, ChartNoAxesColumnIncreasing, Heart, Leaf, UsersRound } from "lucide-react";

const benefits = [
  { Icon: ChartNoAxesColumnIncreasing, label: <>Больше клиентов<br />и выручки</> },
  { Icon: Leaf, label: <>Меньше<br />пищевых отходов</> },
  { Icon: UsersRound, label: <>Простая<br />и удобная платформа</> },
  { Icon: Heart, label: <>Поддержка<br />на каждом этапе</> },
];

export default function BusinessBanner({ onPartner }: { onPartner: () => void }) {
  return <section className="business-section page-container" id="business" aria-labelledby="business-title"><div className="business-copy"><h2 id="business-title">Вы представитель бизнеса?</h2><p>Присоединяйтесь к DamTap и находите новых клиентов,<br className="desktop-break" /> сокращая пищевые отходы.</p><div className="business-buttons"><button className="button button-primary" onClick={onPartner}>Стать партнёром <ArrowRight size={16} /></button><a className="button button-outline" href="#how-it-works">Узнать больше</a></div></div><ul className="business-benefits">{benefits.map(({ Icon, label }, i) => <li key={i}><span className="benefit-icon"><Icon size={24} aria-hidden="true" /></span><span>{label}</span></li>)}</ul><div className="business-art"><Image src="/images/business-banner.webp" fill alt="Уютное кафе с террасой в Астане" sizes="(max-width: 700px) 800px, (max-width: 1000px) 1200px, 900px" /></div><Image src="/images/leaves-tl.webp" width={135} height={65} alt="" className="business-leaves" /></section>;
}
