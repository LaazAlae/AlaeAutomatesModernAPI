#!/bin/bash

# Replace primary navigation in all HTML files
for file in /Users/personal/Desktop/APIConnect/views/*.html; do
    if [[ "$file" != *"homepage.html" && "$file" != *"excel_macros.html" && "$file" != *"help.html" && "$file" != *"index.html" ]]; then
        echo "Updating navigation in $file"
        
        # Replace the primary nav
        sed -i '' '/<nav class="modern-nav">/,/<\/nav>/{
            s/<nav class="modern-nav">/<nav class="alae-navbar-primary">/
            s/<div class="nav-container">/<div class="alae-navbar-container">/
            s/<div class="nav-brand"/<div class="alae-brand-logo"/
            s/<span class="brand-text">/<div class="alae-brand-icon"><\/div>\n                <span class="alae-brand-text">/
            s/<div class="nav-right">/<div class="alae-navbar-actions">/
            s/class="nav-item old-version"/class="alae-nav-button"/
        }' "$file"
        
        # Replace the secondary nav
        sed -i '' '/<div class="secondary-nav">/,/<\/div>/{
            s/<div class="secondary-nav">/<nav class="alae-navbar-secondary">/
            s/<div class="secondary-nav-container">/<div class="alae-navbar-secondary-container">\n            <div class="alae-secondary-nav-list">/
            s/class="secondary-nav-item"/class="alae-secondary-nav-item"/g
            s/class="secondary-nav-item active"/class="alae-secondary-nav-item alae-nav-active"/g
        }' "$file"
        
        # Fix closing tags
        sed -i '' 's/<\/div>$/<\/div>\n        <\/div>\n    <\/nav>/' "$file"
        
        # Add professional navigation script
        sed -i '' '/script src="\/js\/script.js"/a\
    <script src="/js/professional-navigation.js"></script>' "$file"
    fi
done