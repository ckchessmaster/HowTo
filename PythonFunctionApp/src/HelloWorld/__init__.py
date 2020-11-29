import logging, uuid

import azure.functions as func

def main(req, outputblob) -> func.HttpResponse:
  # logging calls can be picked up by application insights
  logging.info('Python HTTP trigger function processed a request.')

  name = req.params.get('name')
  if not name:
    try:
      req_body = req.get_json()
    except ValueError:
      pass
    else:
      name = req_body.get('name')

  if name:
    # Create blob to be used by all tests
    text_bytes = name.encode('utf8')
    new_blob = func.blob.InputStream(data=text_bytes)

    outputblob.set(new_blob)

    return func.HttpResponse(f"Blob for user {name} created successfully.")
  else:
    return func.HttpResponse(
      "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
      status_code=200
    )
