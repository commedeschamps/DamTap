import Link from "next/link";
export default function OfferNotFound() {
  return <main className="page-container catalogue-empty"><h1>Предложение не найдено</h1><p>Возможно, ссылка устарела. Посмотрите другие блюда в каталоге.</p><Link className="button button-primary" href="/offers">Смотреть предложения</Link></main>;
}
