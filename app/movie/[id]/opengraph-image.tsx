import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';
import type { Movie } from '@/types';

export const dynamic = 'force-dynamic';
export const alt = 'Cinelog — Movie Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [instrumentSerifData, dmSansData] = await Promise.all([
    fetch(
      'https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-2zI.ttf'
    ).then((res) => res.arrayBuffer()),
    fetch(
      'https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhTg.ttf'
    ).then((res) => res.arrayBuffer()),
  ]);

  let title = 'Movie';
  let posterUrl = '';
  let rating = 0;
  let ratingPartner: number | null = null;
  let year = '';

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('log_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      const row = data as unknown as {
        movie_data: Movie;
        rating: number;
        rating_partner: number | null;
      };
      title = row.movie_data?.title ?? 'Movie';
      if (row.movie_data?.poster_path) {
        posterUrl = `https://image.tmdb.org/t/p/w500${row.movie_data.poster_path}`;
      }
      rating = row.rating;
      ratingPartner = row.rating_partner;
      if (row.movie_data?.release_date) {
        year = row.movie_data.release_date.slice(0, 4);
      }
    }
  } catch {
    // fallback
  }

  const avgRating =
    ratingPartner != null
      ? ((rating + ratingPartner) / 2).toFixed(1)
      : rating.toFixed(1);

  // Generate dot-based rating display (5 dots for 0-10 scale)
  const filled = Math.round(Number(avgRating) / 2);
  const dots = Array.from({ length: 5 }, (_, i) => i < filled);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background blur poster */}
        {posterUrl && (
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '-40px',
              right: '-40px',
              bottom: '-40px',
              display: 'flex',
              opacity: 0.15,
            }}
          >
            <img
              src={posterUrl}
              width={1280}
              height={710}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.7) 50%, rgba(26,26,26,0.95) 100%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            padding: '48px 56px',
            position: 'relative',
            alignItems: 'center',
            gap: '48px',
          }}
        >
          {/* Poster */}
          {posterUrl && (
            <div
              style={{
                display: 'flex',
                width: '320px',
                height: '480px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={posterUrl}
                width={320}
                height={480}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          )}

          {/* Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              gap: '8px',
            }}
          >
            {/* Cinelog badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#c45d3e',
                  marginRight: '10px',
                  display: 'flex',
                }}
              />
              <span
                style={{
                  fontFamily: 'DM Sans',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Cinelog
              </span>
            </div>

            {/* Title */}
            <span
              style={{
                fontFamily: 'Instrument Serif',
                fontSize: title.length > 30 ? '48px' : '60px',
                color: '#ffffff',
                lineHeight: 1.1,
              }}
            >
              {title}
            </span>

            {/* Year */}
            {year && (
              <span
                style={{
                  fontFamily: 'DM Sans',
                  fontSize: '20px',
                  color: 'rgba(255,255,255,0.45)',
                  marginTop: '4px',
                }}
              >
                {year}
              </span>
            )}

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                width: '48px',
                height: '2px',
                background: '#c45d3e',
                marginTop: '16px',
                marginBottom: '16px',
              }}
            />

            {/* Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Instrument Serif',
                  fontSize: '56px',
                  color: '#c45d3e',
                  lineHeight: 1,
                }}
              >
                {avgRating}
              </span>
              <span
                style={{
                  fontFamily: 'DM Sans',
                  fontSize: '18px',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                / 10
              </span>
            </div>

            {/* Rating dots */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {dots.map((isFilled, i) => (
                <div
                  key={i}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isFilled ? '#c45d3e' : 'rgba(255,255,255,0.15)',
                    display: 'flex',
                  }}
                />
              ))}
            </div>

            {/* Individual ratings */}
            {ratingPartner != null && (
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  marginTop: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'DM Sans',
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  Him: {rating.toFixed(1)}
                </span>
                <span
                  style={{
                    fontFamily: 'DM Sans',
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  Her: {ratingPartner.toFixed(1)}
                </span>
              </div>
            )}
          </div>
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
