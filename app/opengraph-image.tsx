import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';
import type { Movie } from '@/types';

export const dynamic = 'force-dynamic';
export const alt = 'Cinelog — 2026 Movie Journal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [instrumentSerifData, dmSansData] = await Promise.all([
    fetch(
      'https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-2zI.ttf'
    ).then((res) => res.arrayBuffer()),
    fetch(
      'https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhTg.ttf'
    ).then((res) => res.arrayBuffer()),
  ]);

  let posters: string[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('log_entries')
      .select('movie_data')
      .order('watched_at', { ascending: false, nullsFirst: false })
      .order('logged_at', { ascending: false })
      .limit(6);

    if (data) {
      posters = (data as unknown as { movie_data: Movie }[])
        .map((r) => r.movie_data?.poster_path)
        .filter(Boolean)
        .map((p) => `https://image.tmdb.org/t/p/w342${p}`);
    }
  } catch {
    // fallback to no posters
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#f6f4f0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grain overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(196,93,62,0.08) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Left side - Title area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 56px',
            width: '460px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#c45d3e',
                marginRight: '12px',
                display: 'flex',
              }}
            />
            <span
              style={{
                fontFamily: 'DM Sans',
                fontSize: '14px',
                color: '#8a8580',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Movie Journal
            </span>
          </div>

          <span
            style={{
              fontFamily: 'Instrument Serif',
              fontSize: '72px',
              color: '#1a1a1a',
              lineHeight: 1,
              marginBottom: '20px',
            }}
          >
            Cinelog
          </span>

          <span
            style={{
              fontFamily: 'DM Sans',
              fontSize: '20px',
              color: '#8a8580',
              lineHeight: 1.5,
            }}
          >
            Films we watched in cinema in 2026
          </span>

          <div
            style={{
              display: 'flex',
              marginTop: '32px',
              width: '48px',
              height: '2px',
              background: '#c45d3e',
            }}
          />
        </div>

        {/* Right side - Movie posters grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '40px 40px 40px 0',
            flex: 1,
          }}
        >
          {posters.slice(0, 6).map((src, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: '200px',
                height: '270px',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                transform: i % 2 === 0 ? 'rotate(-1.5deg)' : 'rotate(1.5deg)',
              }}
            >
              <img
                src={src}
                width={200}
                height={270}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Instrument Serif',
          data: instrumentSerifData,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'DM Sans',
          data: dmSansData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
