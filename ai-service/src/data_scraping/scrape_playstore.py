"""
scrape_playstore.py

Collects candidate civic-complaint text from Google Play Store reviews
of government / municipal apps using the google-play-scraper library
(no login, no API key, no cost).

Pulls up to MAX_REVIEWS_PER_APP reviews per app (single-page reviews()
call, sorted newest-first), then filters by keyword match in addition to
keeping the full unfiltered set.

Setup:
    pip install google-play-scraper

Usage:
    python scrape_playstore.py

Notes:
    - App IDs are the package name shown in the Play Store URL, e.g.
      https://play.google.com/store/apps/details?id=com.example.app
      -> app_id = "com.example.app"
    - reviews() returns at most MAX_REVIEWS_PER_APP reviews per call (no
      automatic pagination beyond that) -- raise the constant if you want
      more, but very high counts may get rate-limited by the Play Store.
"""

# import csv
# import re
# import time
# from pathlib import Path

# from google_play_scraper import Sort, reviews

# # ---- Config ----------------------------------------------------------

# APPS = {
#     "Swachh Bharat Mission (Urban)": "com.samagragovernance.swm",
#     "Daily Waste Reporting": "com.dailywastereporting",
#     "MyGov India": "in.gov.mygov.android",
#     "MCGM 24x7": "in.cdac.gov.mgov.mcgm",
#     "Punecare (PMC)": "in.gov.pmc.pmccare",
#     "PMC Road Mitra": "com.nyatitechnologies.pmcroadmitra",
#     "Swachhata-MoHUA": "com.ichangemycity.swachhbharat",
#     "UMANG": "in.gov.umang.negd.g2c",
#     "CPGRAMS (MyGrievance)": "nic.org.mygrievance",
#     "Meri Sadak": "com.cdac.pmgsy.citizen",
#     "eGramSwaraj": "nic.in.unified",
# }

# # Keywords used to flag likely complaint text. Case-insensitive substring
# # match against the review content. Expand this list as you review output.
# COMPLAINT_KEYWORDS = [
#     "not working", "doesn't work", "not resolved", "no response",
#     "complaint", "garbage", "pothole", "sewage", "drainage",
#     "water supply", "no water", "electricity", "streetlight",
#     "street light", "not fixed", "waste of time", "useless app",
#     "hangs", "crash", "bug", "pending", "no action", "worst",
#     "waste management", "not collected", "overflowing", "delay",
#     "corrupt", "bribe", "harassment", "not updated", "fake",
#     # Education
#     "school", "college", "teacher", "student", "education",
#     # Agriculture
#     "crop", "farmer", "farm", "agriculture",
#     # Healthcare
#     "hospital", "health", "doctor", "medicine", "clinic",
#     # Water Resources
#     "water", "drinking water", "well", "river", "pipeline",
#     # Environment
#     "pollution", "waste", "forest", "environment",
#     # Energy
#     "power", "transformer", "energy",
#     # Urban Development
#     "road", "traffic", "sewer", "municipal",
#     # Accessibility
#     "wheelchair", "disabled", "ramp", "accessibility",
#     # Public Administration
#     "office", "government", "certificate", "public service",
#     # Rural Livelihoods
#     "livelihood", "self help", "employment", "rural", "handicraft",
# ]

# MAX_REVIEWS_PER_APP = 3000       # how many reviews to pull per app (reviews() requires a count)
# LANG = "en"                      # rerun with "hi", "mr" etc. for regional-language reviews
# COUNTRY = "in"

# OUTPUT_DIR = Path("data/raw/playstore")
# ALL_OUTPUT_FILE = OUTPUT_DIR / "playstore_reviews.csv"
# KEYWORD_OUTPUT_FILE = OUTPUT_DIR / "playstore_reviews_keyword_matched.csv"

# # ---- Script ------------------------------------------------------------

# def matches_keywords(text: str) -> bool:
#     if not text:
#         return False
#     text_lower = text.lower()
#     return any(kw in text_lower for kw in COMPLAINT_KEYWORDS)


# def scrape() -> list[dict]:
#     all_rows = []

#     for app_name, app_id in APPS.items():
#         print(f"[scrape] {app_name} ({app_id}) -- pulling up to {MAX_REVIEWS_PER_APP} reviews...")
#         try:
#             result, _ = reviews(
#                 app_id,
#                 lang=LANG,
#                 country=COUNTRY,
#                 sort=Sort.NEWEST,
#                 count=MAX_REVIEWS_PER_APP,
#             )
#         except Exception as e:
#             print(f"  !! error fetching {app_name}: {e}")
#             continue

#         print(f"  -> pulled {len(result)} reviews")

#         for r in result:
#             all_rows.append(
#                 {
#                     "app_name": app_name,
#                     "app_id": app_id,
#                     "review_id": r.get("reviewId"),
#                     "user_name": r.get("userName"),
#                     "rating": r.get("score"),
#                     "content": r.get("content"),
#                     "thumbs_up": r.get("thumbsUpCount"),
#                     "app_version": r.get("appVersion"),
#                     "at": r.get("at"),
#                     "reply_content": r.get("replyContent"),
#                 }
#             )

#         time.sleep(1)  # be polite between apps

#     return all_rows


# def save_to_csv(rows: list[dict]) -> None:
#     OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

#     fieldnames = [
#         "app_name",
#         "app_id",
#         "review_id",
#         "user_name",
#         "rating",
#         "content",
#         "thumbs_up",
#         "app_version",
#         "at",
#         "reply_content",
#     ]

#     with open(ALL_OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
#         writer = csv.DictWriter(f, fieldnames=fieldnames)
#         writer.writeheader()
#         writer.writerows(rows)
#     print(f"\nSaved {len(rows)} total reviews to {ALL_OUTPUT_FILE}")

#     keyword_rows = [r for r in rows if matches_keywords(r["content"])]
#     with open(KEYWORD_OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
#         writer = csv.DictWriter(f, fieldnames=fieldnames)
#         writer.writeheader()
#         writer.writerows(keyword_rows)
#     print(f"Saved {len(keyword_rows)} keyword-matched reviews to {KEYWORD_OUTPUT_FILE}")


# if __name__ == "__main__":
#     collected = scrape()
#     save_to_csv(collected)


"""
scrape_playstore.py

Collects candidate civic-complaint text from Google Play Store reviews
of government / municipal apps, in Hindi (lang="hi"), using
google-play-scraper (no login, no API key, no cost).

Pulls up to MAX_REVIEWS_PER_APP reviews per app (single-page reviews()
call, sorted newest-first), then filters by Hindi keyword match in
addition to keeping the full unfiltered set.

Setup:
    pip install google-play-scraper

Usage:
    python scrape_playstore.py

Notes:
    - Same APPS list as the English scraper (scrape_playstore.py) -- some
      apps may return 0 reviews in Hindi even if they returned results in
      English, or vice versa, since the Play Store buckets reviews by the
      reviewer's device/account language, not by translating them.
    - If an app consistently returns 0 in both languages, the package id
      is very likely wrong -- verify it manually on the Play Store.
"""

import csv
import time
from pathlib import Path

from google_play_scraper import Sort, reviews

# ---- Config ----------------------------------------------------------

APPS = {
    "Daily Waste Reporting": "com.dailywastereporting",
    "MyGov India": "in.gov.mygov.android",
    "MCGM 24x7": "in.cdac.gov.mgov.mcgm",
    "Punecare (PMC)": "in.gov.pmc.pmccare",
    "PMC Road Mitra": "com.nyatitechnologies.pmcroadmitra",
    "Swachhata-MoHUA": "com.ichangemycity.swachhbharat",
    "UMANG": "in.gov.umang.negd.g2c",
    "CPGRAMS (MyGrievance)": "nic.org.mygrievance",
    "Meri Sadak": "com.cdac.pmgsy.citizen",
    "eGramSwaraj": "nic.in.unified",
}

# Hindi keywords used to flag likely complaint text. Case-sensitive
# substring match against the review content (Devanagari has no case,
# so this is effectively exact-substring). Expand as you review output.
COMPLAINT_KEYWORDS_HI = [
    # General complaint / problem language
    "शिकायत", "समस्या", "नहीं हो रहा", "काम नहीं", "खराब", "रुका हुआ",
    "समाधान नहीं", "जवाब नहीं", "बेकार", "फ्रॉड", "धोखा", "देरी",
    "भ्रष्टाचार", "रिश्वत",
    # Education
    "विद्यालय", "शिक्षा",
    # Agriculture
    "किसान", "फसल", "खेती",
    # Healthcare
    "स्वास्थ्य", "अस्पताल",
    # Water Resources
    "पानी", "जल",
    # Environment
    "प्रदूषण", "कचरा",
    # Energy
    "बिजली",
    # Urban Development
    "शहरी", "सड़क",
    # Accessibility
    "दिव्यांग",
    # Public Administration
    "प्रशासन", "सरकार",
    # Rural Livelihoods
    "रोजगार",
]

MAX_REVIEWS_PER_APP = 3000       # how many reviews to pull per app (reviews() requires a count)
LANG = "hi"                      # Hindi
COUNTRY = "in"

OUTPUT_DIR = Path("data/raw/playstore")
ALL_OUTPUT_FILE = OUTPUT_DIR / "playstore_reviews_hindi.csv"
KEYWORD_OUTPUT_FILE = OUTPUT_DIR / "playstore_reviews_hindi_keyword_matched.csv"

# ---- Script ------------------------------------------------------------

def matches_keywords(text: str) -> bool:
    if not text:
        return False
    return any(kw in text for kw in COMPLAINT_KEYWORDS_HI)


def scrape() -> list[dict]:
    all_rows = []

    for app_name, app_id in APPS.items():
        print(f"[scrape] {app_name} ({app_id}) -- pulling up to {MAX_REVIEWS_PER_APP} reviews (hi)...")
        try:
            result, _ = reviews(
                app_id,
                lang=LANG,
                country=COUNTRY,
                sort=Sort.NEWEST,
                count=MAX_REVIEWS_PER_APP,
            )
        except Exception as e:
            print(f"  !! error fetching {app_name}: {e}")
            continue

        print(f"  -> pulled {len(result)} reviews")

        for r in result:
            all_rows.append(
                {
                    "app_name": app_name,
                    "app_id": app_id,
                    "review_id": r.get("reviewId"),
                    "user_name": r.get("userName"),
                    "rating": r.get("score"),
                    "content": r.get("content"),
                    "thumbs_up": r.get("thumbsUpCount"),
                    "app_version": r.get("appVersion"),
                    "at": r.get("at"),
                    "reply_content": r.get("replyContent"),
                }
            )

        time.sleep(1)  # be polite between apps

    return all_rows


def save_to_csv(rows: list[dict]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "app_name",
        "app_id",
        "review_id",
        "user_name",
        "rating",
        "content",
        "thumbs_up",
        "app_version",
        "at",
        "reply_content",
    ]

    with open(ALL_OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"\nSaved {len(rows)} total reviews to {ALL_OUTPUT_FILE}")

    keyword_rows = [r for r in rows if matches_keywords(r["content"])]
    with open(KEYWORD_OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(keyword_rows)
    print(f"Saved {len(keyword_rows)} keyword-matched reviews to {KEYWORD_OUTPUT_FILE}")


if __name__ == "__main__":
    collected = scrape()
    save_to_csv(collected)