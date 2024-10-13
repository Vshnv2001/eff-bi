from supertokens_python.recipe import emailpassword, session, dashboard
from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
)
import os

# this is the location of the SuperTokens core.
# supertokens_config = SupertokensConfig(
#     connection_uri=os.getenv("SUPERTOKENS_CONNECTION_URI"),
#     api_key=os.getenv("SUPERTOKENS_API_KEY"),
# )

app_info = InputAppInfo(
    app_name="eff-bi",
    api_domain=os.getenv("API_DOMAIN"),
    website_domain=os.getenv("WEBSITE_DOMAIN"),
    api_base_path="/api/auth",
    website_base_path="/auth",
)

# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = [
    session.init(),
    emailpassword.init(),
    dashboard.init()
]