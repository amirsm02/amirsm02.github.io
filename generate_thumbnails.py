#!/usr/bin/env python3
"""
Generate lower-resolution gallery images while preserving aspect ratio.

Expected folder layout:
    your-site/
    ├── generate_thumbnails.py
    ├── astro/
    │   ├── image1.jpg
    │   └── image2.jpg
    └── astro_thumbnails/       # created automatically

Install Pillow once:
    python3 -m pip install Pillow

Run from your website's root folder:
    python3 generate_thumbnails.py

Optional arguments:
    python3 generate_thumbnails.py --max-size 900 --quality 82
    python3 generate_thumbnails.py --source astro --output astro_thumbnails
"""

from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image, ImageOps

SUPPORTED_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create lower-resolution gallery copies while preserving aspect ratio."
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("astro"),
        help="Folder containing the full-resolution images (default: astro)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("astro_thumbnails"),
        help="Folder for lower-resolution images (default: astro_thumbnails)",
    )
    parser.add_argument(
        "--max-size",
        type=int,
        default=900,
        help="Maximum width or height in pixels (default: 900)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=82,
        help="JPEG/WebP quality from 1 to 100 (default: 82)",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Regenerate thumbnails even when the output is newer than the source",
    )
    return parser.parse_args()


def should_skip(source: Path, destination: Path, overwrite: bool) -> bool:
    if overwrite or not destination.exists():
        return False
    return destination.stat().st_mtime >= source.stat().st_mtime


def save_resized(source: Path, destination: Path, max_size: int, quality: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as image:
        # Respect camera-orientation metadata before resizing.
        image = ImageOps.exif_transpose(image)

        original_size = image.size

        # thumbnail() preserves aspect ratio and never enlarges small images.
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

        extension = destination.suffix.lower()

        save_options: dict[str, object] = {}

        if extension in {".jpg", ".jpeg"}:
            # JPEG cannot store transparency.
            if image.mode not in {"RGB", "L"}:
                background = Image.new("RGB", image.size, "black")
                if "A" in image.getbands():
                    background.paste(image, mask=image.getchannel("A"))
                else:
                    background.paste(image.convert("RGB"))
                image = background
            elif image.mode == "L":
                image = image.convert("RGB")

            save_options.update(
                quality=quality,
                optimize=True,
                progressive=True,
                subsampling="4:2:0",
            )

        elif extension == ".webp":
            if image.mode not in {"RGB", "RGBA"}:
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            save_options.update(
                quality=quality,
                method=6,
            )

        elif extension == ".png":
            save_options.update(
                optimize=True,
                compress_level=9,
            )

        elif extension in {".tif", ".tiff"}:
            save_options.update(
                compression="tiff_lzw",
            )

        image.save(destination, **save_options)

        print(
            f"Created: {destination} "
            f"({original_size[0]}×{original_size[1]} → {image.size[0]}×{image.size[1]})"
        )


def main() -> int:
    args = parse_args()

    if args.max_size < 1:
        raise SystemExit("--max-size must be at least 1")
    if not 1 <= args.quality <= 100:
        raise SystemExit("--quality must be between 1 and 100")
    if not args.source.is_dir():
        raise SystemExit(f"Source folder not found: {args.source.resolve()}")

    files = sorted(
        path for path in args.source.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    if not files:
        print(f"No supported images found in {args.source.resolve()}")
        return 0

    created = 0
    skipped = 0
    failed = 0

    for source in files:
        relative_path = source.relative_to(args.source)
        destination = args.output / relative_path

        if should_skip(source, destination, args.overwrite):
            print(f"Up to date: {destination}")
            skipped += 1
            continue

        try:
            save_resized(
                source=source,
                destination=destination,
                max_size=args.max_size,
                quality=args.quality,
            )
            created += 1
        except Exception as exc:
            print(f"Failed: {source} ({exc})")
            failed += 1

    print(
        f"\nFinished. Created {created}, skipped {skipped}, failed {failed}."
    )

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
