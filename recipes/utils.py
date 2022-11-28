from decouple import config
import requests

API_KEY = config('API_KEY')
HEADERS = {
    "x-api-key": API_KEY,
    'includeNutrition': 'false'
}


def get_spoonacular_recipe_by_ingredient(string: str):
    URL = "https://api.spoonacular.com/recipes/findByIngredients"
    querystring = {"ingredients": string, "number": "5", 'includeNutrition': 'false'}
    response = requests.request("GET", URL, headers=HEADERS, params=querystring)
    data = response.json()
    return data


def get_spoonacular_recipe_by_id(recipe_id: int):
    RECIPE_URL = f"https://api.spoonacular.com/recipes/{recipe_id}/information?includeNutrition=false"
    response = requests.request("GET", RECIPE_URL, headers=HEADERS)
    data = response.json()
    return data
