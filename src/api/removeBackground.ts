/**
 * Remove the background from a poster image using the Clipdrop API.
 * Falls back to null (no foreground layer) if no API key is configured.
 */
export async function removeBackground(imageUrl: string): Promise<string | null> {
  const apiKey = import.meta.env.VITE_CLIPDROP_API_KEY;

  if (!apiKey) {
    console.log('No VITE_CLIPDROP_API_KEY set — skipping background removal');
    return null;
  }

  try {
    // Fetch the poster image as a blob
    const imageRes = await fetch(imageUrl);
    const imageBlob = await imageRes.blob();

    const formData = new FormData();
    formData.append('image_file', imageBlob, 'poster.jpg');

    const res = await fetch('https://clipdrop-api.co/remove-background/v1', {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
      body: formData,
    });

    if (!res.ok) {
      console.error('Clipdrop API error:', res.status);
      return null;
    }

    const resultBlob = await res.blob();
    return URL.createObjectURL(resultBlob);
  } catch (err) {
    console.error('Background removal failed:', err);
    return null;
  }
}
