from datetime import date, timedelta


def date_for_weekday(day: int):
    today = date.today()
    # weekday returns the offsets 0-6
    # If you need 1-7, use isoweekday
    weekday = today.weekday()
    date_of_weekday = today + timedelta(days=day - weekday)
    date_of_weekday = date_of_weekday.strftime('%Y-%m-%d')
    return date_of_weekday
