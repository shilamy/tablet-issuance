import shutil
import os

src_dir = r"d:\Projects\tablet-issuance\issuance-frontend\app\api"
dst_dir = r"d:\Projects\tablet-issuance\issuance-frontend\src\app\api"
app_dir = r"d:\Projects\tablet-issuance\issuance-frontend\app"

try:
    if os.path.exists(dst_dir):
        shutil.rmtree(dst_dir)
    shutil.copytree(src_dir, dst_dir)
    print("Copied successfully.")
    try:
        shutil.rmtree(app_dir)
        print("Removed original app dir.")
    except Exception as e:
        print("Removed failed:", e)
        # Try renaming it instead
        os.rename(app_dir, r"d:\Projects\tablet-issuance\issuance-frontend\app_hidden")
        print("Renamed instead.")
except Exception as e:
    print("Error:", e)
