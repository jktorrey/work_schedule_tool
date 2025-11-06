from datetime import datetime, date  # Add date to imports

### Rotation Schedule ###
# S = Straight (M-F, 8hrs)
# M = Mid (1700-0500)
# D = Day (0500-1700)
# B = Break (off work)

def acquire_team():
    while True:
        user_team = input("Please Enter Team Number (1-4): ")
        # Check if the input is an integer
        try:
            user_team = int(user_team)
            if 1 <= user_team <= 4:
                return user_team
            else:
                print("Error: invalid input. Please enter a whole number between 1-4.")
        except ValueError:
            print("Error: invalid input. Please enter a whole number between 1-4.")

def acquire_date():
    while True:
        user_date = input("Please Enter a Valid Date (YYYY-MM-DD): ")
        try:
            # Try to parse the input
            valid_date = datetime.strptime(user_date, "%Y-%m-%d")
            return valid_date
        except ValueError:
            print("Error: Invalid date format. Please enter a date in YYYY-MM-DD format.")

def calculate_shift(team, date):
    rotation = [
        ["S", "S", "S", "S", "S", "S", "S"],  # week 1
        ["M", "M", "M", "M", "B", "B", "B"],  # week 2
        ["M", "M", "M", "B", "B", "B", "B"],  # week 3
        ["D", "D", "D", "B", "B", "B", "B"],  # week 4
        ["D", "D", "D", "D", "B", "B", "B"],  # week 5
        ["B", "B", "B", "D", "D", "D", "D"],  # week 6
        ["B", "B", "B", "B", "D", "D", "D"],  # week 7
        ["B", "B", "B", "B", "M", "M", "M"],  # week 8
        ["B", "B", "B", "M", "M", "M", "M"],  # week 9
        ["S", "S", "S", "S", "S", "S", "S"]   # week 10
    ]

    # Start dates for each team's rotation
    team_start_dates = {
        1: date(2025, 2, 2),
        2: date(2025, 2, 16),
        3: date(2025, 3, 2),
        4: date(2025, 1, 5),
    }

    # Get the team's start date
    if team in team_start_dates:
        team_start_date = team_start_dates[team]
    else:
        print("Error: invalid team number.")
        return None

    # Calculates the number of days between team's rotation start date and the user's entered date
    delta = date - team_start_date
    total_days = delta.days

    # Calculate weeks and days
    weeks = total_days // 7  # No need to subtract 1
    days = total_days % 7     # No need to subtract 1

    # Normalize the weeks to get a valid index
    weeks_index = weeks % len(rotation)

    # Access the shift in the rotation schedule
    shift = rotation[weeks_index][days]

    return shift

def main():
    current_team = acquire_team()
    verified_date = acquire_date()
    shift_type = calculate_shift(current_team, verified_date)

    if shift_type is not None:
        print(f"{shift_type} is the shift for {verified_date.date()}.")

if __name__ == "__main__":
    main()
