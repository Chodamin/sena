export type GuideV2HomeCard = {
  id: string
  title: string
  desc: string
  meta?: string
}

type Props = {
  cards: GuideV2HomeCard[]
  onSelect: (id: string) => void
  searchDraft: string
  onSearchDraftChange: (v: string) => void
  onSearchSubmit: () => void
}

export function GuideV2Home({
  cards,
  onSelect,
  searchDraft,
  onSearchDraftChange,
  onSearchSubmit,
}: Props) {
  return (
    <div className="g2-home">
      <section className="g2-hero" aria-labelledby="g2-hero-title">
        <div className="g2-hero-copy">
          <h1 id="g2-hero-title" className="g2-hero-title">
            길드전 정답지, 같이 보면 더 쉬워요
          </h1>
          <p className="g2-hero-desc">
            수호진형 검색부터 공성전·통계·등록까지 한곳에서 확인하세요.
          </p>
          <form
            className="g2-hero-search"
            onSubmit={(e) => {
              e.preventDefault()
              onSearchSubmit()
            }}
          >
            <input
              type="search"
              className="g2-hero-input"
              placeholder="수호 영웅 이름 또는 메뉴 검색"
              value={searchDraft}
              onChange={(e) => onSearchDraftChange(e.target.value)}
              aria-label="빠른 검색"
            />
            <button type="submit" className="g2-hero-btn">
              검색
            </button>
          </form>
        </div>
        <div className="g2-hero-art" aria-hidden="true">
          <span className="g2-hero-blob g2-hero-blob--1" />
          <span className="g2-hero-blob g2-hero-blob--2" />
          <span className="g2-hero-blob g2-hero-blob--3" />
        </div>
      </section>

      <section className="g2-cat-grid" aria-label="메뉴">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            className="g2-cat-card"
            onClick={() => onSelect(c.id)}
          >
            <span className="g2-cat-title">{c.title}</span>
            <span className="g2-cat-desc">{c.desc}</span>
            {c.meta ? <span className="g2-cat-meta">{c.meta}</span> : null}
          </button>
        ))}
      </section>
    </div>
  )
}
