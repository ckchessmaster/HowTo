import logging
import azure.functions as func

def main(newBlob: func.InputStream):
  print(f'New blob created with name: {newBlob.name}')
  
  contents = newBlob.read().decode('utf-8')
  
  print(f'Blob contents: {contents}')