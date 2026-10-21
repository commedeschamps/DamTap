import Image from "next/image";

const steps = [
  { title: "Вы находите и покупаете со скидкой", text: "Выбирайте любимые продукты рядом с вами и забирайте по выгодной цене.", alt: "Парень выбирает продукты в телефоне" },
  { title: "Бизнесы продают излишки", text: "Кафе, магазины и пекарни добавляют продукты, которые скоро не смогут продать.", alt: "Девушка с продуктами у своего магазина" },
  { title: "Вместе мы делаем мир лучше", text: "Вкусная еда находит новых хозяев, а количество пищевых отходов в Казахстане уменьшается.", alt: "Улыбающаяся Земля среди зелёных листьев" },
];

export default function HowItWorks() {
  return <section className="how-section page-container" id="how-it-works" aria-labelledby="how-title"><h2 id="how-title">Как работает DamTap?</h2><ol className="steps">{steps.map((step, index) => <li className="step" key={step.title}><span className="step-number" aria-hidden="true">0{index + 1}</span><div className="step-copy"><h3>{step.title}</h3><p>{step.text}</p></div><Image className="step-art" src={`/images/step-${index + 1}.webp`} alt={step.alt} width={340} height={220} sizes="(max-width: 600px) 180px, 24vw" /></li>)}</ol></section>;
}
