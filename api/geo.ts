export default function handler(req: any, res: any) {
    // Vercel automatically adds this header to requests
    const country = req.headers['x-vercel-ip-country'] || 'US';

    // Cache for 24 hours (86400 seconds)
    // stale-while-revalidate allows serving stale content while updating in background
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

    return res.status(200).json({
        country_code: country,
        source: 'vercel-edge'
    });
}
