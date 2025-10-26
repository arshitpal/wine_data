import pandas as pd

# Read the CSV file
df = pd.read_csv('Wine Quality Dataset.csv')

# Remove any rows with missing values
df.dropna(inplace=True)

# Save to JSON file
df.to_json('wine_data.json', orient='records')