import os

# Base folder
base_folder = "finvantage-app"

# Folder structure list
folders = [
    base_folder,
    f"{base_folder}/assets",
    f"{base_folder}/assets/css",
    f"{base_folder}/assets/js"
]

# Files to create (empty)
files = [
    f"{base_folder}/index.html",
    f"{base_folder}/assets/css/style.css",
    f"{base_folder}/assets/js/app.js"
]

# Create folders
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"Created folder: {folder}")

# Create empty files
for file in files:
    open(file, "a").close()
    print(f"Created file: {file}")

print("\nFolder structure created successfully!")

