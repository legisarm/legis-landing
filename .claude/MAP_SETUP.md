# Map Setup Guide

## Overview

The admin panel uses MapLibre GL for interactive maps with three view modes: Streets, Satellite, and Terrain.

## Map Tile Providers

The map supports two configurations:

### 1. With MapTiler API Key (Recommended)
- **Best quality** street, satellite, and terrain maps
- Free tier: 100,000 map loads/month
- Professional cartography and regular updates
- Worldwide coverage with detailed labels

### 2. Without API Key (Fallback)
- Uses free open-source tiles:
  - **Streets**: OpenStreetMap tiles
  - **Satellite**: Esri World Imagery
  - **Terrain**: OpenTopoMap
- No API key required
- Good quality but fewer features

## Getting a MapTiler API Key (Free)

### Step 1: Sign Up
1. Go to [https://cloud.maptiler.com/](https://cloud.maptiler.com/)
2. Click "Sign up for free"
3. Register with your email or GitHub account

### Step 2: Get Your API Key
1. After signing in, you'll be on the dashboard
2. Your API key is displayed prominently on the home page
3. Or navigate to "Account" → "API Keys"
4. Copy your default API key

### Step 3: Add to Your Project
1. Open `.env.local` in your project root
2. Add your API key:
   ```
   NEXT_PUBLIC_MAPTILER_API_KEY=your_api_key_here
   ```
3. Save the file
4. Restart your dev server if running

## Map Features

### Style Switcher
Located in the top-left corner of the map, allows switching between:
- **Streets** - Road maps with labels, buildings, and POIs
- **Satellite** - Aerial/satellite imagery with labels overlay
- **Terrain** - Topographic maps showing elevation and terrain

### Location Selection
Three ways to select a location:
1. **Click** on the map → Marker moves to clicked position
2. **Drag** the red marker → Move to exact position
3. **Search** for a place → Select from search results

### Automatic Address Population
When you select a location, these fields auto-fill:
- Latitude
- Longitude
- Country
- Region/Province
- City/Town
- Full Address

### Navigation Controls
- **Zoom** buttons (top-right)
- **Compass** for rotation
- **Fullscreen** toggle
- Mouse wheel for zoom
- Click and drag to pan

## Technical Details

### Map Styles

**With API Key:**
```typescript
streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`
satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${API_KEY}`
terrain: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${API_KEY}`
```

**Without API Key (Fallback):**
```typescript
streets: OpenStreetMap raster tiles
satellite: Esri World Imagery raster tiles
terrain: OpenTopoMap raster tiles
```

### Geocoding Service
Uses OpenStreetMap Nominatim API (free, no key required):
- **Forward geocoding**: Place name → Coordinates
- **Reverse geocoding**: Coordinates → Address
- Rate limit: 1 request/second (handled by UI interaction)

## Usage Limits

### MapTiler Free Tier
- 100,000 map tile requests/month
- Sufficient for most admin panels
- View usage in MapTiler dashboard
- Upgrade to paid plan if needed

### Nominatim (Geocoding)
- Fair use policy (1 req/sec)
- No hard limits for reasonable use
- Consider hosting your own Nominatim instance for heavy usage

## Troubleshooting

### Map not showing styles
- **Check API key**: Verify `NEXT_PUBLIC_MAPTILER_API_KEY` in `.env.local`
- **Restart server**: Environment variables require restart
- **Check console**: Look for network errors
- **Fallback works**: Map will show OSM tiles if API key is invalid

### Search not working
- **Check internet**: Nominatim requires internet connection
- **Check console**: Look for CORS or network errors
- **Rate limiting**: Wait a second between searches

### Marker not updating
- **Check coordinates**: Ensure valid lat/lng values
- **Check form**: Verify form.watch() is working
- **Re-render**: Try changing tabs and coming back

## Best Practices

### 1. Always Use API Key in Production
- Better map quality
- More reliable service
- Professional appearance
- Regular updates

### 2. Monitor Usage
- Check MapTiler dashboard monthly
- Set up usage alerts
- Upgrade plan if approaching limit

### 3. Cache Coordinates
- Don't re-geocode on every render
- Store coordinates in database
- Only geocode when location changes

### 4. Handle Errors Gracefully
- Check for network failures
- Provide fallback behavior
- Show user-friendly error messages

## Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=https://api.arm-heritage-map.click

# Optional but recommended
NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key_here
```

## Support

### MapTiler
- Documentation: https://docs.maptiler.com/
- Support: https://support.maptiler.com/
- Community: https://github.com/maptiler

### MapLibre GL
- Documentation: https://maplibre.org/maplibre-gl-js/docs/
- Examples: https://maplibre.org/maplibre-gl-js/docs/examples/
- GitHub: https://github.com/maplibre/maplibre-gl-js

### Nominatim (Geocoding)
- Documentation: https://nominatim.org/release-docs/latest/
- Usage Policy: https://operations.osmfoundation.org/policies/nominatim/
