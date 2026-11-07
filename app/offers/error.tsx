"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function OffersError({ reset }: { reset: () => void }) {
  return <main id="main" className="page-container catalogue-error" aria-labelledby="error-title">
    <h1 id="error-title">Не удалось загрузить предложение</h1>
    <p role="alert">Попробуйте ещё раз. Если ошибка повторится, вернитесь в каталог и выберите другое блюдо.</p>
    <div className="recovery-actions"><button className="button button-primary" onClick={reset}><RefreshCw size={18} aria-hidden="true" />Попробовать снова</button><Link className="button button-outline" href="/offers">К предложениям</Link><Link className="text-link" href="/">На главную</Link></div>
  </main>;
}
