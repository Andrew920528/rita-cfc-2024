from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai import Credentials
import json


print( json.dumps( ModelTypes._member_names_, indent=2 ) )
credentials = Credentials(
                   url = "https://us-south.ml.cloud.ibm.com",
                   api_key = "ly56_0ykPds79Fd4TlYPgNL1Ya_HuqyZxKe5wsPEb2Yl"
                  )

client = APIClient(credentials)
print(client)