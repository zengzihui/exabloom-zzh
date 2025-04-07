import re

input_path = "message_content.csv"
output_path = "message_content_clean.txt"

with open(input_path, "r", encoding="utf-8") as infile, open(output_path, "w", encoding="utf-8") as outfile:
    for line in infile:
        # Remove all quotes and strip leading/trailing whitespace including tabs, non-breaking spaces, etc.
        cleaned = re.sub(r'^\s+|\s+$', '', line.replace('"', ''))  # stricter trim
        if cleaned:
            outfile.write(cleaned + "\n")
