import logging
import azure.functions as func

def main(new_blob: func.InputStream):
  print(f'New blob created with name: {new_blob.name}')
  
  contents = new_blob.read().decode('utf-8')
  
  print(f'Blob contents: {contents}')