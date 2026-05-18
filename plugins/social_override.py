"""MkDocs hook that sets og:image and twitter:image meta tags from a
page's `image:` frontmatter field.

Works in two modes:
- If the social plugin is active: replaces its auto-generated card URLs
  (which point to /assets/images/social/...) with the custom image.
- If the social plugin is absent: injects the og:image / twitter:image
  tags directly into <head> so previews still work.

Loaded via the `hooks:` entry in mkdocs.yml (NOT under `plugins:`):

    hooks:
      - plugins/social_override.py

Usage — add to any page frontmatter:

    ---
    image: img/cover.png
    ---
"""

import re


def on_page_context(context, page, config, **kwargs):
    """Stash the custom image path on the page for the post_page hook."""
    if page.meta and 'image' in page.meta:
        page.custom_image = page.meta['image']
    return context


def on_post_page(html, page, config, **kwargs):
    """Inject or replace og:image / twitter:image with the custom cover."""
    if not hasattr(page, 'custom_image'):
        return html

    site_url = config['site_url'].rstrip('/')
    image_path = '/' + page.custom_image.lstrip('/')
    full_image_url = site_url + image_path

    og_tag      = f'<meta property="og:image" content="{full_image_url}">'
    twitter_tag = f'<meta property="twitter:image" content="{full_image_url}">'

    # Replace social-plugin-generated tags if present
    og_pattern = re.compile(r'<meta\s+property="og:image"[^>]*?>')
    replaced_og = False
    for tag in og_pattern.findall(html):
        if '/assets/images/social/' in tag:
            html = html.replace(tag, og_tag)
            replaced_og = True

    twitter_pattern = re.compile(r'<meta\s+(?:property|name)="twitter:image"[^>]*?>')
    replaced_twitter = False
    for tag in twitter_pattern.findall(html):
        if '/assets/images/social/' in tag:
            attr = 'property' if 'property=' in tag else 'name'
            html = html.replace(tag, f'<meta {attr}="twitter:image" content="{full_image_url}">')
            replaced_twitter = True

    # Inject tags when the social plugin is not active
    if not replaced_og or not replaced_twitter:
        inject = ''
        if not replaced_og:
            inject += f'\n    {og_tag}'
        if not replaced_twitter:
            inject += f'\n    {twitter_tag}'
        html = html.replace('</head>', f'{inject}\n  </head>', 1)

    return html
