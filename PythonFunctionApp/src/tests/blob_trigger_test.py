import unittest, json
import azure.functions as func

from BlobTrigger import main # import the method we want to test
from unittest import mock

class TestBlobTrigger(unittest.TestCase):
  @mock.patch('builtins.print')
  def test_blob_trigger(self, mock_print):
    # Arrange
    blob_data = 'here is some blob data'
    blob = func.blob.InputStream(data=blob_data.encode('utf8'), name='chris')

    # Act
    main(blob)

    # Assert
    calls = [
      mock.call(f'New blob created with name: chris'), 
      mock.call('Blob contents: here is some blob data')]

    # Check that print was called with our expected results
    mock_print.assert_has_calls(calls, any_order=True)
