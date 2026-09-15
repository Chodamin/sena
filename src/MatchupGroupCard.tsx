import { LoadoutSelectField } from './LoadoutSelectField.tsx'
import { HeroPortraitStrip } from './HeroPortraitStrip.tsx'
import { EQUIPMENT_OPTIONS, FORMATION_OPTIONS } from './lib/matchupLoadoutOptions.ts'
import type { MatchupRow } from './types/matchup.ts'

export type MatchupGroup = {
  groupId: string
  header: MatchupRow
  strategies: MatchupRow[]
}

type Props = {
  group: MatchupGroup
  portraitUrlByKey: Record<string, string>
  editingId: number | null
  editSkillOrder: string
  editPet: string
  editEquipment1: string
  editEquipment2: string
  editEquipment3: string
  editFormation1: string
  editFormation2: string
  editFormation3: string
  editNotes: string
  editErr: string | null
  editBusy: boolean
  isAdmin: boolean
  deleteBusyId: number | null
  onStartEdit: (m: MatchupRow) => void
  onCancelEdit: () => void
  onSaveEdit: (id: number) => void
  onDelete: (id: number) => void
  onVote: (id: number, outcome: 'win' | 'lose') => void
  onEditSkillOrderChange: (value: string) => void
  onEditPetChange: (value: string) => void
  onEditEquipment1Change: (value: string) => void
  onEditEquipment2Change: (value: string) => void
  onEditEquipment3Change: (value: string) => void
  onEditFormation1Change: (value: string) => void
  onEditFormation2Change: (value: string) => void
  onEditFormation3Change: (value: string) => void
  onEditNotesChange: (value: string) => void
  onToggleRecommend?: (id: number, currentStatus: boolean) => void
}

function formatDateYmdSeoul(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) {
    const s = iso.trim()
    return s.length >= 10 ? s.slice(0, 10) : s
  }
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(t))
}

function matchupDateCaption(m: MatchupRow): string | null {
  const c = m.created_at?.trim()
  const u = m.updated_at?.trim()
  if (!c && !u) return null
  if (!c || !u) {
    return `등록일자 : ${formatDateYmdSeoul(c || u || '')}`
  }
  const ct = new Date(c).getTime()
  const ut = new Date(u).getTime()
  if (ut > ct) {
    return `수정일자 : ${formatDateYmdSeoul(u)}`
  }
  return `등록일자 : ${formatDateYmdSeoul(c)}`
}

function winRatePct(win: number, lose: number): string {
  const t = Number(win) + Number(lose)
  if (t <= 0) return '—'
  return `${Math.round((Number(win) / t) * 100)}%`
}

function splitTeamLabel(label: string): string[] {
  return label
    .split(/\s*\/\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function MatchupGroupCard({
  group: g,
  portraitUrlByKey,
  editingId,
  editSkillOrder,
  editPet,
  editEquipment1,
  editEquipment2,
  editEquipment3,
  editFormation1,
  editFormation2,
  editFormation3,
  editNotes,
  editErr,
  editBusy,
  isAdmin,
  deleteBusyId,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onVote,
  onEditSkillOrderChange,
  onEditPetChange,
  onEditEquipment1Change,
  onEditEquipment2Change,
  onEditEquipment3Change,
  onEditFormation1Change,
  onEditFormation2Change,
  onEditFormation3Change,
  onEditNotesChange,
  onToggleRecommend,
}: Props) {
  const h = g.header
  const sumW = g.strategies.reduce((s, x) => s + x.win, 0)
  const sumL = g.strategies.reduce((s, x) => s + x.lose, 0)

  // 해당 그룹(또는 헤더)에 추천 설정이 되어 있는지 확인
  const isRecommendedGroup = h.is_recommended || g.strategies.some((x) => x.is_recommended)

  return (
    <article className={isRecommendedGroup ? 'guide-match-card guide-match-card--recommended' : 'guide-match-card'}>
      {/* 🌟 1. 맨 위 상단 단독 추천 뱃지 라인 */}
      {isRecommendedGroup && (
        <div style={{ marginBottom: '0.6rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              padding: '3px 9px',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
            }}
          >
            ⭐ 추천 공략
          </span>
        </div>
      )}

      {/* 2. 기존 초상화 및 덱 정보들 (자연스럽게 한 칸 아래로 배치됨) */}
      <div className="guide-match-head">
        <div className="guide-match-lines">
          <div className="guide-line guide-line--portraits">
            <span className="guide-badge-vs">VS</span>
            <HeroPortraitStrip
              names={[h.defense1, h.defense2, h.defense3]}
              portraitUrlByKey={portraitUrlByKey}
            />
          </div>
          <div className="guide-line guide-line--portraits">
            <span className="guide-badge-atk">ATK</span>
            <HeroPortraitStrip
              names={[h.attack1, h.attack2, h.attack3]}
              portraitUrlByKey={portraitUrlByKey}
            />
          </div>
          {h.pet.trim() ? (
            <div className="guide-line guide-line--portraits">
              <span className="guide-badge-pet">펫</span>
              <HeroPortraitStrip
                names={splitTeamLabel(h.pet)}
                portraitUrlByKey={portraitUrlByKey}
                fixedColumns={3}
              />
            </div>
          ) : null}
          {h.equipment.trim() ? (
            <div className="guide-line guide-line--portraits">
              <span className="guide-badge-equipment">장비</span>
              <HeroPortraitStrip
                names={splitTeamLabel(h.equipment)}
                portraitUrlByKey={portraitUrlByKey}
                fixedColumns={3}
              />
            </div>
          ) : null}
          {h.formation.trim() ? (
            <div className="guide-line guide-line--portraits">
              <span className="guide-badge-formation">진형</span>
              <HeroPortraitStrip
                names={splitTeamLabel(h.formation)}
                portraitUrlByKey={portraitUrlByKey}
                fixedColumns={3}
              />
            </div>
          ) : null}
        </div>
        <span className="guide-rate-pill">승률 {winRatePct(sumW, sumL)}</span>
      </div>
      {g.strategies.map((m, idx) => {
        const dateCaption = matchupDateCaption(m)
        return (
          <div
            key={m.id}
            className={
              idx === 0
                ? 'guide-match-strategy'
                : 'guide-match-strategy guide-match-strategy--follow'
            }
          >
            <div className="guide-match-body">
              {editingId === m.id ? (
                <>
                  <div className="field" style={{ marginBottom: '0.5rem' }}>
                    <label htmlFor={`edit-skill-${m.id}`}>스킬</label>
                    <input
                      id={`edit-skill-${m.id}`}
                      className="field-input"
                      value={editSkillOrder}
                      onChange={(e) => onEditSkillOrderChange(e.target.value)}
                      placeholder="예: 라드1 -> 손오공2"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`edit-pet-${m.id}`}>펫</label>
                    <input
                      id={`edit-pet-${m.id}`}
                      className="field-input"
                      value={editPet}
                      onChange={(e) => onEditPetChange(e.target.value)}
                      placeholder="예: 델프 / 라드 / (슬래시로 구분)"
                    />
                  </div>
                  <div className="guide-register-grid" style={{ marginTop: '0.5rem' }}>
                    <LoadoutSelectField
                      id={`edit-eq1-${m.id}`}
                      label="장비1"
                      value={editEquipment1}
                      onChange={onEditEquipment1Change}
                      options={EQUIPMENT_OPTIONS}
                    />
                    <LoadoutSelectField
                      id={`edit-eq2-${m.id}`}
                      label="장비2"
                      value={editEquipment2}
                      onChange={onEditEquipment2Change}
                      options={EQUIPMENT_OPTIONS}
                    />
                    <LoadoutSelectField
                      id={`edit-eq3-${m.id}`}
                      label="장비3"
                      value={editEquipment3}
                      onChange={onEditEquipment3Change}
                      options={EQUIPMENT_OPTIONS}
                    />
                  </div>
                  <div className="guide-register-grid" style={{ marginTop: '0.5rem' }}>
                    <LoadoutSelectField
                      id={`edit-fm1-${m.id}`}
                      label="진형1"
                      value={editFormation1}
                      onChange={onEditFormation1Change}
                      options={FORMATION_OPTIONS}
                    />
                    <LoadoutSelectField
                      id={`edit-fm2-${m.id}`}
                      label="진형2"
                      value={editFormation2}
                      onChange={onEditFormation2Change}
                      options={FORMATION_OPTIONS}
                    />
                    <LoadoutSelectField
                      id={`edit-fm3-${m.id}`}
                      label="진형3"
                      value={editFormation3}
                      onChange={onEditFormation3Change}
                      options={FORMATION_OPTIONS}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`edit-notes-${m.id}`}>테스트 코멘트</label>
                    <textarea
                      id={`edit-notes-${m.id}`}
                      className="guide-textarea"
                      value={editNotes}
                      onChange={(e) => onEditNotesChange(e.target.value)}
                      placeholder="코멘트 입력"
                    />
                  </div>
                  {editErr ? (
                    <p className="form-error" role="alert">
                      {editErr}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  {m.skill_order ? (
                    <p className="guide-skill">⚡ 스킬: {m.skill_order}</p>
                  ) : null}
                  {m.notes ? (
                    <p className="guide-notes">{m.notes}</p>
                  ) : (
                    <p className="guide-notes" style={{ color: '#92400e' }}>
                      코멘트 없음
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="guide-match-actions">
              {/* 관리자 계정일 때만 보이는 추천 토글 버튼 */}
              {isAdmin && onToggleRecommend && (
                <button
                  type="button"
                  className="guide-btn-ghost"
                  style={{
                    color: m.is_recommended ? '#f59e0b' : '#9ca3af',
                    fontWeight: m.is_recommended ? 'bold' : 'normal',
                  }}
                  onClick={() => onToggleRecommend(m.id, Boolean(m.is_recommended))}
                  title={m.is_recommended ? '추천 공략 해제' : '추천 공략으로 지정'}
                >
                  {m.is_recommended ? '⭐ 추천 해제' : '☆ 추천 지정'}
                </button>
              )}

              {editingId === m.id ? (
                <>
                  <button
                    type="button"
                    className="guide-btn-ghost"
                    disabled={editBusy}
                    onClick={() => void onSaveEdit(m.id)}
                  >
                    {editBusy ? '저장 중…' : '저장'}
                  </button>
                  <button
                    type="button"
                    className="guide-btn-ghost"
                    disabled={editBusy}
                    onClick={onCancelEdit}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="guide-btn-ghost"
                    onClick={() => onStartEdit(m)}
                  >
                    수정
                  </button>
                  {isAdmin ? (
                    <button
                      type="button"
                      className="guide-btn-ghost"
                      disabled={deleteBusyId === m.id}
                      onClick={() => void onDelete(m.id)}
                    >
                      {deleteBusyId === m.id ? '삭제 중…' : '삭제'}
                    </button>
                  ) : null}
                </>
              )}
            </div>
            <div className="guide-vote-row">
              <button
                type="button"
                className="guide-vote-win"
                onClick={() => void onVote(m.id, 'win')}
              >
                👍 승리
              </button>
              <button
                type="button"
                className="guide-vote-lose"
                onClick={() => void onVote(m.id, 'lose')}
              >
                👎 패배
              </button>
            </div>
            <footer className="guide-match-foot">
              {dateCaption ? (
                <div className="guide-match-foot-date">{dateCaption}</div>
              ) : null}
              <div className="guide-match-foot-row">
                <span>
                  {m.win}승 {m.lose}패
                </span>
                <span>
                  By{' '}
                  {m.author_name ||
                    m.author_username ||
                    `user-${m.author_id.slice(0, 8)}`}
                </span>
              </div>
            </footer>
          </div>
        )
      })}
    </article>
  )
}

export function matchupsToRegistrationGroups(rows: MatchupRow[]): MatchupGroup[] {
  return rows.map((m) => ({
    groupId: `my-${m.id}`,
    header: m,
    strategies: [m],
  }))
}
