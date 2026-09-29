-- 028에서 재정의된 search_matchups에 장비·진형과 최신 메타데이터를 복원
DROP FUNCTION IF EXISTS public.search_matchups(TEXT, TEXT, TEXT, TEXT[]);

CREATE OR REPLACE FUNCTION public.search_matchups(
  p_d1 TEXT,
  p_d2 TEXT,
  p_d3 TEXT,
  p_exclude TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS TABLE (
  id BIGINT,
  matchup_group_id UUID,
  defense1 TEXT,
  defense2 TEXT,
  defense3 TEXT,
  attack1 TEXT,
  attack2 TEXT,
  attack3 TEXT,
  pet TEXT,
  equipment TEXT,
  formation TEXT,
  skill_order TEXT,
  notes TEXT,
  win INTEGER,
  lose INTEGER,
  author_id UUID,
  author_name TEXT,
  author_username TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  is_recommended BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.matchup_group_id,
    m.defense1,
    m.defense2,
    m.defense3,
    m.attack1,
    m.attack2,
    m.attack3,
    m.pet,
    m.equipment,
    m.formation,
    m.skill_order,
    m.notes,
    m.win,
    m.lose,
    m.author_id,
    p.display_name,
    p.username,
    m.created_at,
    m.updated_at,
    m.is_recommended
  FROM public.matchups m
  JOIN public.profiles p ON p.id = m.author_id
  WHERE
    (p_d1 IS NULL OR TRIM(p_d1) = '' OR (
      m.defense1 ILIKE '%' || TRIM(p_d1) || '%'
      OR m.defense2 ILIKE '%' || TRIM(p_d1) || '%'
      OR m.defense3 ILIKE '%' || TRIM(p_d1) || '%'
    ))
    AND (p_d2 IS NULL OR TRIM(p_d2) = '' OR (
      m.defense1 ILIKE '%' || TRIM(p_d2) || '%'
      OR m.defense2 ILIKE '%' || TRIM(p_d2) || '%'
      OR m.defense3 ILIKE '%' || TRIM(p_d2) || '%'
    ))
    AND (p_d3 IS NULL OR TRIM(p_d3) = '' OR (
      m.defense1 ILIKE '%' || TRIM(p_d3) || '%'
      OR m.defense2 ILIKE '%' || TRIM(p_d3) || '%'
      OR m.defense3 ILIKE '%' || TRIM(p_d3) || '%'
    ))
    AND NOT EXISTS (
      SELECT 1
      FROM unnest(COALESCE(p_exclude, ARRAY[]::TEXT[])) AS ex(term)
      WHERE TRIM(term) <> ''
        AND (
          m.attack1 ILIKE '%' || TRIM(term) || '%'
          OR m.attack2 ILIKE '%' || TRIM(term) || '%'
          OR m.attack3 ILIKE '%' || TRIM(term) || '%'
        )
    )
  ORDER BY m.is_recommended DESC, m.matchup_group_id, m.id ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_matchups(TEXT, TEXT, TEXT, TEXT[]) TO anon;
