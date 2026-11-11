# Blinkies

A blinkie is a tiny animated GIF badge, classically 150×20, used on personal sites since the Geocities/MySpace era. We use them in the corners and keep every maker's credit.

## Archives worth browsing

| Site                                                                              | What's there                                                                                | Notes                                                               |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [blinkie.world](https://blinkie.world/home)                                       | Large credited collection, sorted by colour, topic and aesthetic, plus scene/emo categories | Best first stop. Every entry shows its maker. Where ours came from. |
| [blinkies.cafe archive](https://blinkies.cafe/archive)                            | Originals drawn by blinkies.cafe plus archived web blinkies, with source links              | Their generator makes custom-text blinkies from those templates.    |
| [blinki.es](https://blinki.es/emo)                                                | Topic pages, emo among them                                                                 | Smaller, still usable.                                              |
| [Pixel Moondust](https://pixelmoondust.neocities.org/collected/blinkiecollection) | Curated collection, including a "larger" section                                            | Neocities personal archive.                                         |
| [Adrian's Blinkie Collection](https://adriansblinkiecollection.neocities.org/)    | Blinkies, stamps, buttons, userbars, dividers                                               | Heavy pages; give them a second to load. Offers a full download.    |
| [y2k.neocities.org](https://y2k.neocities.org/blinkies)                           | Y2K-flavoured set                                                                           | Small and neat.                                                     |
| [blinkiecollecti0n](https://blinkiecollecti0n.neocities.org/)                     | Sorted by hobby, food, animals, anime, music, pride, info                                   | Good for topic-specific badges.                                     |
| [Caitsith's collection](https://caitsith.neocities.org/blinkiecollection)         | Over a thousand, including non-150×20                                                       | Credit appreciated, not required.                                   |

Most Neocities archives are personal and will change or vanish. Download what you use.

## Rules for this repo

1. **Self-host, never hotlink.** Download the GIF into `public/<you>/media/blinkies/` with a lowercase-dashed filename (`emo-music-fan.gif`). A dead third-party host must not be able to break a page.
2. **Credit the maker.** Put `Credit: <maker>, via <site>` in the image's `title` attribute, and keep a short credit line near the images.
3. **Verify it is a real GIF** before committing: `file blinkie.gif` should say `GIF image data, version 89a`. Check it animates with `ffprobe -count_frames`.
4. **Normalise the height in CSS**, not the file: `height: 20px; width: auto; image-rendering: pixelated`. Double-size blinkies (300×40) then render at the right physical size and stay crisp.
5. **Keep them small.** They are usually 1–40 kB. If one is over ~150 kB, pick another.
6. **Alt text is the blinkie's own text**, so a screen reader gets "EMO MUSIC FAN" rather than "image".

## Adding one

```html
<img
  src="media/blinkies/emo.gif"
  alt="EMO"
  title="Credit: Emocowboy, via blinkie.world"
  width="150"
  height="20"
/>
```

Then append the maker to the credit line in the page footer. Nothing else in the repo needs to change.
