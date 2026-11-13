# Video encoding

Scrubbing needs every frame to be a keyframe, otherwise the browser decodes
from the previous keyframe on each seek (choppy, glitchy on Android).

```
ffmpeg -i source.mp4 -c:v libx264 -g 1 -bf 0 -crf 20 -pix_fmt yuv420p -an -movflags faststart src/assets/mbc-pie.mp4
```

- `-g 1` : keyframe on every frame (the important part)
- `-bf 0` : no B-frames
- `-crf 20` : quality (lower = better and heavier)
- `-an` : drop audio, `-movflags faststart` : metadata first for faster load

Check: `ffprobe -v error -select_streams v -show_entries packet=flags -of csv=p=0 file.mp4 | grep -c K`
must equal the number of frames.
