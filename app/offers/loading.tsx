export default function LoadingOffers() {
  return <main id="main" className="page-container catalogue-loading" aria-busy="true" aria-labelledby="loading-title">
    <h1 id="loading-title">Загружаем предложения</h1>
    <p role="status">Собираем блюда и условия самовывоза…</p>
    <div className="loading-offer-grid" aria-hidden="true">{[0, 1, 2].map(item => <div className="loading-offer" key={item}><div className="loading-photo" /><div className="loading-line" /><div className="loading-line loading-line-short" /></div>)}</div>
  </main>;
}
