# Blog+Cloudflare double-clickjacking attack

This is a demonstration of a double-clickjacking attack. It uses a fake blog (the [real one](http://parkalex.dev) is great!) and an accurate recreation of a Cloudflare Turnstile page to convince the user to double-click in a precisely calculated location. When the user first begins their click, the tab on top disappears, revealing a GitHub profile, and the user's second click lands perfectly on the Follow button.
