from supertokens_python.recipe import emailpassword, session, dashboard
from supertokens_python import (
    InputAppInfo,
)

app_info = InputAppInfo(
    app_name="eff-bi",
    api_domain="https://eff-bi.onrender.com",
    website_domain="https://eff-bi.vercel.app",
)

# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = [
    session.init(),
    emailpassword.init(),
    dashboard.init()
]