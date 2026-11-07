import Image from "next/image";

const steps = [
  { title: "Выберите по вкусу", text: "Найдите блюдо или заведение. Подберите категорию, район и удобную цену.", alt: "Парень выбирает продукты в телефоне" },
  { title: "Проверьте детали", text: "Откройте предложение: там время самовывоза, адрес, состав и правила выдачи.", alt: "Девушка с продуктами у своего магазина" },
  { title: "Сохраните любимое", text: "Нажмите на сердечко, чтобы вернуться к блюду. Избранное останется в этом браузере.", alt: "Улыбающаяся Земля среди зелёных листьев" },
];

export default function HowItWorks() {
  return <section className="how-section page-container" id="how-it-works" aria-labelledby="how-title"><div className="section-heading"><h2 id="how-title" tabIndex={-1}>Как работает DamTap?</h2><p className="section-description">Попробуйте выбрать еду в демо-каталоге. Заказ и бронирование пока недоступны.</p></div><ol className="steps">{steps.map((step, index) => <li className="step" key={step.title}><span className="step-number" aria-hidden="true">0{index + 1}</span><div className="step-copy"><h3>{step.title}</h3><p>{step.text}</p></div><Image className="step-art" src={`/images/step-${index + 1}.webp`} alt={step.alt} width={340} height={220} sizes="(max-width: 600px) 180px, 24vw" /></li>)}</ol></section>;
}
