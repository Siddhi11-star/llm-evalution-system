import re
from pathlib import Path

def theme_replace(content: str) -> str:
    # Foreground / white text
    content = re.sub(r"color:\s*['\"]#fff+['\"]", "color: 'var(--color-foreground)'", content, flags=re.IGNORECASE)
    content = re.sub(r"color:\s*['\"]#ffffff['\"]", "color: 'var(--color-foreground)'", content, flags=re.IGNORECASE)

    # Muted text colors (descending opacity)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.85\)['\"]", "color: 'var(--color-muted-max)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.75\)['\"]", "color: 'var(--color-muted-max)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.7\)['\"]", "color: 'var(--color-muted-stronger)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.6\)['\"]", "color: 'var(--color-muted-stronger)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.55\)['\"]", "color: 'var(--color-muted-strong)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.5\)['\"]", "color: 'var(--color-muted-strong)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.45\)['\"]", "color: 'var(--color-muted)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.4\)['\"]", "color: 'var(--color-muted)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.35\)['\"]", "color: 'var(--color-muted)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.3\)['\"]", "color: 'var(--color-muted-faint)'", content)
    content = re.sub(r"color:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.25\)['\"]", "color: 'var(--color-muted-weak)'", content)

    # Background colors
    content = re.sub(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.08\)['\"]", "background: 'var(--color-nav-active-bg)'", content)
    content = re.sub(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.06\)['\"]", "background: 'var(--color-border-faint)'", content)
    content = re.sub(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.05\)['\"]", "background: 'var(--color-hover-strong)'", content)
    content = re.sub(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.04\)['\"]", "background: 'var(--color-input-bg)'", content)
    content = re.sub(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.03\)['\"]", "background: 'var(--color-surface)'", content)
    content = re.sub(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.02\)['\"]", "background: 'var(--color-surface-deep)'", content)
    content = re.sub(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.015\)['\"]", "background: 'var(--color-surface-deeper)'", content)
    content = re.sub(r"background:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.01\)['\"]", "background: 'var(--color-surface-deeper)'", content)

    # backgroundColor
    content = re.sub(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.08\)['\"]", "backgroundColor: 'var(--color-nav-active-bg)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.06\)['\"]", "backgroundColor: 'var(--color-border-faint)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.05\)['\"]", "backgroundColor: 'var(--color-hover-strong)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.04\)['\"]", "backgroundColor: 'var(--color-input-bg)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.03\)['\"]", "backgroundColor: 'var(--color-surface)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.02\)['\"]", "backgroundColor: 'var(--color-surface-deep)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.015\)['\"]", "backgroundColor: 'var(--color-surface-deeper)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.01\)['\"]", "backgroundColor: 'var(--color-surface-deeper)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]#0A0A0A['\"]", "backgroundColor: 'var(--color-background)'", content)
    content = re.sub(r"backgroundColor:\s*['\"]#121212['\"]", "backgroundColor: 'var(--color-input-bg)'", content)

    # Border colors
    content = re.sub(r"border:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.12\)['\"]", "border: '1px solid var(--color-border-light)'", content)
    content = re.sub(r"border:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.1\)['\"]", "border: '1px solid var(--color-border-light)'", content)
    content = re.sub(r"border:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.08\)['\"]", "border: '1px solid var(--color-border)'", content)
    content = re.sub(r"border:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.06\)['\"]", "border: '1px solid var(--color-border-faint)'", content)
    content = re.sub(r"border:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.04\)['\"]", "border: '1px solid var(--color-surface-deep)'", content)

    # Directional borders
    content = re.sub(r"borderTop:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.1\)['\"]", "borderTop: '1px solid var(--color-border-light)'", content)
    content = re.sub(r"borderTop:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.08\)['\"]", "borderTop: '1px solid var(--color-border)'", content)
    content = re.sub(r"borderTop:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.06\)['\"]", "borderTop: '1px solid var(--color-border-faint)'", content)
    content = re.sub(r"borderBottom:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.08\)['\"]", "borderBottom: '1px solid var(--color-border)'", content)
    content = re.sub(r"borderBottom:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.06\)['\"]", "borderBottom: '1px solid var(--color-border-faint)'", content)
    content = re.sub(r"borderBottom:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.04\)['\"]", "borderBottom: '1px solid var(--color-surface-deep)'", content)
    content = re.sub(r"borderLeft:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.08\)['\"]", "borderLeft: '1px solid var(--color-border)'", content)
    content = re.sub(r"borderLeft:\s*['\"]1px solid rgba\(255,\s*255,\s*255,\s*0\.06\)['\"]", "borderLeft: '1px solid var(--color-border-faint)'", content)

    # Fill / stroke for SVGs
    content = re.sub(r"fill:\s*['\"]#fff+['\"]", "fill: 'var(--color-foreground)'", content, flags=re.IGNORECASE)
    content = re.sub(r"stroke:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.1\)['\"]", "stroke: 'var(--color-border-light)'", content)
    content = re.sub(r"stroke:\s*['\"]rgba\(255,\s*255,\s*255,\s*0\.08\)['\"]", "stroke: 'var(--color-border)'", content)

    # Global rgba replacements for remaining cases (boxShadow, etc.)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.12\)", "var(--color-border-light)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.1\)", "var(--color-border-light)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.08\)", "var(--color-border)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.06\)", "var(--color-border-faint)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.05\)", "var(--color-hover-strong)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.04\)", "var(--color-surface-deep)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.03\)", "var(--color-surface)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.02\)", "var(--color-surface-deep)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.015\)", "var(--color-surface-deeper)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.01\)", "var(--color-surface-deeper)", content)

    # Remaining muted text
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.85\)", "var(--color-muted-max)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.75\)", "var(--color-muted-max)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.7\)", "var(--color-muted-stronger)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.6\)", "var(--color-muted-stronger)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.55\)", "var(--color-muted-strong)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.5\)", "var(--color-muted-strong)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.45\)", "var(--color-muted)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.4\)", "var(--color-muted)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.35\)", "var(--color-muted)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.3\)", "var(--color-muted-faint)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.25\)", "var(--color-muted-weak)", content)
    content = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.2\)", "var(--color-muted-weak)", content)

    # Hardcoded dark backgrounds in option elements
    content = re.sub(r"background:\s*['\"]#121212['\"]", "background: 'var(--color-input-bg)'", content)
    content = re.sub(r"background:\s*['\"]#0A0A0A['\"]", "background: 'var(--color-background)'", content)

    return content

def process_file(path: Path):
    content = path.read_text(encoding='utf-8')
    new_content = theme_replace(content)
    if new_content != content:
        path.write_text(new_content, encoding='utf-8')
        print(f'Updated: {path}')

def main():
    src = Path('llm-evalution-system-main/judgeai_project/landing_page/src')
    if not src.exists():
        src = Path('src')
    
    for pattern in ['**/*.tsx', '**/*.ts', '**/*.css']:
        for f in src.glob(pattern):
            process_file(f)

if __name__ == '__main__':
    main()
