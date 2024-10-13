from supertokens_python.recipe import emailpassword, session, dashboard
from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
)
import dotenv
import os
dotenv.load_dotenv()

# this is the location of the SuperTokens core.
supertokens_config = SupertokensConfig(
    connection_uri=os.getenv("SUPERTOKENS_CONNECTION_URI"))

app_info = InputAppInfo(
    app_name="eff-bi",
    api_domain=os.getenv("API_DOMAIN"),
    website_domain=os.getenv("WEBSITE_DOMAIN"),
)

# recipeList contains all the modules that you want to
# use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
recipe_list = [
    session.init(),
    emailpassword.init(),
    dashboard.init()
]