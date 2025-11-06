from datetime import datetime, date
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput

class ShiftSchedulerApp(App):
    def build(self):
        self.layout = BoxLayout(orientation='vertical')
        self.team_input = TextInput(hint_text='Enter Team Number (1-4)', multiline=False)
        self.date_input = TextInput(hint_text='Enter a Date (YYYY-MM-DD)', multiline=False)
        self.result_label = Label()

        submit_button = Button(text="Get Shift")
        submit_button.bind(on_press=self.display_shift)

        self.layout.add_widget(self.team_input)
        self.layout.add_widget(self.date_input)
        self.layout.add_widget(submit_button)
        self.layout.add_widget(self.result_label)

        return self.layout

    def display_shift(self, instance):
        try:
            current_team = int(self.team_input.text)
            verified_date = datetime.strptime(self.date_input.text, "%Y-%m-%d")

            shift_type = self.calculate_shift(current_team, verified_date)

            if shift_type is not None:
                self.result_label.text = f"{shift_type} is the shift for {verified_date.date()}."
            else:
                self.result_label.text = "Error: Could not find shift."
        
        except ValueError as e:
            self.result_label.text = "Error: Invalid input. Please check your entries."

    def calculate_shift(self, team, verified_date):
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

        team_start_dates = {
            1: date(2025, 2, 2),
            2: date(2025, 2, 16),
            3: date(2025, 3, 2),
            4: date(2025, 1, 5),
        }

        team_start_date = team_start_dates.get(team, None)
        if not team_start_date:
            print("Error: invalid team number.")
            return None

        delta = verified_date.date() - team_start_date
        total_days = delta.days

        if total_days < 0:
            return "Error: The date is in the future."

        weeks = total_days // 7
        days = total_days % 7

        weeks_index = weeks % len(rotation)
        return rotation[weeks_index][days]

if __name__ == "__main__":
    ShiftSchedulerApp
