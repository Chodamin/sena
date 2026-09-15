export type MatchupRow = {
  id: number
  matchup_group_id: string
  defense1: string
  defense2: string
  defense3: string
  attack1: string
  attack2: string
  attack3: string
  pet: string
  equipment?: string
  formation?: string
  skill_order: string
  notes: string
  win: number
  lose: number
  author_id: string
  author_name?: string
  author_username?: string
  created_at?: string
  updated_at?: string
  is_recommended?: boolean
}
