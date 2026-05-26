from pathlib import Path
import re

path = Path('src/navigation/AppNavigator.web.tsx')
text = path.read_text()

needle = "currentLang === 'AR' ?"
idx = 0
count = 0
out = []
while True:
    pos = text.find(needle, idx)
    if pos == -1:
        out.append(text[idx:])
        break
    out.append(text[idx:pos])
    start = pos + len(needle)
    while start < len(text) and text[start].isspace():
        start += 1
    if start >= len(text):
        out.append(text[pos:])
        break
    quote = text[start]
    if quote not in "'\"`":
        out.append(text[pos:])
        break
    i = start + 1
    while i < len(text):
        if text[i] == "\\":
            i += 2
            continue
        if text[i] == quote:
            i += 1
            break
        i += 1
    ar = text[start:i]
    j = i
    while j < len(text) and text[j].isspace():
        j += 1
    if text[j:j+1] != ':':
        out.append(text[pos:])
        break
    j += 1
    while j < len(text) and text[j].isspace():
        j += 1
    quote2 = text[j]
    if quote2 not in "'\"`":
        out.append(text[pos:])
        break
    k = j + 1
    while k < len(text):
        if text[k] == "\\":
            k += 2
            continue
        if text[k] == quote2:
            k += 1
            break
        k += 1
    fr = text[j:k]
    count += 1
    out.append(f"translate('web.autoText{count}', {{ defaultValue: currentLang === 'AR' ? {ar} : {fr} }})")
    idx = k

new_text = ''.join(out)
path.write_text(new_text)
print(count)
