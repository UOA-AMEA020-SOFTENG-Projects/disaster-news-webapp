import os
import shutil

# Function to check for the presence of a browser executable
def detect_browser():
    browsers = ["chrome", "firefox", "msedge", "safari"]
    for browser in browsers:
        if browser == "chrome" and shutil.which("google-chrome") or shutil.which("chrome"):
            return "chrome"
        elif browser == "firefox" and shutil.which("firefox"):
            return "firefox"
        elif browser == "msedge" and shutil.which("msedge"):
            return "msedge"
        elif browser == "safari" and shutil.which("safari"):
            return "safari"
    return "firefox"  # Default to Firefox if no other browser is found

BROWSER = detect_browser()
