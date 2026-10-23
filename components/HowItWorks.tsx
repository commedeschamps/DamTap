import Image from "next/image";

const steps = [
  { title: "Находите блюдо по вкусу", text: "Ищите знакомые блюда, выбирайте категории и сохраняйте понравившееся.", alt: "Парень выбирает продукты в телефоне" },
  { title: "Хорошая еда получает шанс", text: "Идея DamTap проста: помочь заведениям предлагать излишки еды по выгодной цене.", alt: "Девушка с продуктами у своего магазина" },
  { title: "Меньше еды пропадает", text: "Осознанный выбор помогает беречь продукты и сокращать пищевые отходы.", alt: "Улыбающаяся Земля среди зелёных листьев" },
];

export default function HowItWorks() {
  return <section className="how-section page-container" id="how-it-works" aria-labelledby="how-title"><h2 id="how-title" tabIndex={-1}>Как работает DamTap?</h2><ol className="steps">{steps.map((step, index) => <li className="step" key={step.title}><span className="step-number" aria-hidden="true">0{index + 1}</span><div className="step-copy"><h3>{step.title}</h3><p>{step.text}</p></div><Image className="step-art" src={`/images/step-${index + 1}.webp`} alt={step.alt} width={340} height={220} sizes="(max-width: 600px) 180px, 24vw" /></li>)}</ol></section>;
}
