# Creating Demo GIFs for Your Extension

## Why You Need GIFs/Screenshots

- **Marketplace visibility**: Extensions with visuals get 5x more downloads
- **Show, don't tell**: Users understand features instantly
- **Professional appearance**: Builds trust and credibility

## What to Record

### 1. **Go to Definition Demo** (Most Important)
Show:
- Opening a `.bs` file with EJS template
- Cmd/Ctrl+Click on `"{{%- s(paletteV2.primary.orange) %}}"`
- Jumping to `descarga.json` at the exact line
- The definition highlighted

### 2. **Hover Preview Demo**
Show:
- Hovering over an EJS variable
- The popup showing the value
- The file location at the bottom

### 3. **Multiple File Types**
Show it working in:
- `.bs` file
- `.xml` file
- Different JSON files (constants.json)

## Tools to Record GIFs

### Option 1: LICEcap (Free, Simple)
- Download: https://www.cockos.com/licecap/
- Mac & Windows
- Records directly to GIF
- Lightweight and easy

### Option 2: Kap (Mac, Free, Best Quality)
- Download: https://getkap.co/
- Beautiful interface
- Exports to GIF, MP4, WebM
- Plugins for optimization

### Option 3: ScreenToGif (Windows, Free)
- Download: https://www.screentogif.com/
- Built-in editor
- Great for precise recording

### Option 4: Gifox (Mac, Paid but Great)
- Download: https://gifox.app/
- $4.99
- Menu bar app, super quick
- High quality, small file size

## Recording Tips

### Settings
- **Resolution**: 1280x720 or 1920x1080
- **Frame rate**: 15-20 fps (smooth but not huge file size)
- **Duration**: 5-15 seconds per GIF
- **File size**: Keep under 5MB per GIF

### Best Practices
1. **Clean workspace**: Close unnecessary tabs/panels
2. **Use a theme**: Light or Dark theme (consistent)
3. **Slow down**: Click deliberately, pause briefly at key moments
4. **Show cursor**: Make sure cursor is visible
5. **Highlight action**: Slow motion on the key moment
6. **Loop well**: End where it can loop naturally

### What NOT to Show
- Personal information
- Sensitive code
- Long loading times
- Errors or bugs (unless showing fixes)

## Step-by-Step Recording Guide

### Demo 1: Go to Definition

1. **Prepare**:
   - Open VSCode with your Roku project
   - Open `VideoContentModel.bs` (line 23 has `"{{%- o(CONST.Video.ratings) %}}"`)
   - Open `constants.json` in another tab (but start with focus on .bs file)
   - Start recording

2. **Record**:
   - Show the EJS template clearly in view
   - Hold cursor over the template for 1 second
   - Press Cmd/Ctrl and click on the path
   - Jump to constants.json
   - Highlight/show the definition for 2 seconds
   - Stop recording

3. **Save**: `demo-go-to-definition.gif`

### Demo 2: Hover Preview

1. **Prepare**:
   - Open same file
   - Start recording

2. **Record**:
   - Hover over `"{{%- s(paletteV2.primary.orange) %}}"`
   - Show the hover popup with value
   - Hold for 2-3 seconds so viewers can read
   - Stop recording

3. **Save**: `demo-hover-preview.gif`

## Optimizing GIFs

### Reduce File Size

**Using giflossy** (command-line):
```bash
# Install
brew install giflossy  # Mac
# or download from https://github.com/kornelski/giflossy

# Optimize
giflossy -O3 --lossy=80 input.gif -o output.gif
```

**Using ezgif.com** (online, no install):
1. Go to https://ezgif.com/optimize
2. Upload your GIF
3. Set compression level to 35-50
4. Click "Optimize GIF"
5. Download the result

**Target**: Under 5MB per GIF, ideally 2-3MB

## Adding to Your Extension

### 1. Create images folder

```bash
cd vscode-ejs-navigator
mkdir -p images/demos
```

### 2. Add your GIFs

Save your recordings:
- `images/demos/go-to-definition.gif`
- `images/demos/hover-preview.gif`
- `images/screenshot.png` (for icon/marketplace)

### 3. Update README.md

I'll create an updated README for you with image placeholders.

### 4. Update package.json for marketplace

Optional: Add screenshots for marketplace:
```json
{
  "galleryBanner": {
    "color": "#1e1e1e",
    "theme": "dark"
  }
}
```

## Quick Recording Session (15 minutes)

1. **Install Kap or LICEcap** (5 min)
2. **Record "Go to Definition"** (3 min)
3. **Record "Hover Preview"** (3 min)
4. **Optimize GIFs** (2 min)
5. **Add to extension** (2 min)

Done! Professional extension with demos. 🎥

## Example Recording Script

```
Opening VideoContentModel.bs...
[Cursor on line 23]
Here we have an EJS template referencing CONST.Video.ratings
[Cmd+Click]
And with one click, we jump directly to the definition in constants.json!
[Show the value]
```

Keep it silent (no audio needed), let the visuals speak.

## Before/After Impact

**Before** (no images):
- README: Text wall
- Marketplace: "What does this do?"
- Downloads: Low

**After** (with GIFs):
- README: Clear, visual
- Marketplace: "I need this!"
- Downloads: High

## Need Help?

If you want, you can:
1. Record a screen recording with QuickTime (Mac) or Windows Game Bar
2. Send me the video
3. I can guide you on converting it to GIF

Or use a service like CloudApp or Loom and share the link!
