"""
INTERIO — App Icon Generator v3
Concept: a clean front-view armchair with an AR scanner overlay on top.
Reads immediately as "AR interior / furniture scanning".
"""

from PIL import Image, ImageDraw
import numpy as np, os

SIZE = 1024

# ── Brand palette ──────────────────────────────────────────
BG_INNER  = np.array([96,  88, 240])    # #6058f0
BG_OUTER  = np.array([28,  22, 100])    # #1c1664
C_WHITE   = (255, 255, 255, 255)
C_ARM     = (238, 234, 255, 255)        # slightly violet – arm/seat surfaces
C_TEAL    = (42,  181, 170)             # #2ab5aa


# ══════════════════════════════════════════════════════════
#  BACKGROUND — radial gradient
# ══════════════════════════════════════════════════════════
def make_background() -> Image.Image:
    y_px, x_px = np.mgrid[0:SIZE, 0:SIZE]
    dist = np.sqrt((x_px - SIZE * .5) ** 2 + (y_px - SIZE * .38) ** 2)
    t    = np.clip(dist / (SIZE * .75), 0, 1)
    r = (BG_INNER[0]*(1-t) + BG_OUTER[0]*t).clip(0,255).astype(np.uint8)
    g = (BG_INNER[1]*(1-t) + BG_OUTER[1]*t).clip(0,255).astype(np.uint8)
    b = (BG_INNER[2]*(1-t) + BG_OUTER[2]*t).clip(0,255).astype(np.uint8)
    a = np.full((SIZE, SIZE), 255, dtype=np.uint8)
    return Image.fromarray(np.stack([r, g, b, a], axis=-1))


# ══════════════════════════════════════════════════════════
#  CHAIR — clean front-view armchair
#
#  Silhouette:
#       ┌──────────────┐          ← back rest (tall, white)
#       │              │
#  ┌────┘              └────┐     ← arm protrusion (wider, off-white)
#  │        seat            │
#  └─┐                   ┌──┘
#    │                   │        ← legs (thin)
# ══════════════════════════════════════════════════════════
def draw_chair(draw: ImageDraw.ImageDraw) -> None:
    # Back rest
    BL, BR = 340, 684          # x: 344 px wide
    BT, BB = 240, 634          # y: 394 px tall
    # Seat + arms (wider, overlaps lower part of back)
    SL, SR = 238, 786          # x: 548 px wide
    ST, SB = 520, 720          # y: arm top to seat bottom
    # Legs
    LT, LB = 720, 790

    R_BACK = 22   # back corner radius
    R_SEAT = 22   # seat/arm corner radius

    # ── Draw seat + arms (slightly warm white) first ──────
    draw.rounded_rectangle([SL, ST, SR, SB], radius=R_SEAT, fill=C_ARM)

    # ── Seat cushion on top (pure white, slightly inset) ──
    PAD = 18
    draw.rounded_rectangle([SL + PAD, ST + 50, SR - PAD, SB - 8],
                            radius=14, fill=C_WHITE)

    # ── Back rest (pure white, drawn on top) ──────────────
    draw.rounded_rectangle([BL, BT, BR, BB], radius=R_BACK, fill=C_WHITE)

    # ── Thin arm-top edge lines (visual depth) ─────────────
    line_col = (200, 194, 255, 140)
    # left arm top edge
    draw.rectangle([SL + 8, ST, SL + 80, ST + 3], fill=line_col)
    # right arm top edge
    draw.rectangle([SR - 80, ST, SR - 8, ST + 3], fill=line_col)

    # ── Legs ──────────────────────────────────────────────
    leg_col = (230, 226, 255, 255)
    leg_w   = 22
    for lx in [SL + 28, SR - 28 - leg_w]:
        draw.rounded_rectangle([lx, LT, lx + leg_w, LB], radius=6, fill=leg_col)


# ══════════════════════════════════════════════════════════
#  AR SCANNER — brackets + horizontal scan beam
# ══════════════════════════════════════════════════════════
def draw_scanner(img: Image.Image) -> Image.Image:
    draw = ImageDraw.Draw(img)

    # Scanner box (framing the chair with padding)
    PAD   = 36
    SX0   = 238 - PAD    # 202
    SX1   = 786 + PAD    # 822
    SY0   = 240 - PAD    # 204
    SY1   = 790 + PAD    # 826

    BL    = 52   # bracket arm length
    BW    = 8    # bracket stroke width
    TCOL  = (*C_TEAL, 220)

    def l_bracket(x, y, dx, dy):
        """Draw an L bracket. dx/dy are +1 or -1 for direction."""
        x0h, x1h = sorted([x, x + dx * BL])
        draw.rectangle([x0h, y - BW//2, x1h, y + BW//2], fill=TCOL)
        y0v, y1v = sorted([y, y + dy * BL])
        draw.rectangle([x - BW//2, y0v, x + BW//2, y1v], fill=TCOL)

    l_bracket(SX0, SY0, +1, +1)   # top-left
    l_bracket(SX1, SY0, -1, +1)   # top-right
    l_bracket(SX0, SY1, +1, -1)   # bottom-left
    l_bracket(SX1, SY1, -1, -1)   # bottom-right

    # ── Horizontal scan beam (sweeping across mid-chair) ──
    SCAN_Y = 430    # crosses mid-back of the chair

    # Build a horizontal teal gradient band using numpy
    width  = SX1 - SX0          # 620 px
    height = 18
    band   = np.zeros((height, width, 4), dtype=np.uint8)

    # Horizontal fade: bright teal in centre, transparent at edges
    xs = np.linspace(0, 1, width)
    fade = np.sin(xs * np.pi) ** 0.5     # smooth fade in/out

    band[:, :, 0] = C_TEAL[0]
    band[:, :, 1] = C_TEAL[1]
    band[:, :, 2] = C_TEAL[2]

    # Vertical brightness: brightest in the middle row
    ys = np.linspace(0, 1, height)
    v_fade = np.sin(ys * np.pi) ** 0.6
    alpha  = (fade[np.newaxis, :] * v_fade[:, np.newaxis] * 195).astype(np.uint8)
    band[:, :, 3] = alpha

    beam = Image.fromarray(band, 'RGBA')
    img  = img.convert('RGBA')
    img.paste(beam, (SX0, SCAN_Y - height // 2), beam)

    # Bright centre line of the beam
    draw = ImageDraw.Draw(img)
    draw.rectangle([SX0 + 20, SCAN_Y - 1, SX1 - 20, SCAN_Y + 1],
                   fill=(*C_TEAL, 200))

    # ── Small scan corner dots ─────────────────────────────
    dot_r = 7
    for x, y in [(SX0, SY0), (SX1, SY0), (SX0, SY1), (SX1, SY1)]:
        draw.ellipse([x - dot_r, y - dot_r, x + dot_r, y + dot_r],
                     fill=(*C_TEAL, 235))

    return img


# ══════════════════════════════════════════════════════════
#  ASSEMBLE
# ══════════════════════════════════════════════════════════
def build_icon() -> Image.Image:
    img  = make_background()
    draw = ImageDraw.Draw(img)
    draw_chair(draw)
    img  = draw_scanner(img)
    return img


# ══════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════
if __name__ == "__main__":
    base = os.path.join(os.path.dirname(__file__), "..", "assets", "images")
    os.makedirs(base, exist_ok=True)

    print("Building INTERIO icon v3 …")
    icon_rgba = build_icon()

    # Flatten to RGB
    bg_col = tuple(BG_OUTER.tolist())
    icon_rgb = Image.new("RGB", (SIZE, SIZE), bg_col)
    icon_rgb.paste(icon_rgba, mask=icon_rgba.split()[3])

    for name, img in [
        ("icon.png",          icon_rgb),
        ("favicon.png",       icon_rgb.resize((48, 48), Image.LANCZOS)),
    ]:
        p = os.path.join(base, name)
        img.save(p, "PNG")
        print(f"  ✓  {p}")

    # Adaptive icon — transparent bg, foreground elements only
    adp = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    adp_draw = ImageDraw.Draw(adp)
    draw_chair(adp_draw)
    adp = draw_scanner(adp)
    p = os.path.join(base, "adaptive-icon.png")
    adp.save(p, "PNG")
    print(f"  ✓  {p}")

    # Splash
    p = os.path.join(base, "splash-icon.png")
    icon_rgba.resize((512, 512), Image.LANCZOS).save(p, "PNG")
    print(f"  ✓  {p}")

    print("\nDone!")
