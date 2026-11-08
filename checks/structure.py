from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
root = Path(__file__).resolve().parents[1]
class Check(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.refs=[]; self.headings=0
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='h1': self.headings+=1
        for k in ['href','src']:
            if k in a: self.refs.append(a[k])
        if tag=='a' and a.get('target')=='_blank': assert 'noopener' in a.get('rel','')
c=Check(); c.feed((root/'index.html').read_text())
assert len(c.ids)==len(set(c.ids)), 'Duplicate IDs'
assert c.headings==1
for ref in c.refs:
    if ref.startswith('#'): assert ref[1:] in c.ids, ref
    elif not urlsplit(ref).scheme: assert (root/ref).is_file(), ref
assert 'ScrollCraft.mount(document.body)' in (root/'assets/site.js').read_text()
assert 'html:not(.sc-ready) [data-sc-in]' in (root/'assets/style.css').read_text()
assert '<noscript>' in (root/'index.html').read_text()
print('PASS: local assets, anchors, unique IDs, heading, external link protection and no-JS fallback rules.')
